from django.db import models

class Person(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    email = models.CharField(max_length=40)
    isStudent = models.BooleanField(default = True)

