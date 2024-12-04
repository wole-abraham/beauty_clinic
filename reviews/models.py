from django.db import models
from django.conf import settings
from django.utils.timezone import now
# Create your models here.


class Review(models.Model):
    """
        Review model:
            user - comments
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.CharField(max_length=20, null=True)
    date = models.DateTimeField(default=now)

    def __str__(self):
        return f"Review by {self.user} on {self.date.strftime('%Y-%m-%d')}"
