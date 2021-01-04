from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("", views.upvote),
    path("check/", views.upvote_status),
    path("delete/", views.delete_upvote),
]