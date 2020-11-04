from django.test import TestCase
from unittest.mock import patch
from rest_framework.test import APIClient

from auth.models import UserAuth
from .tests import mock_feide_apis
from course.models import Course
from review.models import Review


class MockQuerySet:
    def __init__(self, contents):
        self.contents = contents

    def exists(self):
        return len(self.contents) > 0

    def __getitem__(self, sliced):
        return self.contents[sliced]


@patch("course.views.requests.get", new=mock_feide_apis)
class CanReviewTest(TestCase):

    def setUp(self) -> None:
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()
        UserAuth(expiring_token="expired_token", access_token="expired_token", user_email="abc@xyz.no").save()
        Course(course_code="TMA4100", course_name="Matematikk 1", credit=7.5, average_grade=2, pass_rate=100.0).save()

    def test_can_review_invalid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='invalid token')
        res = c.get("/review/check/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, 3)

    def test_can_review_no_course_code(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/check/")
        self.assertEqual(res.status_code, 400)

    def test_can_review_invalid_course_code(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/check/?courseCode=Ikkeetfag")
        self.assertEqual(res.status_code, 400)

    def test_can_review_review_exists(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        Review(course_code="TMA4100", user_email="test@testesen.com", score=5, workload=1, difficulty=2,
               review_text="Bra fag", full_name="Test testesen", study_programme="MTDT").save()
        with patch("course.views.Course.objects.filter") as mock_course_db:
            mock_course_db.return_value = MockQuerySet([
                Course.create("AAA9999", "Test course", 0, 0, 100.0)])
            res = c.get("/review/check/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, 2)

    def test_can_review_successful(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        with patch("course.views.Course.objects.filter") as mock_course_db:
            mock_course_db.return_value = MockQuerySet([
                Course.create("AAA9999", "Test course", 0, 0, 100.0)])
            res = c.get("/review/check/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, 0)