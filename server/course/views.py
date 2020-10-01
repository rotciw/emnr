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
    return Response(get_courses_from_db(request))

def get_courses_from_db(request):
    number_of_courses = int(request.GET.get("n", Course.objects.all().count()))
    offset = int(request.GET.get("offset", 0))
    data = Course.objects.all()[offset:offset+number_of_courses]
    return list(data.values())
