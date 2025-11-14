from django.shortcuts import render
from rest_framework import viewsets
from .models import Radiodata
from .serializers import RadiodataSerializer

class RadiodataViewSet(viewsets.ModelViewSet):
    queryset = Radiodata.objects.all()
    serializer_class = RadiodataSerializer