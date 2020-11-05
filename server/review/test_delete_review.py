from django.test import TestCase
from unittest.mock import patch
from review.views import delete_review
from course.models import Course
from review.models import Review
from auth.models import UserAuth
from rest_framework.test import APIClient
from review.tests import mock_feide_apis


@patch("review.views.requests.get", new=mock_feide_apis)
class DeleteReviewTest(TestCase):
    def setUp(self) -> None:
        self.rf = RequestFactory()
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
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@test.com").save()

    def test_delete_review_no_token(self):
        c = APIClient()
        res = c.delete("/review/delete/?courseCode=TMA4100&userEmail=test@test.com")
        self.assertEqual(res.status_code, 401)

    def test_delete_review_nonexistent_token(self):
        pass

    def test_delete_review_invalid_course_code(self):
        # No course code
        # Course code doesn't exist
        pass

    def test_delete_review_invalid_user_email(self):
        pass

    def test_delete_review_user_cannot_delete(self):
        pass

    def test_delete_review_valid_request(self):
        pass