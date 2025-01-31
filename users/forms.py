from django import forms
from .models import Clients
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = Clients
        fields = '__all__'

User = get_user_model()  # Get the custom user model

class CustomUserCreationForms(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label="Password")
    confirm_password = forms.CharField(widget=forms.PasswordInput, label="Confirm Password")
    birth_date = forms.DateField(
    widget=forms.DateInput(
        attrs={
            'class': 'flatpickr form-control',  # Add class for flatpickr styling
            'placeholder': 'Select your birth date',  # Optional: Add placeholder text
            'type': 'date'  # Ensure it's treated as a text input for Flatpickr
        }
    ),
    label="Birth Date"
)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'birth_date', 'gender', 'country', 'state', 'phone_number']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs['class'] = 'form-control'

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password and confirm_password and password != confirm_password:
            self.add_error("confirm_password", "Passwords do not match.")

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])  # Hash the password
        if commit:
            user.save()
        return user