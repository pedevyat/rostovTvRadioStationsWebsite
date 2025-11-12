from django.db import models

class User(models.Model):
    freq = models.DecimalField(
        max_digits=10,
        decimal_places=3, # цифр после запятой
        verbose_name='МГц'
    )

    station = models.CharField(
        max_length=100,
        verbose_name='Канал'
    )

    city = models.CharField(
        max_length=100,
        verbose_name='Город'
    )

    place = models.CharField( # место, где находится передатчик и антенна
        max_length=100,
        verbose_name='Место антенны'
    )

    trp = models.DecimalField( # мощность (с РКН)
        max_digits=10,
        decimal_places=3,
        verbose_name="Мощность"
    )

    is_works = models.BooleanField( # статус передатчика: работает/временно не работает/планируется/отключен
        default=False, 
        verbose_name='Статус'
    )

    is_rds = models.BooleanField(
        default=False,
        verbose_name='Есть RDS?'
    )

    updated_at = models.DateTimeField(
        auto_now=True,      # при каждом сохранении
        verbose_name='Последнее обновление'
    )