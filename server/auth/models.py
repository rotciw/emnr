from django.db import models


# Create your models here.
class UserAuth(models.Model):
    expiring_token = models.TextField(max_length=50, blank=False)
    access_token = models.TextField(max_length=50, blank=False)
    user_email = models.TextField(max_length=200, blank=False, null=True)
