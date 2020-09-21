from django.db import models
from rest_framework_expiring_authtoken.models import ExpiringToken


# Create your models here.
class UserAuth(models.Model):
    expiring_token = models.ForeignKey(ExpiringToken, on_delete=models.CASCADE, blank=False)
    access_token = models.TextField(max_length=50, blank=False)
