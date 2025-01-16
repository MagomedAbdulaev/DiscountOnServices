import datetime
import json
import random
import uuid

from django.views.decorators.csrf import csrf_exempt
from yookassa import Configuration, Payment
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from core import settings
from .serializers import *
from django.http import JsonResponse, HttpResponseRedirect
from .utils import send_html_mail, get_mail_template


def services_list(request):

    language = request.GET.get('language', 'en')
    services = Services.objects.all()

    return JsonResponse(serialize_services(services, language), safe=False)


def service_detail(request):

    language = request.GET.get('language', 'en')
    slug = request.GET.get('slug', 'not_found_slug')
    try:
        service = Services.objects.get(slug=slug)
        return JsonResponse(serialize_service_detail(service, language), safe=False)
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'error', 'error': 'not found'})


def questions_list(request):

    language = request.GET.get('language', 'en')
    questions = Questions.objects.all()

    return JsonResponse(serialize_questions(questions, language), safe=False)


def activate_email(request):

    if json.loads(request.body.decode())['email']:

        email = json.loads(request.body.decode())['email']
        code = json.loads(request.body.decode())['code']

        # Получаем данные из сессии
        session_data = request.session.get(f'activate_email_code_{email}')

        if code != str(session_data['code']):
            return JsonResponse({'status': 'error', 'error_text': 'invalid code'})

        if not session_data:
            return JsonResponse({'status': 'error', 'error_text': 'Unexpected error, reload the page'})

        # Проверяем время жизни ссылки
        expiration_time = datetime.datetime.fromisoformat(session_data['expiration_time'])
        if datetime.datetime.now() > expiration_time:
            return JsonResponse({'status': 'error', 'error_text': "Time's up, try again"})

        # Активируем пользователя

        password = session_data['password']
        username = session_data['username']

        user = Client.objects.create(
            username=username,
            email=email,
            password=make_password(password),
        )

        user.save()

        login(request, user)

        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'error', 'error_text': "Unexpected error, reload the page"})


def activate_email_password(request):

    if json.loads(request.body.decode())['email']:

        email = json.loads(request.body.decode())['email']
        code = json.loads(request.body.decode())['code']

        # Получаем данные из сессии
        session_data = request.session.get(f'activate_email_code_{email}')

        if code != str(session_data['code']):
            return JsonResponse({'status': 'error', 'error_text': 'invalid code'})

        if not session_data:
            return JsonResponse({'status': 'error', 'error_text': 'Unexpected error, reload the page'})

        # Проверяем время жизни ссылки
        expiration_time = datetime.datetime.fromisoformat(session_data['expiration_time'])
        if datetime.datetime.now() > expiration_time:
            return JsonResponse({'status': 'error', 'error_text': "Time's up, try again"})

        return JsonResponse({'status': 'ok'})
    else:
        return JsonResponse({'status': 'error', 'error_text': "Unexpected error, reload the page"})


def generate_email_code(request, email, username, password):

    # Устанавливаем время истечения
    expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=50)

    code = random.randint(100000, 999999)

    # Сохраняем данные в сессии
    request.session[f'activate_email_code_{email}'] = {
        'code': code,
        'username': username,
        'email': email,
        'password': password,
        'expiration_time': str(expiration_time),
    }

    request.session.modified = True

    return code


def generate_password_code(request, email, username):

    # Устанавливаем время истечения
    expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=50)

    code = random.randint(100000, 999999)

    # Сохраняем данные в сессии
    request.session[f'activate_email_code_{email}'] = {
        'code': code,
        'username': username,
        'email': email,
        'expiration_time': str(expiration_time),
    }

    request.session.modified = True

    return code


def auth_user(request):

    auth_data = json.loads(request.body.decode())

    email = auth_data['email']
    password = auth_data['password']

    try:
        user = Client.objects.get(email=email)

        if user.check_password(password):
            login(request, user)
            return JsonResponse({'status': 'ok'})
        else:
            return JsonResponse({'status': 'error', 'password': 'Invalid password'})
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'error', 'email': 'This email doesnt exist'})


