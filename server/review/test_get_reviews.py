from django.test import TestCase
from unittest.mock import patch
from review.views import get_reviews, get_reviews_from_db
from course.models import Course
from review.models import Review
from django.test import RequestFactory, Client
from auth.models import UserAuth
from rest_framework.test import APIClient
from review.tests import mock_feide_apis


@patch("review.views.requests.get", new=mock_feide_apis)
class GetReviewsTest(TestCase):
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
            Review(course_code="TMA4100", user_email="test@testesen.com", score=4, workload=0, difficulty=1,
                   review_text="Jeg er den innloggede brukeren", full_name="Test Testesen", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="pu@pu.com", score=5, workload=1, difficulty=1,
                   review_text="Sykt lett", full_name="PU PUsen", study_programme="MTDT"),
            Review(course_code="TMA4100", user_email="morn@morna.com", score=4, workload=1, difficulty=2,
                   review_text="Morn du", full_name="Mons Bertilsen", study_programme="MTHEI"),
            Review(course_code="EXPH0004", user_email="erasmus@montanus.com", score=1, workload=5, difficulty=2,
                   review_text="Meget filosofisk", full_name="Erasmus Montanus", study_programme="MTDT"),
        ]
        for r in reviews: r.save()
        UserAuth(expiring_token="valid_token", access_token="valid_token", user_email="test@testesen.com").save()

    def test_get_reviews_from_db_invalid_course_code(self):
        # Course code not in Course db
        req = self.rf.get("/review/get/?courseCode=TMA4900", HTTP_AUTHORIZATION="valid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_no_course_code(self):
        # No course code argument passed
        req = self.rf.get("/review/get/?n=25&offset=10", HTTP_AUTHORIZATION="valid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_no_token(self):
        # No expiring token provided
        req = self.rf.get("/review/get/?courseCode=TMA4100")
        with self.assertRaises(KeyError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_invalid_token(self):
        # Invalid token provided
        req = self.rf.get("/review/get/?courseCode=TMA4100", HTTP_AUTHORIZATION="invalid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)
        req = self.rf.get("/review/get/?courseCode=TMA4100&showMyProgramme=true", HTTP_AUTHORIZATION="invalid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_invalid_n(self):
        # N not a number
        req = self.rf.get("/review/get/?courseCode=TMA4100&n=abc", HTTP_AUTHORIZATION="valid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_invalid_offset(self):
        # Not number, and larger than num_reviews
        req = self.rf.get("/review/get/?courseCode=TMA4100&offset=abc", HTTP_AUTHORIZATION="valid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)
        req = self.rf.get("/review/get/?courseCode=TMA4100&offset=10", HTTP_AUTHORIZATION="valid_token")
        with self.assertRaises(ValueError):
            get_reviews_from_db(req)

    def test_get_reviews_from_db_no_reviews_for_course(self):
        # Check count = 0
        req = self.rf.get("/review/get/?courseCode=TDT4136", HTTP_AUTHORIZATION="valid_token")
        res = get_reviews_from_db(req)
        self.assertEqual(res["count"], 0)
        self.assertFalse(res["data"])

    def test_get_reviews_from_db_valid_request(self):
        # Check correct count and number of reviews returned
        req = self.rf.get("/review/get/?courseCode=TMA4100&n=2", HTTP_AUTHORIZATION="valid_token")
        res = get_reviews_from_db(req)
        self.assertEqual(res["count"], 7)
        self.assertEqual(len(res["data"]), 2)

        req = self.rf.get("/review/get/?courseCode=TMA4100", HTTP_AUTHORIZATION="valid_token")
        res = get_reviews_from_db(req)
        self.assertEqual(res["count"], 7)
        self.assertEqual(len(res["data"]), 7)

    def test_get_reviews_from_db_valid_request_sorting(self):
        # The user's own review is the first review
        req = self.rf.get("/review/get/?courseCode=TMA4100&n=2", HTTP_AUTHORIZATION="valid_token")
        res = get_reviews_from_db(req)
        self.assertEqual(res["data"][0]["full_name"], "Test Testesen")

    def test_get_reviews_endpoint_invalid_course(self):
        # invalid and no course code
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TDT101")
        self.assertEqual(res.status_code, 400)
        res = c.get("/review/get/?n=40")
        self.assertEqual(res.status_code, 400)

    def test_get_reviews_endpoint_invalid_params(self):
        # n and offset
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        ress = [
            c.get("/review/get/?courseCode=TMA4100&n=abc"),
            c.get("/review/get/?courseCode=TMA4100&n=100&offset=abc"),
            c.get("/review/get/?courseCode=TMA4100&n=100&offset=40")
        ]
        for r in ress:
            self.assertEqual(r.status_code, 400)

    def test_get_reviews_endpoint_no_token(self):
        c = APIClient()
        res = c.get("/review/get/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 401)

    def test_get_reviews_endpoint_no_reviews(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TDT4290")
        self.assertEqual(res.data["count"], 0)
        self.assertEqual(len(res.data["data"]), 0)

    def test_get_reviews_endpoint_valid_request(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TMA4100&n=2")
        self.assertEqual(res.data["count"], 7)
        self.assertEqual(len(res.data["data"]), 2)

        res = c.get("/review/get/?courseCode=TMA4100")
        self.assertEqual(res.data["count"], 7)
        self.assertEqual(len(res.data["data"]), 7)

    def test_get_reviews_endpoint_valid_request_sorting(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TMA4100")
        self.assertEqual(res.data["data"][0]["full_name"], "Test Testesen")

    def test_get_reviews_endpoint_invalid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='invalid_token')
        res = c.get("/review/get/?courseCode=TMA4100")
        self.assertEqual(res.status_code, 400)

    def test_get_reviews_endpoint_filter_on_programme_valid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TMA4100&showMyProgramme=true")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["data"]), 4)
        self.assertEqual(res.data["count"], 4)

    def test_get_reviews_endpoint_filter_on_programme_invalid_param(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='valid_token')
        res = c.get("/review/get/?courseCode=TMA4100&showMyProgramme=ikkeEnBoolskVerdi")
        self.assertEqual(res.status_code, 400)

    def test_get_reviews_endpoint_filter_programme_invalid_token(self):
        c = APIClient()
        c.credentials(HTTP_AUTHORIZATION='invalid_token')
        res = c.get("/review/get/?courseCode=TMA4100&showMyProgramme=true")
        self.assertEqual(res.status_code, 400)


