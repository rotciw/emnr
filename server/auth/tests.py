from django.test import TestCase, Client

# Create your tests here.
class FeideLogin(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_auth_url(self):
        response = self.client.get('/auth/get-login')
        self.assertIsNotNone(response)



