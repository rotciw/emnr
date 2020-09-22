from django.test import TestCase, Client
from oauthlib.oauth2 import LegacyApplicationClient
from django.conf import settings

# Create your tests here.
class FeideLogin(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_auth_url(self):
        response = self.client.get('/auth/get-login')
        self.assertIsNotNone(response)



