from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("get_login/", views.get_login_url),
    re_path("^verify-token/", views.verify_token),
    re_path('^validate-token/', views.validate_token),
]
