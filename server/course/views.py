from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from course.models import Course

# Create your views here.
def health(request):
    return HttpResponse("OK")

@api_view(['GET'])
def get_all_courses(request):
    return Response(get_courses_from_db())

def get_courses_from_db():
    data = Course.objects.all()
    return list(data.values())