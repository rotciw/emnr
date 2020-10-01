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
    return json.dumps(list(data.values()))

@api_view(['GET'])
def get_course(request):
    try:
        data = get_single_course_from_db(request)
    except ValueError as e:
        return Response(str(e), status=400)
    return Response(data)

def get_single_course_from_db(request):
    """
    Helper method for fetching a single course from the database.
    :param request: GET request containing mandatory parameter code (course code)
    :raises: ValueError if code is None, or not corresponding to a course in the database
    :return: A single JSON object, containing the course data.
    """
    code = request.GET.get("code", None)
    if code is None:
        raise ValueError("No code provided")
    if not Course.objects.filter(course_code=code).exists():
        raise ValueError("Course does not exist in database")
    return Course.objects.filter(course_code=code).values()[0]
