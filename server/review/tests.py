import json
from django.test import TestCase
from unittest.mock import patch
from review.views import post_review, validate_review_post_request, get_reviewable_courses, \
    get_user_full_name_and_email, get_user_study_programme
from course.views import perform_feide_api_call
from course.models import Course
from review.models import Review
from auth.models import UserAuth
from auth.views import get_token


def mock_feide_apis(token, url):
    print("Hello")
    if url == 'https://groups-api.dataporten.no/groups/me/groups':
        if token == 'valid_token':
            with open("review/test_data/mock_groups_api_call.json", "r") as f:
                return json.load(f)
        else:
            with open("review/test_data/invalid_groups_api_response.json", "r") as f:
                return json.load(f)
    elif url == "https://auth.dataporten.no/openid/userinfo":
        if token == 'valid_token':
            with open("review/test_data/mock_userinfo_response.json", "r") as f:
                return json.load(f)
        else:
            with open("review/test_data/invalid_token_userinfo_response.json", "r") as f:
                return json.load(f)


class PostReviewTest(TestCase):
    def setUp(self):
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()

        with open("review/test_data/mock_groups_api_call.json", "r") as f:
            self.mock_groups_api_json = json.load(f)
        with open("review/test_data/invalid_groups_api_response.json", "r") as f:
            self.mock_groups_api_invalid_token_json = json.load(f)
        with open("review/test_data/mock_userinfo_response.json", "r") as f:
            self.mock_userinfo_api_json = json.load(f)
        with open("review/test_data/invalid_token_userinfo_response.json", "r") as f:
            self.mock_userinfo_api_invalid_token_json = json.load(f)



    def test_get_user_study_programme_valid_token(self):
        # Mocking the Groups API, emulating how it responds to a valid token.
        # The response contains the study programme MTDT, so this should be
        # returned from the get_user_study_prog-method.
        with patch("course.views.perform_feide_api_call") as apimock:
            apimock.side_effect = mock_feide_apis
            print(get_user_study_programme("valid_token"))
        """
        with patch("course.views.requests.get") as mock_group_api:
            mock_group_api.return_value.json.return_value = self.mock_groups_api_json
            self.assertEqual(get_user_study_programme("valid_token"), "MTDT")"""

    def test_get_user_study_programme_invalid_token(self):
        # Mocking the Groups API, emulating how it responds to an invalid token.
        # get_user_study_programme should raise a value error.
        with patch("course.views.requests.get") as mock_group_api:
            mock_group_api.return_value.json.return_value = self.mock_groups_api_invalid_token_json
            with self.assertRaises(ValueError):
                get_user_study_programme("invalid_token")

    def test_get_user_full_name_and_email_valid_token(self):
        # Mocking the UserInfo API, emulating how it responds to a valid token.
        # The name Test Testesen and email test@testesen.com should be returned.
        with patch("course.views.requests.get") as mock_userinfo_api:
            mock_userinfo_api.return_value.json.return_value = self.mock_userinfo_api_json
            true_name = "Test Testesen"
            true_email = "test@testesen.com"
            returned_name, returned_email = get_user_full_name_and_email("valid token")
            self.assertEqual(returned_name, true_name)
            self.assertEqual(returned_email, true_email)

    def test_get_user_full_name_and_email_invalid_token(self):
        # Mocking the UserInfo API, emulating how it responds to an invalid token.
        # A value error should be raised.
        with patch("course.views.requests.get") as mock_userinfo_api:
            mock_userinfo_api.return_value.json.return_value = self.mock_userinfo_api_invalid_token_json
            with self.assertRaises(ValueError):
                get_user_full_name_and_email("invalid token")

    def test_get_reviewable_courses_valid_token(self):
        # Check that courses for the current semester are removed.
        with patch("course.views.requests.get") as mock_group_api, patch(
                "course.views.get_current_semester") as mock_curr_semester, patch(
            "course.views.Course") as mock_course_db:
            mock_group_api.return_value.json.return_value = self.mock_groups_api_json
            mock_curr_semester.return_value = "H2020"
            mock_course_db.return_value.objects.return_value.filter.return_value = [
                Course.create("AAA9999", "Test course", 0, 0)]
            actual_reviewables = [
                'EXPH0004', 'TDT4137', 'TMA4140', 'TDT4136', 'TFE4101', 'TDT4112', 'TDT4113', 'TDT4110', 'TMA4100',
                'TDT4180', 'HMS0002', 'TDT4160', 'TDT4186', 'TFY4125', 'TDT4100', 'TMA4135', 'TDT4145', 'TDT4120',
                'TDT4140', 'TDT4171', 'TMA4115', 'TMA4240', 'TIØ4252', 'TTM4100']
            for course in get_reviewable_courses("valid token"):
                if course not in actual_reviewables:
                    self.fail("Invalid course in reviewable courses")

    def test_get_reviewable_courses_invalid_token(self):
        mock_group_api_patcher = patch("course.views.requests.get")
        mock_group_api = mock_group_api_patcher.start()
        mock_curr_semester_patcher = patch("course.views.get_current_semester")
        mock_curr_semester = mock_curr_semester_patcher.start()
        mock_course_db_patcher = patch("course.views.Course")
        mock_course_db = mock_course_db_patcher.start()
        self.addCleanup(patch.stopall)
        mock_group_api.return_value.json.return_value = self.mock_groups_api_invalid_token_json
        mock_curr_semester.return_value = "H2020"
        mock_course_db.return_value.objects.return_value.filter.return_value = [
            Course.create("AAA9999", "Test course", 0, 0)]
        with self.assertRaises(ValueError):
            get_reviewable_courses("invalid token")

    def test_validate_review_post_request(self):
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

        # No attributes and wrong attributes
        with self.assertRaises(KeyError):
            validate_review_post_request({}, [], "")
        with self.assertRaises(KeyError):
            validate_review_post_request(
                {"course_code": "TDT4120", "score": 1, "workload": 1, "difficulty": 1, "reviewText": "Lorem ipsum"}, [],
                "")
        with self.assertRaises(KeyError):
            validate_review_post_request({"test": "should raise KeyError"}, [], "")

        # Course code not in reviewable courses
        with self.assertRaises(ValueError):
            validate_review_post_request(test_data, ["TDT4120", "TMA4100", "EXPH0600", "EXFAC1002"],
                                         "test@testesen.com")

        # Review exists already
        test_review = Review(user_email="test@testesen.com", course_code="TDT4290", score=4, workload=5, difficulty=3,
                             review_text="Test review", full_name="Test Testesen", study_programme="MTDT")
        test_review.save()
        with self.assertRaises(ValueError):
            validate_review_post_request(test_data, ["TDT4290", "TMA4125"], "test@testesen.com")

        test_review.delete()

        # Wrong score
        scores = [0, -1253, 6, float("inf"), "abasd"]
        for elem in scores:
            data = {k: test_data[k] for k in test_data.keys()}
            data["score"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

        # Wrong difficulty
        difficulties = [0, -1253, 6, float("inf"), "abasd"]
        for elem in difficulties:
            data = {k: test_data[k] for k in test_data.keys()}
            data["difficulty"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

        # Wrong workload
        workloads = [0, -1253, 6, float("inf"), "abasd"]
        for elem in workloads:
            data = {k: test_data[k] for k in test_data.keys()}
            data["workload"] = elem
            with self.assertRaises(ValueError):
                validate_review_post_request(data, ["TDT4290", "TMA4125"], "test@testesen.com")

        # Valid request
        self.assertIsNone(validate_review_post_request(test_data, ["TDT4290", "TMA4125"], "test@testesen.com"))

    def test_post_review(self):
        valid_test_data = {"courseCode": "TDT4290",
                           "score": 1,
                           "workload": 1,
                           "difficulty": 1,
                           "reviewText": "Lorem ipsum"}
        invalid_test_data = {"course_code": "TDT4290",
                             "score": -2,
                             "workload": "abx",
                             "difficulty": 0}
        print(get_token("valid_token"))
        # Test invalid JSON formatting

        # Test invalid JSON values
        # Test valid request (returns 200 and review stored to db)
        # Både UserInfo og Groups-API må mockes
        pass


