from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from course.models import Course
from auth.views import get_token
import requests
import json
import time


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
	:param request: GET request containing optional parameters n (number of courses to fetch), offset (index to
					start the fetching at) and search (filters courses on whether code or name contains the search
					input).
	:raises: ValueError if n or offset is invalid.
	:return: JSON containing total number of courses in database (count), and list of JSON objects (data),
			 each containing course information.
	"""
	# Get search parameter and combines the fields "course_code" and "course_name" into an OR field,
	# by making a Q object.
	search = request.GET.get("search", "")
	combined_search_filter = Q(course_code__contains=search) | Q(course_name__contains=search)

	# Get and validate n parameter
	number_of_courses = Course.objects.filter(combined_search_filter).count()
	n = request.GET.get("n", number_of_courses)
	if isinstance(n, str) and not n.isdigit():
		raise ValueError("Invalid value for n: {}".format(n))
	n = int(n)

	# Get and validate offset parameter
	offset = request.GET.get("offset", 0)
	if isinstance(offset, str) and not offset.isdigit():
		raise ValueError("Invalid value for offset: {}".format(offset))
	offset = int(offset)
	if offset > number_of_courses:
		raise ValueError("offset is too large")

	# Get and validate order_by and ascending parameters
	order_by = request.GET.get("order_by", "course_name")
	valid_order_parameters = ["course_code", "course_name", "credit", "average_grade"]
	if order_by not in valid_order_parameters:
		raise ValueError("Invalid value for order_by: {}. Valid  values: {}".format(order_by, valid_order_parameters))
	ascending = request.GET.get("ascending", "1")
	if ascending not in ["0", "1"]:
		raise ValueError("Invalid value for ascending: {}".format(ascending))
	if ascending == "0":
		order_by = "-" + order_by

	# Fetch data from database
	data = Course.objects.filter(combined_search_filter).order_by(order_by)[offset:offset + n]
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


@api_view(["GET"])
def get_current_user_courses(request):
    course_info = retrieve_courses_from_token(request.META['HTTP_AUTHORIZATION'])
    return HttpResponse(json.dumps(course_info))


def retrieve_courses_from_token(token):
    """
    Helper method for getting the list of courses that the current user has taken (based on the frontend token).
    """
    json_object = perform_feide_api_call(token, 'https://groups-api.dataporten.no/groups/me/groups')
    course_info = []
    for obj in json_object:
        parsed_obj = parse_course_object(obj)
        if parsed_obj is not None:
            course_info.append(parsed_obj)
    return course_info


def parse_course_object(obj):
    """
    Helper method for parsing a JSON containing course information from the Feide Groups API
    into a dictionary containing course code and semester.
    """
    if 'emne' not in obj['type'].split(':'):
        return None

    # Get course code
    course_code = obj["id"].split(":")[-2]

    # Get semester
    if 'notAfter' in obj['membership']:
        # Course has already been taken
        semester = ""
        notAfter_split = (obj['membership']['notAfter']).split('-')
        if notAfter_split[1] == "08":
            semester += "V"
        elif notAfter_split[1] == "12":
            semester += "H"
        else:
            raise ValueError("Unknown semester end month: {}".format(notAfter_split[1]))
        semester += notAfter_split[0]
    else:
        semester = get_current_semester()

    # Get course name from Course table
    course_name = Course.objects.filter(course_code=course_code)[0].course_name

    return {"course_code": course_code, "course_name": course_name, "semester": semester}


def perform_feide_api_call(expiring_token, api_url):
    """
    Performs a get request to a given API that requires the current user's Feide Access token
    (like the Groups API or the UserInfo API).
    Returns a dictionary representation of the JSON data returned from the API call.
    """
    access_token = get_token(expiring_token)
    session = requests.Session()
    session.headers.update({'authorization': 'bearer {}'.format(access_token)})

    api_request = requests.get(
        api_url, headers={
            'content-type': 'application/json; charset=utf-8',
            'authorization': 'Bearer {}'.format(access_token),
        }
    )
    return api_request.json()


def get_current_semester():
    """
    Helper method for creating a string representing the current semester.

    E.g. if we are in september 2018, it will return H2018 (H for Høst/Autumn).
    """
    semester = ""
    if int(time.strftime("%m")) < 8:
        semester += "V"
    else:
        semester += "H"
    semester += time.strftime("%Y")
    return semester
