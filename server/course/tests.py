from django.test import TestCase
import json
from course.models import Course

# Create your tests here.
class GetAllCoursesTest(TestCase):
	def setUp(self) -> None:
		# Crowd database with courses
		with open("course/test_data/test_courses.json", "r") as f:
			data = json.load(f)
		for course_dict in data:
			Course.create(code=course_dict["course_code"], name=course_dict["course_name"], credit=course_dict["credit"],
						  average_grade=course_dict["average_grade"]).save()
		print(Course.objects.all().count())

	def test_get_courses_from_db_no_parameters(self):
		pass
	
	def test_get_courses_from_db_normal_parameters(self):
		pass

	def test_get_courses_from_db_invalid_parameters(self):
		pass

	def test_get_all_courses_no_parameters(self):
		pass

	def test_get_all_courses_normal_parameters(self):
		pass

	def test_get_all_courses_invalid_parameters(self):
		pass