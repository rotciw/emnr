import json
from django.test import TestCase
from unittest.mock import patch
from course.models import Course
from review.models import Review
from auth.models import UserAuth
from upvote.models import Upvote
from user.models import BannedUser
from .views import get_user
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from django.test import RequestFactory
from review.tests import mock_feide_apis


@patch("course.views.requests.get", new=mock_feide_apis)
class CheckUpvoteTest(TestCase):

    def setUp(self):
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()
        self.api_client = APIClient()
        self.api_client.credentials(HTTP_AUTHORIZATION="valid_token")
        User.objects.create(username="test@testesen.com", email="test@testesen.com").save()
        User.objects.create(username="1test@testesen.com", email="1-test@testesen.com").save()
        Course(course_code="TMA4100", course_name="Matte 1", credit=7.5, average_grade=1, pass_rate=100.0).save()
        Review(course_code="TMA4100", user_email="test@test.com", score=5, workload=1, difficulty=2,
               review_text="Bra fag", full_name="Test test", study_programme="MTDT").save()
        Review(course_code="TMA4100", user_email="kpro@kpro.com", score=3, workload=1, difficulty=2,
               review_text="Givende", full_name="KPro Kproson", study_programme="MTKPRO").save()
        self.curr_user = User.objects.get(username="test@testesen.com")
        self.other_user = User.objects.get(username="1test@testesen.com")
        self.review1 = Review.objects.get(course_code="TMA4100", user_email="test@test.com")
        self.review2 = Review.objects.get(course_code="TMA4100", user_email="kpro@kpro.com")
        Upvote(user=self.curr_user, review=self.review1).save()
        Upvote(user=self.other_user, review=self.review1).save()

    def test_check_upvote_missing_review_id(self):
        response = self.api_client.get("/upvote/check/")
        self.assertEqual(response.status_code, 400, "Check upvote without reviewId should not be processed.")

    def test_check_upvote_invalid_review_id_values(self):
        invalid_ids = ["5000", "-1", "0", "sdss"]
        for id in invalid_ids:
            response = self.api_client.get("/upvote/check/?reviewId={}".format(id))
            self.assertEqual(response.status_code, 400, "This id, '{}', should not be valid for checking.".format(id))

    def test_check_upvote_can_upvote(self):
        response = self.api_client.get("/upvote/check/?reviewId=2")
        self.assertEqual(response.data, 0)

    def test_check_upvote_user_already_upvoted(self):
        response = self.api_client.get("/upvote/check/?reviewId=1")
        self.assertEqual(response.data, 1)

    def test_check_upvote_missing_expiring_token(self):
        UserAuth.objects.get(expiring_token="valid_token").delete()
        response = self.api_client.get("/upvote/check/?reviewId=1")
        self.assertEqual(response.data, 2)

    def test_check_upvote_banned_user(self):
        BannedUser(user_email="test@testesen.com").save()
        response = self.api_client.get("/upvote/check/?reviewId=1")
        self.assertEqual(response.data, 3)
