from django.db import models
from django.conf import settings


class Service(models.Model):

    servicetype= models.CharField(max_length=50, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.servicetype

class Appointment(models.Model):
    choices = [
        ('Pending', 'Pending'),
        ('Scheduled', 'Scheduled'),
        ('Cancelled', 'Cancelled'),

    ]

    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    time = models.DateTimeField()
    status = models.CharField(max_length=50, default='Confirmed', choices=choices, null=True)
    
      # Pending, Confirmed, Cancelled

    def __str__(self):
        return f'{self.service}'