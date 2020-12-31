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
class PostUpvoteTest(TestCase):

    def setUp(self):
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()
        self.api_client = APIClient()
        self.api_client.credentials(HTTP_AUTHORIZATION="valid_token")
        User.objects.create(username="test@testesen.com", email="test@testesen.com").save()
        # More users?

        courses = [
            Course(course_code="TDT4120", course_name="AlgDat", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TMA4100", course_name="Matte 1", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="EXPH0004", course_name="Exphil", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TFE4101", course_name="KretsDigtek", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TFY4125", course_name="Fysikk", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TDT4290", course_name="KPro", credit=7.5, average_grade=1, pass_rate=100.0),
            Course(course_code="TDT4136", course_name="AI Intro", credit=7.5, average_grade=1, pass_rate=100.0),
        ]
        for c in courses: c.save()
        reviews = [
            Review(course_code="TMA4100", user_email="test@test.com", score=5, workload=1, difficulty=2,
                   review_text="Bra fag", full_name="Test test", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="kpro@kpro.com", score=3, workload=1, difficulty=2,
                   review_text="Givende", full_name="KPro Kproson", study_programme="MTKPRO"),
            Review(course_code="TMA4100", user_email="hei@hallo.com", score=4, workload=1, difficulty=2,
                   review_text="Lattice", full_name="Heman 2015", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="hallo@hei.com", score=2, workload=1, difficulty=2,
                   review_text="Helt ok fag", full_name="Hanna Montana", study_programme="MTTEST"),
            Review(course_code="TMA4100", user_email="pu@pu.com", score=5, workload=1, difficulty=1,
                   review_text="Sykt lett", full_name="PU PUsen", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="morn@morna.com", score=4, workload=1, difficulty=2,
                   review_text="Morn du", full_name="Mons Bertilsen", study_programme="MTHEI"),
            Review(course_code="EXPH0004", user_email="erasmus@montanus.com", score=1, workload=5, difficulty=2,
                   review_text="Meget filosofisk", full_name="Erasmus Montanus", study_programme="MTDT"),
        ]
        for r in reviews: r.save()

    def test_get_user(self):
        self.assertEqual(get_user('valid_token').email, "test@testesen.com")

    def test_upvote_missing_review_id(self):
        response = self.api_client.post("/upvote/", HTTP_AUTHORIZATION="valid_token")
        self.assertEqual(response.status_code, 400, "Upvote without reviewId should not be processed.")

    def test_upvote_invalid_review_id(self):
        # Removing a review, to see if its id(1) can still be upvoted. It should not be.
        Review.objects.get(user_email="test@test.com", course_code="TMA4100").delete()
        invalid_ids = ["1", "5000", "-1", "0", "sdss"]
        for id in invalid_ids:
            response = self.api_client.post("/upvote/?reviewId={}".format(id))
            self.assertEqual(response.status_code, 400, "This id, '{}', should not be valid for upvoting.".format(id))

    def test_upvote_with_banned_user(self):
        BannedUser(user_email="test@testesen.com").save()
        response = self.api_client.post("/upvote/?reviewId=1")
        self.assertEqual(response.status_code, 400, "A banned user should not be allowed to upvote.")

    def test_valid_upvote(self):
        self.assertEqual(Upvote.objects.filter(review=1).count(), 0)
        response = self.api_client.post("/upvote/?reviewId=1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Upvote.objects.filter(review=1).count(), 1)

    def test_multiple_upvotes(self):
        self.api_client.post("/upvote/?reviewId=1")
        self.assertEqual(Upvote.objects.filter(review=1).count(), 1)
        response = self.api_client.post("/upvote/?reviewId=1")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Upvote.objects.filter(review=1).count(), 1, "Number of upvotes for a review should remain the "
                                                                     "same when a user that has already upvoted tries "
                                                                     "to upvote again.")

    def test_missing_user(self):
        # TODO: Write this test.
        # The website mainly uses authentication and user data from Feide.
        # Upvotes however, use the User that is created in our database during authentication.
        # User.objects.get(username="test@testesen.com").delete()
        pass

    def test_deleting_user(self):
        # TODO: Write this test.
        # A user's upvotes should be deleted upon removal / banning of the user.
        pass
