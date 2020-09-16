from django.http import HttpResponse
from django.shortcuts import render
import requests
from oauthlib.oauth2 import WebApplicationClient
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_expiring_authtoken.models import ExpiringToken
from django.contrib.auth.models import User
from django.conf import settings

@api_view(['GET'])
def get_login_url(request):
    dataporten_oauth_client = WebApplicationClient(settings.DATAPORTEN_ID)
    dataporten_auth_url = dataporten_oauth_client.prepare_request_uri(
        settings.DATAPORTEN_OAUTH_AUTH_URL, redirect_uri=settings.DATAPORTEN_REDIRECT_URI
    )
    return HttpResponse(dataporten_auth_url)

@api_view(['GET'])
def verify_token(request):
    dataporten_oauth_client = WebApplicationClient(settings.DATAPORTEN_ID)

    code = request.GET.get('code')

    redirect_uri = settings.DATAPORTEN_REDIRECT_URI

    token_request_body = dataporten_oauth_client.prepare_request_body(
        code=code, redirect_uri=redirect_uri, client_secret=settings.DATAPORTEN_SECRET
    )

    token_request_response = requests.post(
        settings.DATAPORTEN_OAUTH_TOKEN_URL, data=token_request_body, headers={
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': 'Basic {}'.format(settings.DATAPORTEN_SECRET),
        }
    )

    if token_request_response.status_code != 200:
        raise Exception('invalid code')

    response_json = token_request_response.json()

    session = requests.Session()
    session.headers.update({'authorization': 'bearer {}'.format(response_json['access_token'])})

    user_info = session.get(settings.DATAPORTEN_USER_INFO_URL).json()['user']

    #TODO Create a user service that connects to this
    user_mail = user_info['email']

    user, created = User.objects.get_or_create(email=user_mail)
    ExpiringToken.objects.filter(user=user).delete()
    token = ExpiringToken.objects.create(user=user)
    return Response (({'token': token.key }))
