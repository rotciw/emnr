from django.contrib import admin
from .models import AdminUser, BannedUser

# Register your models here.
admin.site.register(AdminUser)
admin.site.register(BannedUser)
