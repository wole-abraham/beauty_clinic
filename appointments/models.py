from django.db import models
from django.conf import settings


class Service(models.Model):

    name = models.CharField(max_length=50, null=False)
    availablity = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.name
class Appointment(models.Model):
    choices = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),

    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    time = models.DateTimeField()

    status = models.CharField(max_length=50, default='Pending', choices=choices)  # Pending, Confirmed, Cancelled

    def __str__(self):
        return f'{self.user} -> {self.service}'