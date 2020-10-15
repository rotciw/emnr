from django.test import TestCase
from unittest.mock import patch
import json
from course.models import Course
from course.views import get_single_course_from_db, parse_course_object, get_current_semester
from django.test.client import RequestFactory
from django.test import Client
from .tests import _create_models_without_saving, _get_first_test_course
from .views import retrieve_courses_from_token
from ..auth.models import UserAuth


class MockAPIRequest:
    def __init__(self, contents):
        self.contents = contents

    def json(self):
        return self.contents


def mock_feide_apis(headers):
        if headers["authorization"] == 'Bearer valid_token':
            with open("review/test_data/mock_groups_api_call.json", "r") as f:
                return MockAPIRequest(json.load(f))
        else:
            with open("review/test_data/invalid_groups_api_response.json", "r") as f:
                return MockAPIRequest(json.load(f))



@patch("course.views.requests.get", new=mock_feide_apis)
class GetMyCoursesTest(TestCase):
    def setUp(self) -> None:
        # Crowd database with courses
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()
        courses = _create_models_without_saving()
        for course in courses:
            course.save()
        self.rf = RequestFactory()


    def test_get_current_user_courses_valid_token(self):
        pass




    def test_get_current_user_courses_invalid_token(self):
        pass




    def test_retrieve_courses_from_token_valid_token(self):
        with patch("course.views.Course") as mock_course_db:
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0)]
            number_of_courses = len(retrieve_courses_from_token("valid_token"))
            self.assertEqual(number_of_courses,28)

    def test_retrieve_courses_from_token_invalid_token(self):
        with patch("course.views.Course") as mock_course_db:
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0)]
        with self.assertRaises(ValueError):
            retrieve_courses_from_token("invalid_token")

    def test_parse_course_object_not_course(self):
        test_data = {"id": "fc:adhoc:4613f8e8-fc66-44f0-b7aa-99bd48bcb030", "displayName": "TDT4290 - Emnr", "type": "voot:ad-hoc", "membership": {"basic": "member"}}
        self.assertIsNone(parse_course_object(test_data))

    def test_parse_course_object_get_current_semester(self):
        test_data = {"id": "fc:fs:fs:emne:ntnu.no:TDT4290:1", "type": "fc:fs:emne", "parent": "fc:org:ntnu.no", "membership": {"basic": "member", "fsroles": ["STUDENT"], "active": True, "displayName": "Student"}, "displayName": "Kundestyrt prosjekt"}
        course = Course(course_code = "TDT4290", course_name = "Kundestyrt prosjekt", credit = 15, average_grade = 0)
        course.save()
        course_info = parse_course_object(test_data)
        self.assertEqual(course_info["course_code"],"TDT4290")
        self.assertEqual(course_info["course_name"], "Kundestyrt prosjekt")
        self.assertEqual(course_info["semester"], get_current_semester())


    def test_parse_course_object(self):
        test_data = {"id": "fc:fs:fs:emne:ntnu.no:EXPH0004:1", "type": "fc:fs:emne", "parent": "fc:org:ntnu.no", "membership": {"basic": "member", "fsroles": ["STUDENT"], "active": True, "notAfter": "2017-12-14T23:00:00Z", "subjectRelations": "undervisning", "displayName": "Student"}, "displayName": "Examen philosophicum for naturvitenskap og teknologi"}
        course = Course(course_code = "EXPH0004", course_name = "Examen philosophicum for naturvitenskap og teknologi", credit = 7.5, average_grade = 0)
        course.save()
        course_info = parse_course_object(test_data)
        self.assertEqual(course_info["course_code"], "EXPH0004")
        self.assertEqual(course_info["course_name"], "Examen philosophicum for naturvitenskap og teknologi")
        self.assertEqual(course_info["semester"], "H2017")
