from django.test import TestCase
import json
from course.models import Course
from course.views import get_single_course_from_db, parse_course_object, get_current_semester
from django.test.client import RequestFactory
from django.test import Client
from .tests import _create_models_without_saving, _get_first_test_course
from



class GetMyCoursesTest(TestCase):
    def setUp(self) -> None:
        # Crowd database with courses
        courses = _create_models_without_saving()
        for course in courses:
            course.save()
        self.rf = RequestFactory()


    def test_get_current_user_courses_valid_token(self):

    def test_get_current_user_courses_invalid_token(self):


    def test_parse_course_object_not_course(self):
        test_data = {"id": "fc:adhoc:4613f8e8-fc66-44f0-b7aa-99bd48bcb030", "displayName": "TDT4290 - Emnr", "type": "voot:ad-hoc", "membership": {"basic": "member"}}
        self.assertIsNone(parse_course_object(test_data))

    def test_parse_course_object_get_current_semester(self):
        test_data = {"id": "fc:fs:fs:emne:ntnu.no:TDT4290:1", "type": "fc:fs:emne", "parent": "fc:org:ntnu.no", "membership": {"basic": "member", "fsroles": ["STUDENT"], "active": True, "displayName": "Student"}, "displayName": "Kundestyrt prosjekt"}
        course = Course(course_code="TDT4290", course_name="Kundestyrt prosjekt", credit=15, average_grade=0)
        course.save()
        course_info = parse_course_object(test_data)
        self.assertEqual(course_info["course_code"],"TDT4290")
        self.assertEqual(course_info["course_name"], "Kundestyrt prosjekt")
        self.assertEqual(course_info["semester"], get_current_semester())

