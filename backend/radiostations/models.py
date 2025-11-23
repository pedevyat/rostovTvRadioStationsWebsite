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

    class Meta:
        verbose_name = 'Данные радиостанции'
        verbose_name_plural = 'Данные радиостанций'
        ordering = ['freq']  # Сортировка по частоте
        indexes = [
            models.Index(fields=['freq']),
            models.Index(fields=['city']),
            models.Index(fields=['is_works']),
        ]