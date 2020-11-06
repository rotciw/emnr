from django.db import models


# Create your models here.
class AdminUser(models.Model):
    user_email = models.EmailField(max_length=254, blank=False)


class BannedUser(models.Model):
    user_email = models.EmailField(max_length=254, blank=False)