from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("", views.post_review),
    path("get/", views.get_reviews),
    path("check/", views.can_review),
    path("delete/", views.delete_review)
]