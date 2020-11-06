from django.test import TestCase


class DeleteUserTest(TestCase):

    def test_delete_user_no_token(self):
        pass

    def test_delete_user_invalid_token(self):
        pass

    def test_delete_user_not_admin(self):
        pass

    def test_delete_user_no_email(self):
        pass

    def test_delete_user_already_banned(self):
        pass

    def test_delete_user_remaining_reviews_for_all_courses(self):
        # Check that is updated, and that
        pass

    def test_delete_user_no_remaining_reviews_for_courses(self):
        pass
