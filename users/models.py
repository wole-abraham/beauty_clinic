from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):

    email = models.EmailField(unique=True)
    birth_date = models.DateField(null=True)
    user_location = models.CharField(max_length=50, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    def fullname(self):
        return f'{self.first_name} {self.last_name}'
    
    def __str__(self):
        return self.username

class Location(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    def __str__(self):
        return f" id: {self.user.id} ({self.latitude}, {self.longitude})"
