from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailOrUsernameBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Try to find the user using email if 'username' is an email address
            user = get_user_model().objects.get(email=username) if '@' in username else get_user_model().objects.get(username=username)
            if user.check_password(password):
                return user
        except get_user_model().DoesNotExist:
            return None