from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.safestring import mark_safe


class Services(models.Model):

    name = models.CharField(max_length=30, verbose_name='Название сервиса')
    slug = models.SlugField(max_length=50, unique=True, verbose_name='Слаг сервиса')
    description = models.TextField(max_length=150, verbose_name='Описание сервиса')
    image = models.ImageField(upload_to='images', verbose_name='Картинка сервиса')
    color = models.CharField(max_length=16, verbose_name='Цвет сервиса')

    def __str__(self):
        return self.name

    def image_tag(self):
        if self.image.url is not None:
            return mark_safe('<img src="{}" height="50"/>'.format(self.image.url))
        else:
            return ""

    class Meta:
        verbose_name = 'Сервис'
        verbose_name_plural = 'Сервисы'
        ordering = ['name', ]


class PlanDuration(models.Model):

    duration = models.PositiveSmallIntegerField(verbose_name='Длительность плана в месяцах')

    def __str__(self):
        return f'{self.duration} months'

    class Meta:
        verbose_name = 'Длительность плана'
        verbose_name_plural = 'Длительность планов'
        ordering = ['duration', ]


class Plan(models.Model):

    name = models.CharField(max_length=20, verbose_name='Название плана')
    price = models.PositiveSmallIntegerField(verbose_name='Стоимость плана')
    duration = models.ForeignKey(to='PlanDuration', on_delete=models.CASCADE, verbose_name='Длительность плана')
    clauses = models.ManyToManyField(to='Clause', verbose_name='Пункты для плана')
    service = models.ForeignKey(
        to='Services',
        on_delete=models.CASCADE,
        related_name='plans',
        verbose_name='Сервис',
        null=True,  # Если нужно позволить плану не быть связанным с сервисом
        blank=True
    )

    def __str__(self):
        return f'{self.name} - {self.price}$ - {self.duration} - {self.service.name}'

    class Meta:
        verbose_name = 'План'
        verbose_name_plural = 'Планы'
        ordering = ['name', ]


class Clause(models.Model):

    name = models.CharField(max_length=140, verbose_name='Название пункта')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Пункт для плана'
        verbose_name_plural = 'Пункт для плана'
        ordering = ['name', ]


class Questions(models.Model):

    name = models.CharField(max_length=120, verbose_name='Название вопроса')
    answer = models.TextField(max_length=240, verbose_name='Ответ на вопрос')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'
        ordering = ['name', ]


class Subscription(models.Model):

    plan = models.ForeignKey(to='Plan', on_delete=models.CASCADE, verbose_name='План подписки')
    date_created = models.DateTimeField(default=timezone.now, verbose_name='Дата создания подписки')
    status = models.BooleanField(default=False, verbose_name='Статус подписки')

    def get_date_end(self):
        if self.plan and self.plan.duration:
            # Добавляем количество месяцев из self.plan.duration.duration
            date_end = self.date_created + relativedelta(months=self.plan.duration.duration)
            return date_end.strftime('%Y-%m-%d')  # Преобразуем дату в строку
        return None  # Если план или длительность отсутствуют, возвращаем None

    def __str__(self):
        return f'{self.plan.service.name} - {self.plan.duration.duration} месяцев'

    class Meta:
        verbose_name = 'Подписка'
        verbose_name_plural = 'Подписки'
        ordering = ['-date_created', ]


class SubscriptionBid(models.Model):

    date_created = models.DateTimeField(default=timezone.now, verbose_name='Дата создания заявки')
    username = models.CharField(max_length=64, verbose_name='Имя пользователя подававшего на заявку')
    email = models.EmailField(max_length=64, verbose_name='E-mail пользователя подававшего на заявку')
    phone = models.CharField(max_length=12, verbose_name='Телефон пользователя подававшего на заявку')

    def __str__(self):
        return f'{self.username} - {self.date_created}'

    class Meta:
        verbose_name = 'Заявка на подписку'
        verbose_name_plural = 'Заявки на подписки'
        ordering = ['-date_created', ]


class Client(AbstractUser):

    email = models.EmailField(max_length=60, unique=True, verbose_name='Эл. почта пользователя')
    subscriptions = models.ManyToManyField(to='Subscription', blank=True, verbose_name='Подписки пользователя')
