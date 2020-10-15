from django.test import TestCase
import json
from course.models import Course
from course.views import get_single_course_from_db
from django.test.client import RequestFactory
from django.test import Client
from .tests import _create_models_without_saving, _get_first_test_course


class GetSingleCourseTest(TestCase):
    def setUp(self) -> None:
        # Crowd database with courses
        courses = _create_models_without_saving()
        for course in courses:
            course.save()
        self.rf = RequestFactory()

    def test_get_course_from_db_existing_code(self):
        mock_request = self.rf.get("/course/?code=MFEL1010")
        data = get_single_course_from_db(mock_request)
        self.assertEqual(data["course_code"], "MFEL1010")

    def test_get_course_from_db_nonexisting_code(self):
        with self.assertRaises(ValueError):
            get_single_course_from_db(self.rf.get("/courses/all/?code=fdsfds"))

    def test_get_course_from_db_no_code(self):
        mock_request = self.rf.get("/course/")
        with self.assertRaises(ValueError):
            get_single_course_from_db(mock_request)
        mock_request = self.rf.get("/course/?p=12341asbs")
        with self.assertRaises(ValueError):
            get_single_course_from_db(mock_request)

    def test_get_course_existing_code(self):
        c = Client()
        course_code = "MFEL1010"
        response = c.get("/course/?code={}".format(course_code))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["course_code"], course_code)

    def test_get_course_nonexisting_code(self):
        c = Client()
        test_code = "TEST101"
        response = c.get("/course/?code={}".format(test_code))
        self.assertEqual(response.status_code, 400)

    def test_get_course_no_code(self):
        c = Client()
        res = c.get("/course/")
        self.assertEqual(res.status_code, 400)
