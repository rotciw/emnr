from django.test import TestCase
import json
from unittest.mock import patch
from course.models import Course
from course.views import get_grade_info, get_grade_info_from_grades_api
from django.test.client import RequestFactory
from django.test import Client


def mock_grades_grade_api(url):
    course_code = url.split("/")[-3]
    if course_code == "TMA4100":
        with open("course/test_data/test_getgradeinfo_letter_grades.json", "r") as f:
            return MockAPIRequest(json.load(f))
    elif course_code == "TMA4115":
        with open("course/test_data/test_getgradeinfo_pass_fail.json", "r") as f:
            return MockAPIRequest(json.load(f))
    else:
        with open("course/test_data/test_getgradeinfo_empty_response.json", "r") as f:
            return MockAPIRequest(json.load(f))


class MockAPIRequest:
    def __init__(self, contents):
        self.contents = contents
        self.encoding = None

    def json(self):
        return self.contents


@patch("course.views.requests.get", new=mock_grades_grade_api)
class GradeInfoEndpointTest(TestCase):

    def setUp(self) -> None:
        courses = [
            Course(course_code="TDT4120", course_name="AlgDat", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TMA4100", course_name="Matte 1", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TMA4115", course_name="Matte 3", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="EXPH0004", course_name="Exphil", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TFE4101", course_name="KretsDigtek", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TFY4125", course_name="Fysikk", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TDT4290", course_name="KPro", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TDT4136", course_name="AI Intro", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TULL123", course_name="Ikke egentlig et fag", credit=100, average_grade=5, pass_rate=40)
        ]
        for c in courses: c.save()

    def test_get_grade_info_no_course_code(self):
        c = Client()
        res = c.get("/course/grades/")
        self.assertEqual(res.status_code, 400)
        res = c.get("/course/grades/?test=Test&Test=test")
        self.assertEqual(res.status_code, 400)

    def test_get_grade_info_nonexistent_course(self):
        c = Client()
        res = c.get("/course/grades/?courseCode=TMA4135")
        self.assertEqual(res.status_code, 400)
        res = c.get("/course/grades/?courseCode=skibbidibombom-andabombomoiwonfkjn-9123")
        self.assertEqual(res.status_code, 400)

    def test_get_grade_info_empty_response(self):
        # 400 bad request
        c = Client()
        res = c.get("/course/grades/?courseCode=TULL123")
        self.assertEqual(res.status_code, 400)

    def test_get_grade_info_letter_grades(self):
        c = Client()
        res = c.get("/course/grades/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["godkjent_rate"], -1)
        self.assertEqual(res.data["semester"], "H2019")
        self.assertTrue(res.data["a_rate"] > -1)
        self.assertTrue(res.data["b_rate"] > -1)
        self.assertTrue(res.data["c_rate"] > -1)
        self.assertTrue(res.data["d_rate"] > -1)
        self.assertTrue(res.data["e_rate"] > -1)
        self.assertTrue(res.data["f_rate"] > -1)

    def test_get_grade_info_pass_fail(self):
        c = Client()
        res = c.get("/course/grades/?courseCode=TMA4115")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["godkjent_rate"] > -1)
        self.assertEqual(res.data["semester"], "V2020")
        self.assertEqual(res.data["a_rate"], -1)
        self.assertEqual(res.data["b_rate"], -1)
        self.assertEqual(res.data["c_rate"], -1)
        self.assertEqual(res.data["d_rate"], -1)
        self.assertEqual(res.data["e_rate"], -1)
        self.assertTrue(res.data["f_rate"] > -1)

    def test_get_from_api_empty_response(self):
        # Raises valueerror
        with self.assertRaises(ValueError):
            get_grade_info_from_grades_api("TULL123")

    def test_get_from_api_pass_fail(self):
        # Check that letter grades are -1
        data = get_grade_info_from_grades_api("TMA4115")
        self.assertTrue(data["godkjent_rate"] > -1)
        self.assertEqual(data["semester"], "V2020")
        self.assertEqual(data["a_rate"], -1)
        self.assertEqual(data["b_rate"], -1)
        self.assertEqual(data["c_rate"], -1)
        self.assertEqual(data["d_rate"], -1)
        self.assertEqual(data["e_rate"], -1)
        self.assertTrue(data["f_rate"] > -1)

    def test_get_from_api_letters(self):
        # Check that godkjent_rate is -1
        data = get_grade_info_from_grades_api("TMA4100")
        self.assertEqual(data["godkjent_rate"], -1)
        self.assertEqual(data["semester"], "H2019")
        self.assertTrue(data["a_rate"] > -1)
        self.assertTrue(data["b_rate"] > -1)
        self.assertTrue(data["c_rate"] > -1)
        self.assertTrue(data["d_rate"] > -1)
        self.assertTrue(data["e_rate"] > -1)
        self.assertTrue(data["f_rate"] > -1)
