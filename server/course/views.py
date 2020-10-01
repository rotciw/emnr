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
	try:
		data = get_courses_from_db(request)
	except ValueError as e:
		return Response(str(e), status=400)
	return Response(data)


def get_courses_from_db(request):
	"""
	Helper method for fetching an arbitrary sequence of courses from the database.
	:param request: GET request containing optional parameters n (number of courses to fetch) and offset (index to
					start the fetching at).
	:raises: ValueError if n or offset is invalid.
	:return: JSON containing total number of courses in database (count), and list of JSON objects (data),
			 each containing course information.
	"""
	# Get and validate n parameter
	number_of_courses = Course.objects.all().count()
	n = request.GET.get("n", number_of_courses)
	if isinstance(n, str) and not n.isdigit():
		raise ValueError("Invalid value for n: {}".format(n))
	n = int(n)
	if n > number_of_courses:
		raise ValueError("n is too large")

	# Get and validate offset parameter
	offset = request.GET.get("offset", 0)
	if isinstance(offset, str) and not offset.isdigit():
		raise ValueError("Invalid value for offset: {}".format(offset))
	offset = int(offset)
	if offset > number_of_courses:
		raise ValueError("offset is too large")

	# Fetch data from database
	data = Course.objects.all()[offset:offset + n]
	return {"count": number_of_courses, "data": list(data.values())}


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
from auth.views import get_token
import requests
import json

# Create your views here.
def health(request):
    return HttpResponse("OK")



def get_current_user_courses(request):
    access_token = get_token(request.META['HTTP_AUTHORIZATION'])
    session = requests.Session()
    session.headers.update({'authorization': 'bearer {}'.format(access_token)})

    api_request = requests.get(
        'https://groups-api.dataporten.no/groups/me/groups', headers={
            'content-type': 'application/json; charset=utf-8',
            'authorization': 'Bearer {}'.format(access_token),
        }
    )
    api_request.encoding = "utf-8"

    json_object = api_request.json()
    print(json_object[0])

    for subj in json_object:
        print(subj["displayName"].encode("latin-1"))

    
    return HttpResponse(api_request)
