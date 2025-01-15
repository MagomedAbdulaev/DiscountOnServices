from django.contrib import admin
from .models import *
from unfold.admin import ModelAdmin
from modeltranslation.admin import TranslationAdmin


class ServicesAdmin(ModelAdmin, TranslationAdmin):

    list_display = ('name', 'custom_image_tag_column', )
    list_display_links = ('name', 'custom_image_tag_column', )
    search_fields = ('name', )
    prepopulated_fields = {'slug': ('name',)}

    def custom_image_tag_column(self, obj):
        return obj.image_tag()

    custom_image_tag_column.short_description = 'Картинка сервиса'


class PlanDurationAdmin(ModelAdmin):

    list_display = ('duration', )
    list_display_links = ('duration', )


class PlanAdmin(ModelAdmin, TranslationAdmin):

    list_display = ('name', 'price', 'duration', 'service')
    list_display_links = ('name', 'price', 'duration', 'service')
    search_fields = ('name', )
    list_filter = ('duration', )
    autocomplete_fields = ['clauses', ]


class ClauseAdmin(ModelAdmin, TranslationAdmin):

    list_display = ('name', )
    list_display_links = ('name', )
    search_fields = ('name', )


class QuestionsAdmin(ModelAdmin, TranslationAdmin):

    list_display = ('name', )
    list_display_links = ('name', )
    search_fields = ('name', )


class SubscriptionAdmin(ModelAdmin):

    list_display = ('plan', 'date_created', 'get_date_end', )
    list_display_links = ('plan', 'date_created', 'get_date_end', )
    search_fields = ('plan', )


class SubscriptionBidAdmin(ModelAdmin):

    list_display = ('email', 'date_created', 'phone', )
    list_display_links = ('email', 'date_created', 'phone', )
    search_fields = ('username', )


class ClientAdmin(ModelAdmin):

    list_display = ('username', 'email', )
    list_display_links = ('username', 'email', )
    search_fields = ('username', 'email', )
    autocomplete_fields = ['subscriptions', ]


admin.site.register(Services, ServicesAdmin)
admin.site.register(PlanDuration, PlanDurationAdmin)
admin.site.register(Plan, PlanAdmin)
admin.site.register(Clause, ClauseAdmin)
admin.site.register(Questions, QuestionsAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(SubscriptionBid, SubscriptionBidAdmin)
admin.site.register(Client, ClientAdmin)

