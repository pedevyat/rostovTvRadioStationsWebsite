from django.contrib import admin
from .models import Radiodata

@admin.register(Radiodata)
class RadiodataAdmin(admin.ModelAdmin):
    list_display = [
        'station', 
        'local_station',
        'freq', 
        'city', 
        'trp', 
        'is_works', 
        'is_rds',
        'updated_at'
    ]
    list_filter = ['city', 'is_works', 'is_rds']
    search_fields = ['station', 'local_station','city', 'place']
    list_editable = ['is_works', 'is_rds']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Главная информация', {
            'fields': ('station', 'local_station', 'freq', 'city', 'place')
        }),
        ('Технические параметры', {
            'fields': ('trp', 'is_works', 'is_rds')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )