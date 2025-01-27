from django import forms
from .models import Clients
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = Clients
        fields = '__all__'