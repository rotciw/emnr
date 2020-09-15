from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from oauthlib.oauth2 import WebApplicationClient

# Create your views here.
from django.conf import settings


@api_view(['GET'])
def get_login_url(request):
    dataporten_oauth_client = WebApplicationClient(settings.DATAPORTEN_ID)
    dataporten_auth_url = dataporten_oauth_client.prepare_request_uri(
        settings.DATAPORTEN_OAUTH_AUTH_URL, redirect_uri=settings.DATAPORTEN_REDIRECT_URI
    )
    return HttpResponse(dataporten_auth_url)