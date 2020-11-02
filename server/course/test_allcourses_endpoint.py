from django.test import TestCase
import json
from course.models import Course
from review.models import Review
from course.views import get_courses_from_db
from django.test.client import RequestFactory
from django.test import Client
from .tests import _create_models_without_saving, _get_first_test_course


def _get_source_data_codes():
    source_data = _create_models_without_saving()
    source_data_codes = []
    for course in source_data:
        source_data_codes.append(course.course_code)
    return source_data_codes


class GetAllCoursesTest(TestCase):
    def setUp(self) -> None:
        # Crowd database with courses
        courses = _create_models_without_saving()
        for course in courses:
            course.save()
        self.rf = RequestFactory()

    def test_get_courses_from_db_no_parameters(self):
        mock_request = self.rf.get("/course/all/")
        mock_response = get_courses_from_db(mock_request)
        source_data = _create_models_without_saving()
        self.assertEqual(mock_response["count"], len(source_data))
        data = mock_response["data"]
        self.assertEqual(len(data), len(source_data))
        source_data_codes = _get_source_data_codes()
        for i in range(len(data) - 1):
            # Tests that the result is sorted by the default sorting parameter
            self.assertTrue(data[i]["course_name"] <= data[i + 1]["course_name"])
        for i in range(len(data)):
            # Tests that the result courses are in the test data set
            self.assertTrue(data[i]["course_code"] in source_data_codes)

    def test_get_all_courses_no_parameters(self):
        c = Client()
        response = c.get("/course/all/")
        self.assertEqual(response.status_code, 200)
        source_data = _create_models_without_saving()
        self.assertEqual(response.data["count"], len(source_data))
        self.assertEqual(len(response.data["data"]), len(source_data))
        source_data_codes = _get_source_data_codes()
        for i in range(len(response.data["data"]) - 1):
            # Tests that the result is sorted by the default sorting parameter
            self.assertTrue(response.data["data"][i]["course_name"] <= response.data["data"][i + 1]["course_name"])
            # Tests that the result courses are in the test data set
            self.assertTrue(response.data["data"][i]["course_code"] in source_data_codes)

    def test_get_courses_from_db_valid_n_offset(self):
        n = 25
        offset = 0
        source_data = _create_models_without_saving()

        def get_courses_with_parameters(n, offset):
            mock_request = self.rf.get("/courses/all/?n={}&offset={}".format(n, offset))
            mock_response = get_courses_from_db(mock_request)
            self.assertEqual(mock_response["count"], len(source_data))
            data = mock_response["data"]
            return data

        # Tests for expected data length with increasing offset
        for i in range(len(source_data) // n + 1):
            data = get_courses_with_parameters(n, offset)
            self.assertTrue(len(data) == n or len(data) == len(source_data) % n)
            offset += n

    def test_get_all_courses_valid_n_offset(self):
        c = Client()
        source_data = _create_models_without_saving()

        # Tests that two 'safe' parameters work
        res = c.get("/course/all/?n={}&offset={}".format(10, 0))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["count"], 59)
        source_data_codes = _get_source_data_codes()
        self.assertTrue(res.data["data"][0]["course_code"] in source_data_codes)

        # Tests that length of get-request and source_data are the same, and status OK
        res = c.get("/course/all/?n={}&offset={}".format(1, len(source_data)))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["data"], [])

    def test_get_courses_from_db_invalid_n_offset(self):
        source_data = _create_models_without_saving()
        n_list = ['Character test', -1]
        offset_list = [len(source_data) + 1, 'Character test', -1]

        # Tests different invalid parameters for 'n'
        for number in n_list:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?n={}".format(number)))
        # Tests different invalid parameters for 'offset'
        for offset in offset_list:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?offset={}".format(offset)))

    def test_get_all_courses_invalid_n_offset(self):
        c = Client()
        ns = ["test", "-12", "10", "10", "10", "abc"]
        offsets = ["0", "12", "abcd", "-1253", "{}".format(len(_create_models_without_saving()) + 10), "-1452"]

        # Test all the pairwise combinations of invalid parameters:
        for i in range(len(ns)):
            res = c.get("/course/all/?n={}&offset={}".format(ns[i], offsets[i]))
            self.assertEqual(res.status_code, 400)

    def test_get_courses_from_db_valid_search(self):
        first_test_course = _get_first_test_course()
        search_value = first_test_course.get("course_code")[1:4]
        mock_request = self.rf.get("course/all/?search={}".format(search_value))
        source_data = _create_models_without_saving()
        data = get_courses_from_db(mock_request)

        # Tests that the search has filtered out some courses.
        self.assertNotEqual(data["count"], len(source_data))

        # Tests that the data set meets the search parameter
        for i in range(len(data["data"])):
            self.assertTrue(search_value in data["data"][i]["course_code"]
                            or search_value in data["data"][i]["course_name"])

    def test_get_all_courses_valid_search(self):
        c = Client()
        first_test_course = _get_first_test_course()
        search_value = first_test_course.get("course_code")[1:4]
        res = c.get("/course/all/?search={}".format(search_value))

        # Tests status code and that the data set meets the search parameter
        self.assertEqual(res.status_code, 200)
        for course in res.data["data"]:
            self.assertTrue(search_value in course["course_code"] or search_value in course["course_name"])

    def test_get_courses_from_db_invalid_search(self):
        search_value = "fdhsuifndsuo"
        mock_request = self.rf.get("course/all/?search={}".format(search_value))
        data = get_courses_from_db(mock_request)

        # Tests that the count is 0, and that the data array is empty.
        self.assertEqual(data["count"], 0)
        self.assertTrue(data["data"] == [])

    def test_get_all_courses_invalid_search(self):
        c = Client()
        search_value = "fdhsuifndsuo"
        res = c.get("/course/all/?search={}".format(search_value))

        # Tests status_code: OK, count: 0 and data: []
        # The 'invalid search value' is only invalid in that it has no hits, which results in the status being OK
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["count"], 0)
        self.assertEqual(res.data["data"], [])

    def test_get_courses_from_db_valid_order_by(self):
        order_by_values = ["course_code", "course_name", "credit", "average_grade", "pass_rate"]

        def get_data(order_by, ascending):
            if ascending is None:
                mock_request = self.rf.get("/course/all/?order_by={}".format(sort_value))
            else:
                mock_request = self.rf.get("/course/all/?order_by={}&ascending={}".format(sort_value, ascending))
            mock_response = get_courses_from_db(mock_request)
            data = mock_response["data"]
            return data

        # Tests sorting on all legal order_by values, on different ascending values
        for sort_value in order_by_values:
            # Tests default ascending
            data = get_data(sort_value, None)
            for i in range(len(data) - 1):
                self.assertTrue(data[i][sort_value] <= data[i + 1][sort_value])
            # Tests ascending sorting
            data = get_data(sort_value, "1")
            for i in range(len(data) - 1):
                self.assertTrue(data[i][sort_value] <= data[i + 1][sort_value])
            # Tests descending sorting
            data = get_data(sort_value, "0")
            for i in range(len(data) - 1):
                self.assertTrue(data[i][sort_value] >= data[i + 1][sort_value])

    def test_get_all_courses_valid_order_by(self):
        c = Client()
        order_by = "course_code"
        ascending = "0"  # "0" translates to false, meaning descending
        # Tests ascending(default) sorting ordering by course_code
        res = c.get("/course/all/?order_by={}".format(order_by))
        self.assertEqual(res.status_code, 200)
        for i in range(len(res.data["data"]) - 1):
            self.assertTrue(res.data["data"][i][order_by] <= res.data["data"][i + 1][order_by])
        # Tests descending sorting ordering by course_name(default)
        res = c.get("/course/all/?ascending={}".format(ascending))
        self.assertEqual(res.status_code, 200)
        for i in range(len(res.data["data"]) - 1):
            self.assertTrue(res.data["data"][i]["course_name"] >= res.data["data"][i + 1]["course_name"])
        # Tests descending sorting ordering by course_code
        res = c.get("/course/all/?order_by={}&ascending={}".format(order_by, ascending))
        self.assertEqual(res.status_code, 200)
        for i in range(len(res.data["data"]) - 1):
            self.assertTrue(res.data["data"][i][order_by] >= res.data["data"][i + 1][order_by])

    def test_get_courses_from_db_invalid_order_by(self):
        invalid_ascending_values = ["-1", "False", "True", "2"]
        invalid_order_by_values = ["", "height"]
        for asc_value in invalid_ascending_values:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?ascending={}".format(asc_value)))
        for order_value in invalid_order_by_values:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/courses/all/?order_by={}".format(order_value)))

    def test_get_all_courses_invalid_order_by(self):
        c = Client()
        invalid_ascending_values = ["-1", "False", "True", "2"]
        invalid_order_by_values = ["", "height"]
        # Tests status code for invalid ascending values
        for asc_value in invalid_ascending_values:
            res = c.get("/course/all/?ascending={}".format(asc_value))
            self.assertEqual(res.status_code, 400)
        # Tests status code for invalid order_by values
        for order_value in invalid_order_by_values:
            res = c.get("/course/all/?order_by={}".format(order_value))
            self.assertEqual(res.status_code, 400)

    def test_get_courses_from_db_valid_advanced_sorting(self):
        valid_advanced_sortings = ["true", "false"]
        valid_highs = ["true", "false"]
        valid_weights = ["0", "1", "2", "3", "4", "5"]
        params = ["score", "difficulty", "workload", "pass_rate", "grade"]
        # Shouldn't raise ValueErrors:
        for value in valid_advanced_sortings:
            mock_request = get_courses_from_db(self.rf.get("/courses/all/?advanced_sorting={}".format(value)))
        for param in params:
            for value in valid_highs:
                mock_request = get_courses_from_db(self.rf.get(
                        "/courses/all/?advanced_sorting=true&{}_high={}".format(param, value)))
            for value in valid_weights:
                mock_request = get_courses_from_db(self.rf.get(
                    "/courses/all/?advanced_sorting=true&{}_weight={}".format(param, value)))

        # Query number: [query, first hit course_code, sorting_score]
        base_query = "/course/all/?advanced_sorting=true"
        single_param_queries = {
            "q0": [base_query+"&score_high=true&score_weight=5", "TN202406", 80.0],
            "q1": [base_query+"&score_high=false&score_weight=5", "TMR4555", 80.0],
            "q2": [base_query+"&difficulty_high=true&difficulty_weight=5", "TPG4190", 87.5],
            "q3": [base_query+"&difficulty_high=false&difficulty_weight=5", "TMR4555", 100.0],
            "q4": [base_query+"&workload_high=true&workload_weight=5", "TMR4555", 100.0],
            "q5": [base_query+"&workload_high=false&workload_weight=5", "TN202406", 85.0],
            "q6": [base_query+"&pass_rate_high=true&pass_rate_weight=5", "TMR4300", 100.0],
            "q7": [base_query+"&pass_rate_high=false&pass_rate_weight=5", "AFR1003", 100.0],
            "q8": [base_query+"&grade_high=true&grade_weight=5", "MFEL4852", 87.6630434782608],
            "q9": [base_query+"&grade_high=false&grade_weight=5", "MFEL1010", 93.17441158720581],
        }
        for query in single_param_queries.values():
            mock_request = self.rf.get(query[0])
            mock_response = get_courses_from_db(mock_request)
            self.assertEqual(mock_response["data"][0]["course_code"], query[1])
            self.assertEqual(mock_response["data"][0]["advanced_sorting_score"], query[2])
        # Query number: [query, first hit course_code, sorting_score]
        multiple_param_queries = {
            # Looking for subjects with good score, low difficulty and sort of low workload
            "q0": [base_query + "&score_high=true&score_weight=4"
                                "&difficulty_high=false&difficulty_weight=5"
                                "&workload_high=false&workload_weight=3", "TN202406", 72.91666666666666],
            # Looking for subjects with good score and low difficulty and workload
            "q1": [base_query + "&score_high=true&score_weight=5"
                                "&difficulty_high=false&difficulty_weight=3"
                                "&workload_high=false&workload_weight=3", "TN202406", 75.9090909090909],
            # Looking for subjects with high difficulty and workload, and low score. Subjects to stay away from
            "q2": [base_query + "&score_high=false&score_weight=3"
                                "&difficulty_high=true&difficulty_weight=5"
                                "&workload_high=true&workload_weight=4", "TPG4190", 64.79166666666667],
            # Looking with subjects with low difficulty and workload, score is not that important
            "q3": [base_query + "&score_high=true&score_weight=1"
                                "&difficulty_high=false&difficulty_weight=5"
                                "&workload_high=false&workload_weight=3", "TN202406", 70.55555555555554],
            "q4": [base_query + "&score_high=true&score_weight=5"
                                "&difficulty_high=false&difficulty_weight=0"
                                "&workload_high=true&workload_weight=3", "TPG4190", 67.1875],
            "q5": [base_query + "&score_high=false&score_weight=0"
                                "&difficulty_high=true&difficulty_weight=5"
                                "&workload_high=false&workload_weight=5", "TN202406", 62.5],
            "q6": [base_query + "&score_high=true&score_weight=2"
                                "&difficulty_high=false&difficulty_weight=4"
                                "&workload_high=false&workload_weight=0", "TMR4555", 73.33333333333334],
        }
        for query in multiple_param_queries.values():
            mock_request = self.rf.get(query[0])
            mock_response = get_courses_from_db(mock_request)
            self.assertEqual(mock_response["data"][0]["course_code"], query[1])
            self.assertEqual(mock_response["data"][0]["advanced_sorting_score"], query[2])

    def test_get_courses_from_db_invalid_advanced_sorting(self):
        invalid_advanced_sortings = [1, "1", "TRUE", "FALSE", "@#!%&"]
        invalid_highs =  [1, "1", "TRUE", "FALSE", "@#!%&"]
        invalid_weights = ["-1", "6", "2.5"]
        params = ["score", "difficulty", "workload", "pass_rate", "grade"]
        for bad_adv_sort in invalid_advanced_sortings:
            with self.assertRaises(ValueError):
                get_courses_from_db(self.rf.get("/course/all/?advanced_sorting={}".format(bad_adv_sort)))
        for param in params:
            for bad_high in invalid_highs:
                with self.assertRaises(ValueError):
                    get_courses_from_db(self.rf.get(
                        "/course/all/?advanced_sorting=true&{}_high={}".format(param, bad_high)))
            for bad_weight in invalid_weights:
                with self.assertRaises(ValueError):
                    get_courses_from_db(self.rf.get(
                        "/course/all/?advanced_sorting=true&{}_weight={}".format(param, bad_weight)))

    def test_get_all_courses_valid_advanced_sorting(self):
        c = Client()
        valid_advanced_sortings = ["true", "false"]
        valid_highs = ["true", "false"]
        valid_weights = ["0", "1", "2", "3", "4", "5"]
        params = ["score", "difficulty", "workload", "pass_rate", "grade"]
        # Shouldn't raise ValueErrors:
        for value in valid_advanced_sortings:
            res = c.get("/course/all/?advanced_sorting={}".format(value))
            self.assertEqual(res.status_code, 200)
        for param in params:
            for value in valid_highs:
                res = c.get("/course/all/?advanced_sorting=true&{}_high={}".format(param, value))
                self.assertEqual(res.status_code, 200)
            for value in valid_weights:
                res = c.get("/course/all/?advanced_sorting=true&{}_weight={}".format(param, value))
                self.assertEqual(res.status_code, 200)
        base_query = "/course/all/?advanced_sorting=true"
        multiple_param_queries = {
            # Looking for subjects with good score, low difficulty and sort of low workload
            "q0": [base_query + "&score_high=true&score_weight=4"
                                "&difficulty_high=false&difficulty_weight=5"
                                "&workload_high=false&workload_weight=3", "TN202406", 8.600000000000001],
            # Looking for subjects with good score and low difficulty and workload
            "q1": [base_query + "&score_high=true&score_weight=5"
                                "&difficulty_high=false&difficulty_weight=3"
                                "&workload_high=false&workload_weight=3", "TN202406", 8.2],
            # Looking for subjects with high difficulty and workload, and low score. Subjects to stay away from
            "q2": [base_query + "&score_high=false&score_weight=3"
                                "&difficulty_high=true&difficulty_weight=5"
                                "&workload_high=true&workload_weight=4", "TPG4190", 7.775],
            # Looking with subjects with low difficulty and workload, score is not that important
            "q3": [base_query + "&score_high=true&score_weight=1"
                                "&difficulty_high=false&difficulty_weight=5"
                                "&workload_high=false&workload_weight=3", "TN202406", 6.2],
            "q4": [base_query + "&score_high=true&score_weight=5"
                                "&difficulty_high=false&difficulty_weight=0"
                                "&workload_high=true&workload_weight=3", "TPG4190", 5.375],
            "q5": [base_query + "&score_high=false&score_weight=0"
                                "&difficulty_high=true&difficulty_weight=5"
                                "&workload_high=false&workload_weight=5", "TPG4190", 6.25],
            "q6": [base_query + "&score_high=true&score_weight=2"
                                "&difficulty_high=false&difficulty_weight=4"
                                "&workload_high=false&workload_weight=0", "TMR4555", 4.4],
        }
        for query in multiple_param_queries.values():
            mock_request = self.rf.get(query[0])
            mock_response = get_courses_from_db(mock_request)
            for i in range(len(res.data["data"]) - 1):
                self.assertTrue(res.data["data"][i]["advanced_sorting_score"]
                                >= res.data["data"][i + 1]["advanced_sorting_score"])

    def test_get_all_courses_invalid_advanced_sorting(self):
        c = Client()
        invalid_advanced_sortings = [1, "1", "TRUE", "FALSE", "@#!%&"]
        invalid_highs =  [1, "1", "TRUE", "FALSE", "@#!%&"]
        invalid_weights = ["-1", "6", "2.5"]
        params = ["score", "difficulty", "workload", "pass_rate", "grade"]
        for bad_adv_sort in invalid_advanced_sortings:
            res = c.get("/course/all/?advanced_sorting={}".format(bad_adv_sort))
            self.assertEqual(res.status_code, 400)
        for param in params:
            for bad_high in invalid_highs:
                res = c.get("/course/all/?advanced_sorting=true&{}_high={}".format(param, bad_high))
                self.assertEqual(res.status_code, 400)
            for bad_weight in invalid_weights:
                res = c.get("/course/all/?advanced_sorting=true&{}_weight={}".format(param, bad_weight))
                self.assertEqual(res.status_code, 400)

    # Without advanced sorting for now
    def test_get_courses_from_db_all_parameters(self):
        n = 10
        offset = 2
        search_value = _get_first_test_course().get("course_code")[1:4]
        order_by = "course_code"
        ascending = "0"  # "0" translates to false, meaning descending
        mock_request = self.rf.get("course/all/?n={}&offset={}&search={}&order_by={}&ascending={}"
                                   .format(n, offset, search_value, order_by, ascending))
        data = get_courses_from_db(mock_request)
        # Tests correct amount of received courses after filtering on search-param
        self.assertEqual(data["count"], 15)
        # Tests n
        self.assertEqual(len(data["data"]), 10)
        # Tests offset
        self.assertEqual(data["data"][0]["course_code"], "TMR4555")
        for i in range(len(data["data"])):
            self.assertTrue(search_value in data["data"][i]["course_code"]
                            or search_value in data["data"][i]["course_name"])
        for i in range(len(data["data"]) - 1):
            self.assertTrue(data["data"][i]["course_code"] >= data["data"][i + 1]["course_code"])

    # Without advanced sorting for now
    def test_get_all_courses_all_parameters(self):
        c = Client()
        n = 10
        offset = 2
        search_value = _get_first_test_course().get("course_code")[1:4]
        order_by = "course_code"
        ascending = "0"  # "0" translates to false, meaning descending
        res = c.get(
            "/course/all/?n={}&offset={}&search={}&order_by={}&ascending={}".format(n, offset, search_value, order_by,
                                                                                    ascending))
        self.assertEqual(res.status_code, 200)
        # Tests correct amount of received courses after filtering on search-param
        self.assertEqual(res.data["count"], 15)
        # Tests n
        self.assertEqual(len(res.data["data"]), 10)
        # Tests offset
        self.assertEqual(res.data["data"][0]["course_code"], "TMR4555")
        for course in res.data["data"]:
            self.assertTrue(search_value in course["course_code"] or search_value in course["course_name"])
        for i in range(len(res.data["data"]) - 1):
            self.assertTrue(res.data["data"][i]["course_code"] >= res.data["data"][i + 1]["course_code"])
