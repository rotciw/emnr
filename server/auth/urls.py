from django.urls import path
from . import views
from rest_framework_expiring_authtoken import views as expiring_token_view

urlpatterns = [
    path("get_login/", views.get_login_url),
    path("get_token/", views.get_token),
]
