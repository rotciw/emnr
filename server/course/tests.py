from django.test import TestCase
import json
from course.models import Course
from course.views import get_all_courses, get_courses_from_db
from django.test.client import RequestFactory
from django.test import Client


# Create your tests here.
class GetAllCoursesTest(TestCase):
	def setUp(self) -> None:
		# Crowd database with courses
		courses = self._create_models_without_saving()
		for course in courses:
			course.save()
		self.rf = RequestFactory()

	def _create_models_without_saving(self):
		"""
		Returns a list containing all 59 Course objects from the test data json file.
		"""
		with open("course/test_data/test_courses.json", "r") as f:
			data = json.load(f)
		courses = []
		for course_dict in data:
			courses.append(Course.create(code=course_dict["course_code"], name=course_dict["course_name"],
										 credit=course_dict["credit"],
										 average_grade=course_dict["average_grade"]))
		return courses

	def test_get_courses_from_db_no_parameters(self):
		mock_request = self.rf.get("/course/all/")
		data = get_courses_from_db(mock_request)
		source_data = self._create_models_without_saving()
		self.assertEqual(len(data), len(source_data))
		for i in range(len(data)):
			self.assertEqual(data[i]["course_code"], source_data[i].course_code)

	def test_get_courses_from_db_normal_parameters(self):
		pass

	def test_get_courses_from_db_invalid_parameters(self):
		pass

	def test_get_all_courses_no_parameters(self):
		c = Client()
		response = c.get("/course/all/")
		source_data = self._create_models_without_saving()
		self.assertEqual(len(response.data), len(source_data))
		for i in range(len(response.data)):
			self.assertEqual(response.data[i]["course_code"], source_data[i].course_code)


	def test_get_all_courses_normal_parameters(self):
		pass

	def test_get_all_courses_invalid_parameters(self):
		pass
