from django.urls import path
from .views import *


urlpatterns = [
    # path('check_payment/', check_payment),
    path('tokenize_card/', tokenize_card),
    path('services_list/', services_list),
    path('service_detail/', service_detail),
    path('questions_list/', questions_list),
    path('auth_user/', auth_user),
    path('forget_password/', forget_password),
    path('new_password/', new_password),
    path('activate_email_password/', activate_email_password),
    path('logout_user/', logout_user),
    path('auth_status/', auth_status),
    path('info_user/', info_user),
    path('change_user_info/', change_user_info),
    path('subscription_bid/', subscription_bid),
    path('registration_user/', registration_user),
    path('activate_email/', activate_email),
]
