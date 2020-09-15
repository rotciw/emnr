from django.urls import path
from . import views

urlpatterns = [
    path("get_login/", views.get_login_url),
]
