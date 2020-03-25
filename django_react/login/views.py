from django.shortcuts import render
from .models import Person
from .serializers import LoginSerializer
from rest_framework import generics

class LoginListCreate(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = LoginSerializer

