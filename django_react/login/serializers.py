from rest_framework import serializers
from .models import Person

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('username', 'password', 'email', 'isStudent')