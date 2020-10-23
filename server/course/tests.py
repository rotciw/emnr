from django.test import TestCase
import json
from course.models import Course
from course.views import get_courses_from_db, get_single_course_from_db
from django.test.client import RequestFactory
from django.test import Client


def _create_models_without_saving():
	"""
	Returns a list containing all 59 Course objects from the test data json file.
	"""
	with open("course/test_data/test_courses.json", "r") as f:
		data = json.load(f)
	courses = []
	for course_dict in data:
		courses.append(Course.create(code=course_dict["course_code"],
									 name=course_dict["course_name"],
									 credit=course_dict["credit"],
									 average_grade=course_dict["average_grade"],
									 pass_rate=course_dict["pass_rate"]))
	return courses


def _get_first_test_course():
	"""
	Returns the first json-object among the courses in the test data json file.
	"""
	with open("course/test_data/test_courses.json", "r") as f:
		data = json.load(f)
	return data[0]
