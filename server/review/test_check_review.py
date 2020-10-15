from django.test import TestCase
from unittest.mock import patch
from rest_framework.test import APIClient

from auth.models import UserAuth
from .tests import mock_feide_apis


@patch("course.views.requests.get", new=mock_feide_apis)
class CanReviewTest(TestCase):

    def setUp(self) -> None:
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()

    def test_can_review_invalid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='invalid token')
        res = c.get("/review/check/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, 3)

    def test_can_review_no_course_code(self):
        pass

    def test_can_review_invalid_course_code(self):
        pass

    def test_can_review_nonreviewable_course(self):
        pass

    def test_can_review_review_exists(self):
        pass

    def test_can_review_successful(self):
        pass