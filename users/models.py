from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class Clients(AbstractUser):

    email = models.EmailField(unique=True)
    birth_date = models.DateField(null=True)
    country = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    gender = models.CharField(max_length=50, default='Female', choices=[('Male', 'Male'), ('Female', 'Female')], null=True)
    phone_number = models.CharField(max_length=15)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    def fullname(self):
        return f'{self.first_name} {self.last_name}'
    
    def __str__(self):
        return self.username

class Location(models.Model):

    user = models.ForeignKey(Clients, on_delete=models.CASCADE)
    latitude = models.DecimalField(decimal_places=6, max_digits=9)
    longitude = models.DecimalField(decimal_places=6, max_digits=9)
    country = models.CharField(max_length=200, null=True)
    state = models.CharField(max_length=200, null=True)

    def __str__(self):
        return f" id: {self.user.id} ({self.latitude}, {self.longitude})"
