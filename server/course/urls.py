from django.urls import path
from django.urls import re_path
from . import views


urlpatterns = [
    path("health/", views.health),
    path("all/", views.get_all_courses),
    path("", views.get_course),
    path("me/", views.get_current_user_courses),
    path("grades/", views.get_grade_info)
]