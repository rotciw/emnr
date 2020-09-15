from django.urls import path
from . import views
from django.urls import include, re_path

urlpatterns = [
    re_path("^get_login/", views.get_login_url),
]
