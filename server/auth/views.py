from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from oauthlib.oauth2 import WebApplicationClient

# Create your views here.
from django.conf import settings


@api_view(['GET'])
def get_login_url(request):
    #dataporten_oauth_client = WebApplicationClient(settings.DATAPORTEN_ID)
    return HttpResponse(settings.DATAPORTEN_ID)