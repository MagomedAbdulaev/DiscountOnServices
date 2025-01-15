from modeltranslation.translator import register, TranslationOptions
from .models import Services, Plan, Clause, Questions, Subscription, Client


@register(Services)
class ServicesTranslationOptions(TranslationOptions):
    fields = ('name', 'description')


@register(Plan)
class PlanTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Clause)
class ClauseTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Questions)
class QuestionsTranslationOptions(TranslationOptions):
    fields = ('name', 'answer')





