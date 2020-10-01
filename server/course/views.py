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
	:return: List of JSON objects, each containing course information.
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
