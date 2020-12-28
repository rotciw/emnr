from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("", views.upvote),
    path("check/", views.can_upvote),
    path("remove/", views.remove_upvote),
]