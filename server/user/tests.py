from django.db.models import Avg
from django.test import TestCase
from course.models import Course
from rest_framework.test import APIClient
from review.models import Review
from auth.models import UserAuth
from .models import AdminUser, BannedUser
from review.tests import mock_feide_apis
from unittest.mock import patch


@patch("review.views.requests.get", new=mock_feide_apis)
class DeleteUserTest(TestCase):

    def setUp(self) -> None:
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
            Review(course_code="TMA4100", user_email="test@testesen.com", score=5, workload=1, difficulty=2,
                   review_text="Bra fag", full_name="Test test", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="kpro@kpro.com", score=3, workload=0, difficulty=0,
                   review_text="Givende", full_name="KPro Kproson", study_programme="MTKPRO"),
            Review(course_code="TMA4100", user_email="hei@hallo.com", score=4, workload=1, difficulty=2,
                   review_text="Lattice", full_name="Heman 2015", study_programme="MTDT"),
            Review(course_code="TDT4120", user_email="kpro@kpro.com", score=5, workload=2, difficulty=2,
                   review_text="Kult", full_name="KPro Kproson", study_programme="MTKPRO"),
            Review(course_code="TDT4120", user_email="test@testesen.com", score=1, workload=0, difficulty=0,
                   review_text="Kjipt", full_name="Test test", study_programme="MTDT"),
            Review(course_code="EXPH0004", user_email="kpro@kpro.com", score=3, workload=1, difficulty=0,
                   review_text="<3", full_name="KPro Kproson", study_programme="MTDT")
        ]
        for r in reviews: r.save()
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()

    def test_delete_user_no_token(self):
        c = APIClient()
        res = c.delete("/user/delete/?userEmail=kpro@kpro.com")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.data, "No expiring token provided")

    def test_delete_user_invalid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='invalid_token')
        res = c.delete("/user/delete/?userEmail=kpro@kpro.com")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.data, "Invalid expiring token provided")

    def test_delete_user_not_admin(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.delete("/user/delete/?userEmail=kpro@kpro.com")
        self.assertEqual(res.status_code, 401)
        self.assertEqual(res.data, "Current user is not an admin.")

    def test_delete_user_no_email(self):
        AdminUser(user_email="test@testesen.com").save()
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.delete("/user/delete/")
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.data, "No user email provided")

    def test_delete_user_already_banned(self):
        AdminUser(user_email="test@testesen.com").save()
        BannedUser(user_email="hei@hallo.com").save()
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.delete("/user/delete/?userEmail=hei@hallo.com")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, "User is already banned.")

    def test_delete_user_valid_request(self):
        # Check that is updated, and that
        AdminUser(user_email="test@testesen.com").save()
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.delete("/user/delete/?userEmail=kpro@kpro.com")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, "User successfully banned, with all reviews deleted.")

        # Validate that TDT4290 is correct
        self.assertEqual(Review.objects.filter(course_code="TDT4290").count(), 0)
        course = Course.objects.get(course_code="TDT4290")
        self.assertEqual(course.average_review_score, 0)
        self.assertEqual(course.average_difficulty, -1)
        self.assertEqual(course.average_workload, -1)

        # Validate that TMA4100 is correct
        self.assertEqual(Review.objects.filter(course_code="TMA4100").count(), 2)
        course = Course.objects.get(course_code="TMA4100")
        self.assertEqual(course.average_review_score, 4.5)
        self.assertEqual(course.average_difficulty, 2)
        self.assertEqual(course.average_workload, 1)

        # Validate that TDT4120 is correct
        self.assertEqual(Review.objects.filter(course_code="TDT4120").count(), 1)
        course = Course.objects.get(course_code="TDT4120")
        self.assertEqual(course.average_review_score, 1)
        self.assertEqual(course.average_difficulty, 0)
        self.assertEqual(course.average_workload, 0)
