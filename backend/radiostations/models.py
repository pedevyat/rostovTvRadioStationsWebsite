from django.db import models

class Radiodata(models.Model):

    STATUS_CHOICES = [
        ('working', 'Работает'),
        ('temporary_off', 'Временно не работает'),
        ('planned', 'Планируется'),
        ('disabled', 'Отключен'),
    ]

    freq = models.DecimalField(
        max_digits=10,
        decimal_places=3, # цифр после запятой
        verbose_name='МГц'
    )

    station = models.CharField(
        max_length=100,
        verbose_name='Канал'
    )

    local_station = models.CharField(
        max_length=100,
        verbose_name='Местная программа',
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        verbose_name='Город'
    )

    place = models.CharField( # место, где находится передатчик и антенна
        max_length=200,
        verbose_name='Место антенны',
        help_text='Адрес или место установки передатчика и антенны',
        blank=True,
        null=True
    )

    trp = models.DecimalField( # мощность (с РКН)
        max_digits=10,
        decimal_places=3,
        verbose_name="Мощность"
    )

    is_works = models.CharField( # статус передатчика: работает/временно не работает/планируется/отключен
        max_length=20,
        choices=STATUS_CHOICES,
        default='planned',
        verbose_name='Статус передатчика'
    )

    is_rds = models.BooleanField(
        default=False,
        verbose_name='Есть RDS?'
    )

    asl = models.IntegerField(
        #max_digits=4,
        verbose_name="Высота над уровнем моря",
        blank=True,
        null=True
    )

    ant = models.IntegerField(
        #max_digits=3,
        verbose_name="Высота установки передатчика",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    online = models.CharField(
        max_length=1000,
        blank=True,
        null=True,
        verbose_name="Онлайн"
    )

    detailed_information = models.TextField(
        verbose_name="Детали",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.station} ({self.freq} МГц) - {self.city}"
    
    def save(self, *args, **kwargs):
        """Автоматически заполняем asl при сохранении"""
        if not self.asl and self.place:
            self.asl = self.get_asl_by_location()
            
    
        super().save(*args, **kwargs)

    def get_asl_by_location(self):
        "Определение высоты над уровнем моря"
        location_asl_map = {
            'Ростов-на-Дону': {
                'ОРТПЦ': 82,
                'Текучёва': 84,
                'Каяни': 86,
                'Володарского': 86,
                'Театральный': 83,
            },
            'Азов': {
                'Элеватор': 46,
            },
            'Таганрог': {
                'Некрасовский': 31,
                '7-й Новый переулок, 100-5': 63,
                'РТС': 33,
                'Кузробот': 34,
                'Поляковское': 31,
                '7-й Новый переулок, 108': 69
            },
            'Шахты': {
                'РТС': 127
            },
            'Новошахтинск': {
                'Харьковская': 179,
            },
            'Красный Сулин': {
                'РТС': 160,
            }
            
        }

        city_map = location_asl_map.get(self.city, {})

        for place_key, asl_value in city_map.items():
            if place_key in self.place:
                return asl_value
            
        
            

    class Meta:
        verbose_name = 'Данные радиостанции'
        verbose_name_plural = 'Данные радиостанций'
        ordering = ['freq']  # Сортировка по частоте
        indexes = [
            models.Index(fields=['freq']),
            models.Index(fields=['city']),
            models.Index(fields=['is_works']),
        ]