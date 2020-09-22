from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("health/", views.health),
]