def registration_user(request):

    registration_data = json.loads(request.body.decode())

    username = registration_data['username']
    email = registration_data['email']
    try:
        user = Client.objects.get(username=username)
        return JsonResponse({'status': 'error', 'username': 'This username is taken'})
    except ObjectDoesNotExist:
        try:
            user = Client.objects.get(email=email)
            return JsonResponse({'status': 'error', 'email': 'This email is taken'})
        except ObjectDoesNotExist:
            password = registration_data['password']
            activation_email_code = generate_email_code(request, email, username, password)  # Сохраняем код в сессию
            mail_template = get_mail_template(True, activation_email_code)  # Шаблон письма
            send_html_mail(
                'DiscountOnServices',
                mail_template,
                [email, ],
                settings.EMAIL_HOST_USER
            )

            return JsonResponse({'status': 'ok', })


def auth_status(request):

    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    else:
        return JsonResponse({'authenticated': False})


def info_user(request):

    language = request.GET.get('language', 'en')

    if request.user.is_authenticated:
        return JsonResponse(serialize_info_user(request.user, language))
    else:
        return JsonResponse({'status': 'error', 'error': 'User is not authenticated'})


def change_user_info(request):

    username = request.GET.get('userName')

    user = Client.objects.filter(username=username).first()
    if user:
        return JsonResponse({'status': 'error', 'error': 'This username is taken'})

    request.user.username = username
    request.user.save()

    return JsonResponse({'status': 'ok'})


def subscription_bid(request):

    bid_data = json.loads(request.body.decode())
    email = bid_data['email']
    phone = bid_data['phone']
    username = bid_data['username']

    bid = SubscriptionBid.objects.create(
        email=email,
        phone=phone,
        username=username
    )

    bid.save()

    return JsonResponse({'status': 'ok'})


def logout_user(request):

    logout(request)

    return JsonResponse({'status': 'ok'})


def forget_password(request):

    email = json.loads(request.body.decode())['email']

    try:
        user = Client.objects.get(email=email)
        password_forget_code = generate_password_code(request, email, user.username)

        mail_template = get_mail_template(False, password_forget_code)  # Шаблон письма
        send_html_mail(
            'DiscountOnServices',
            mail_template,
            [email, ],
            settings.EMAIL_HOST_USER
        )

        return JsonResponse({'status': 'ok', })
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'error', 'error_text': 'No such email found'})


def new_password(request):

    email = json.loads(request.body.decode())['email']
    password = json.loads(request.body.decode())['password']

    try:
        user = Client.objects.get(email=email)

        user.password = make_password(password)
        user.save()

        login(request, user)

        return JsonResponse({'status': 'ok', })
    except ObjectDoesNotExist:
        return JsonResponse({'status': 'error', 'error_text': 'No such email found'})


def tokenize_card(request):

    if request.method == 'POST':
        data = json.loads(request.body)

        Configuration.account_id = '1012980'
        Configuration.secret_key = 'test_zuXs9etn0_N2IiNCVpkre8zWiZSpbGVYDFec-zHsoRs'

        card_number = data.get('cardNumber')
        expiration_date = data.get('expirationDate')
        cvc = data.get('cvcNumber')
        price_plan = data.get('pricePlan')

        if not all([card_number, expiration_date, cvc, price_plan]):
            return JsonResponse({'success': False, 'error': 'Invalid input data'}, status=400)

        # Разделение expiration_date на месяц и год
        expiry_month, expiry_year = expiration_date.split('/')

        # Отправка данных карты в ЮKassa для токенизации
        payment = Payment.create({
            "amount": {
                "value": price_plan,
                "currency": "RUB",
            },
            "payment_method_data": {
                "type": "bank_card",
                "card": {
                    "number": card_number,
                    "expiry_month": expiry_month,
                    "expiry_year": f"20{expiry_year}",  # Преобразование ГГ в полный год
                    "cvc": cvc,
                },
            },
            "confirmation": {
                "type": "redirect",
                "return_url": "http://localhost:5173/",
            },
            "capture": True,
            "description": "Оплата подписки",
        }, uuid.uuid4())

        # Возврат URL для подтверждения платежа
        return JsonResponse({'success': True, 'confirmation_url': payment.confirmation.confirmation_url})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid HTTP method'}, status=405)
