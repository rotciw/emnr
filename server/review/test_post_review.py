import json
from django.test import TestCase
from unittest.mock import patch
from review.views import post_review, validate_review_post_request, get_reviewable_courses, \
    get_user_full_name_and_email, get_user_study_programme
from course.models import Course
from review.models import Review
from auth.models import UserAuth
from rest_framework.test import APIClient
from .tests import mock_feide_apis


@patch("course.views.requests.get", new=mock_feide_apis)
class PostReviewTest(TestCase):
    def setUp(self):
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()

    def test_get_user_study_programme_valid_token(self):
        # Mocking the Groups API, emulating how it responds to a valid token.
        # The response contains the study programme MTDT, so this should be
        # returned from the get_user_study_prog-method.
        self.assertEqual(get_user_study_programme("valid_token"), "MTDT")

    def test_get_user_study_programme_invalid_token(self):
        # Mocking the Groups API, emulating how it responds to an invalid token.
        # get_user_study_programme should raise a value error.
        with self.assertRaises(ValueError):
            get_user_study_programme("invalid_token")

    def test_get_user_full_name_and_email_valid_token(self):
        # Mocking the UserInfo API, emulating how it responds to a valid token.
        # The name Test Testesen and email test@testesen.com should be returned.
        true_name = "Test Testesen"
        true_email = "test@testesen.com"
        returned_name, returned_email = get_user_full_name_and_email("valid_token")
        self.assertEqual(returned_name, true_name)
        self.assertEqual(returned_email, true_email)

    def test_get_user_full_name_and_email_invalid_token(self):
        # Mocking the UserInfo API, emulating how it responds to an invalid token.
        # A value error should be raised.
        with self.assertRaises(ValueError):
            get_user_full_name_and_email("invalid_token")

    def test_get_reviewable_courses_valid_token(self):
        # Check that courses for the current semester are removed.
        with patch("course.views.get_current_semester") as mock_curr_semester, \
             patch("course.views.Course") as mock_course_db:
            mock_curr_semester.return_value = "H2020"
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0, 100.0)]
            actual_reviewables = [
                'EXPH0004', 'TDT4137', 'TMA4140', 'TDT4136', 'TFE4101', 'TDT4112', 'TDT4113', 'TDT4110', 'TMA4100',
                'TDT4180', 'HMS0002', 'TDT4160', 'TDT4186', 'TFY4125', 'TDT4100', 'TMA4135', 'TDT4145', 'TDT4120',
                'TDT4140', 'TDT4171', 'TMA4115', 'TMA4240', 'TIØ4252', 'TTM4100']
            for course in get_reviewable_courses("valid_token"):
                if course not in actual_reviewables:
                    self.fail("Invalid course in reviewable courses")

    def test_get_reviewable_courses_invalid_token(self):
        with patch("course.views.get_current_semester") as mock_curr_semester, \
             patch("course.views.Course") as mock_course_db:
            mock_curr_semester.return_value = "H2020"
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0, 100.0)]
            with self.assertRaises(ValueError):
                get_reviewable_courses("invalid token")

    def test_validate_review_post_request_missing_values(self):
        # Missing attributes
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        for key in test_data.keys():
            data_subset = {k: test_data[k] for k in filter(lambda k: k != key, test_data.keys())}
            with self.assertRaises(KeyError):
                validate_review_post_request(data_subset, [], "")

    def test_validate_review_post_request_no_or_wrong_attributes(self):
        # No attributes and wrong attributes
        with self.assertRaises(KeyError):
            validate_review_post_request({}, [], "")
        with self.assertRaises(KeyError):
            validate_review_post_request(
                {"course_code": "TDT4120", "score": 1, "workload": 1, "difficulty": 1, "reviewText": "Lorem ipsum"}, [],
                "")
        with self.assertRaises(KeyError):
            validate_review_post_request({"test": "should raise KeyError"}, [], "")

    def test_validate_review_post_request_nonexistent_course_code(self):
        # Course code not in reviewable courses
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        with self.assertRaises(ValueError):
            validate_review_post_request(test_data, ["TDT4120", "TMA4100", "EXPH0600", "EXFAC1002"],
                                         "test@testesen.com")

    def test_validate_review_post_request_review_exists(self):
        # Review exists already
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        test_review = Review(user_email="test@testesen.com", course_code="TDT4290", score=4, workload=5, difficulty=3,
                             review_text="Test review", full_name="Test Testesen", study_programme="MTDT")
        test_review.save()
        with self.assertRaises(ValueError):
            validate_review_post_request(test_data, ["TDT4290", "TMA4125"], "test@testesen.com")

    def test_validate_review_post_request_wrong_score(self):
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        # Wrong score
        scores = [0, -1253, 6, float("inf"), "abasd"]
        for elem in scores:
            data = {k: test_data[k] for k in test_data.keys()}
            data["score"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

    def test_validate_review_post_request_wrong_difficulty(self):
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        # Wrong difficulty
        difficulties = [-1253, 3, float("inf"), "abasd"]
        for elem in difficulties:
            data = {k: test_data[k] for k in test_data.keys()}
            data["difficulty"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

    def test_validate_review_post_request_wrong_workload(self):
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        # Wrong workload
        workloads = [-1253, 3, float("inf"), "abasd"]
        for elem in workloads:
            data = {k: test_data[k] for k in test_data.keys()}
            data["workload"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

    def test_validate_review_post_request_valid_review(self):
        test_data = {"courseCode": "TDT4290",
                     "score": 1,
                     "workload": 1,
                     "difficulty": 1,
                     "reviewText": "Lorem ipsum"}
        # Valid request
        self.assertIsNone(validate_review_post_request(test_data, ["TDT4290", "TMA4125"], "test@testesen.com"))

    def test_post_review_invalid_JSON_formatting_and_values_and_nonexistent_course(self):
        invalid_test_data = {"course_code": "TDT4290",
                             "score": -2,
                             "workload": "abx",
                             "difficulty": 0}
        # Test invalid JSON formatting and values
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        response = c.post("/review/", data=invalid_test_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_post_review_invalid_JSON_formatting_and_values_course_exists(self):
        invalid_test_data = {"course_code": "TDT4290",
                             "score": -2,
                             "workload": "abx",
                             "difficulty": 0}
        course = Course(course_code="TDT4290", course_name="Customer Driven Project", credit=15, average_grade=1,
                        pass_rate=100.0)
        course.save()
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        response = c.post("/review/", data=invalid_test_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_post_review_valid_request_nonexistent_course(self):
        # Test valid request but nonexistent course
        valid_test_data = {"courseCode": "TDT4290",
                           "score": 1,
                           "workload": 1,
                           "difficulty": 1,
                           "reviewText": "Lorem ipsum"}
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        response = c.post("/review/", data=valid_test_data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_post_review_valid_request_course_exists(self):
        # Test valid request with existing course
        valid_test_data = {"courseCode": "TDT4120",
                           "score": 1,
                           "workload": 1,
                           "difficulty": 1,
                           "reviewText": "Lorem ipsum"}
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        with patch("course.views.Course") as mock_course_db:
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0, 100.0)]
            response = c.post("/review/", data=valid_test_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Review.objects.filter(course_code="TDT4120", user_email="test@testesen.com").exists())
