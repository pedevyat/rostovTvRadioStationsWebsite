from rest_framework import serializers
from .models import Radiodata

class RadiodataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Radiodata
        fields = '__all__'