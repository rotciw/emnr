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
                                     average_grade=course_dict["average_grade"]))
    return courses


def _get_first_test_course():
    with open("course/test_data/test_courses.json", "r") as f:
        data = json.load(f)
    return data[0]


class GetAllCoursesTest(TestCase):
    def setUp(self) -> None:
        # Crowd database with courses
        courses = _create_models_without_saving()
        for course in courses:
            course.save()
        self.rf = RequestFactory()

    def test_get_courses_from_db_no_parameters(self):
        mock_request = self.rf.get("/course/all/")
        data = get_courses_from_db(mock_request)
        source_data = _create_models_without_saving()
        self.assertEqual(data["count"], len(source_data))
        data = data["data"]
        self.assertEqual(len(data), len(source_data))
        for i in range(len(data)):
            self.assertEqual(data[i]["course_code"], source_data[i].course_code)

    def test_get_courses_from_db_normal_parameters(self):
        n = 25
        offset = 0
        source_data = _create_models_without_saving()

        def get_courses_with_parameters(n, offset):
            mock_request = self.rf.get("/courses/all/?n={}&offset={}".format(n, offset))
            data = get_courses_from_db(mock_request)
            self.assertEqual(data["count"], len(source_data))
            return data["data"]

        def assert_equal_content(data):
            for i in range(n):
                self.assertEqual(data[i]["course_code"], source_data[offset + i].course_code)

        # Tests for equal data in database and text file, with use of increasing offset
        for i in range(len(source_data) // n):
            assert_equal_content(get_courses_with_parameters(n, offset))
            offset += 1

    def test_get_courses_from_db_invalid_parameters(self):
        source_data = _create_models_without_saving()
        n_list = [len(source_data) + 1, 'Character test', -1]
        offset_list = [len(source_data) + 1, 'Character test', -1]

        # Tests different invalid parameters for 'n'
        for number in n_list:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?n={}".format(number)))
        # Tests different invalid parameters for 'offset'
        for offset in offset_list:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?offset={}".format(offset)))

    def test_get_all_courses_no_parameters(self):
        c = Client()
        response = c.get("/course/all/")
        self.assertEqual(response.status_code, 200)
        source_data = _create_models_without_saving()
        self.assertEqual(response.data["count"], len(source_data))
        self.assertEqual(len(response.data["data"]), len(source_data))
        for i in range(len(response.data["data"])):
            self.assertEqual(response.data["data"][i]["course_code"], source_data[i].course_code)

    def test_get_all_courses_normal_parameters(self):
        c = Client()
        source_data = _create_models_without_saving()

        # Tests that two 'safe' parameters work
        res = c.get("/course/all/?n={}&offset={}".format(10, 0))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["data"][0]["course_code"], source_data[0].course_code)

        # Tests that length of get-request and source_data are the same, and status OK
        res = c.get("/course/all/?n={}&offset={}".format(1, len(source_data)))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["data"], [])

        # Test that last last element of get-request and last element of source_data are the same
        res = c.get("/course/all/?n={}&offset={}".format(1, len(source_data) - 1))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["data"][0]["course_code"], source_data[-1].course_code)

    def test_get_all_courses_invalid_parameters(self):
        c = Client()
        ns = ["test", "-12", "{}".format(len(_create_models_without_saving()) + 10), "10", "10", "10", "abc"]
        offsets = ["0", "12", "1", "abcd", "-1253", "{}".format(len(_create_models_without_saving()) + 10), "-1452"]

        # Test all the pairwise combinations of invalid parameters:
        for i in range(len(ns)):
            res = c.get("/course/all/?n={}&offset={}".format(ns[i], offsets[i]))
            self.assertEqual(res.status_code, 400)

    # * "count" er likt som antall treff
    # * Man får minst ett treff og status kode 200 når man søker på noe som kommer fra et av fagene.
    # * Man får ingen treff om man søker på noe fullstendig bullshit.
    # * Ingen parametere burde fungere helt fint
    def test_get_courses_from_db_search_good_parameter(self):
        first_test_course = _get_first_test_course()
        search_value = first_test_course.get("course_code")[1:4]
        mock_request = self.rf.get("course/all/?search={}".format(search_value))
        source_data = _create_models_without_saving()
        data = get_courses_from_db(mock_request)

        # Tests that the search has filtered out some courses.
        self.assertNotEqual(data["count"], len(source_data))

        # Tests that all hit courses do in fact meet the search parameter
        for i in range(len(data["data"])):
            self.assertTrue(search_value in data["data"][i]["course_code"]
                            or search_value in data["data"][i]["course_code"])

    def test_get_courses_from_db_search_bullshit_parameter(self):
        pass

    def test_get_all_courses_search_good_parameter(self):
        pass

    def test_get_all_courses_search_bullshit_parameter(self):
        pass


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
