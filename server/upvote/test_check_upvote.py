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


class CheckUpvoteTest(TestCase):

    def setUp(self):
        pass

    def test_check_upvote_missing_review_id(self):
        pass

    def test_check_upvote_invalid_review_id_values(self):
        pass

    def test_check_upvote_can_upvote(self):
        pass

    def test_check_upvote_user_already_upvoted(self):
        pass

    def test_check_upvote_missing_expiring_token(self):
        pass

    def test_check_upvote_banned_user(self):
        pass
