import threading
from django.core.mail import EmailMessage


class EmailThread(threading.Thread):
    def __init__(self, subject, html_content, recipient_list, sender):
        self.subject = subject
        self.recipient_list = recipient_list
        self.html_content = html_content
        self.sender = sender
        threading.Thread.__init__(self)

    def run(self):
        msg = EmailMessage(self.subject, self.html_content, self.sender, self.recipient_list)
        msg.content_subtype = 'html'
        msg.send()


def send_html_mail(subject, html_content, recipient_list, sender):
    EmailThread(subject, html_content, recipient_list, sender).start()


# Аргумент email обозначает, этот шаблон для активации почты или сброса пароля
def get_mail_template(email, code):
    password_or_email = 'подтверждения почты' if email else 'сброса пароля'
    template = f'<h1 style="text-align: center; font-size: 32px; display: flex;">DiscountOnServices</h1>' \
               f'' \
               f'' \
               f'<p>Код для {password_or_email}: <b style="color: #21628c; font-size: 18px;">{code}</b>' \
               f' </p><p>Если вы не вводили свою почту на сайте DiscountOnServices - проигнорируйте это письмо</p>'
    return template


