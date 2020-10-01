from django.http import HttpResponse
import requests
from django.core.exceptions import PermissionDenied
from oauthlib.oauth2 import WebApplicationClient
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_expiring_authtoken.models import ExpiringToken
from django.contrib.auth.models import User
from django.conf import settings
from .models import UserAuth


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
    user_mail = user_info['email']
    user, created = User.objects.get_or_create(email=user_mail)
    ExpiringToken.objects.filter(user=user).delete()
    token = ExpiringToken.objects.create(user=user)
    access_token = response_json['access_token']
    has_token = False
    print('user_mail', user_mail)
    try:
        has_token = UserAuth.objects.get(user_email=user_mail).exists()
    except:
        print("User has no token")
    if has_token:
        UserAuth.objects.get(user_email=user_mail).delete()
    UserAuth.objects.create(user_email=user_mail, expiring_token="Token " + str(token), access_token=access_token)
    return Response(({'token': token.key, 'email': user_mail}))


@api_view(["GET"])
def validate_token(request):
    if request.user.is_anonymous:
        raise PermissionDenied
    token = ExpiringToken.objects.get(user=request.user)
    return HttpResponse(token.valid())


def get_token(expiring_token):
    access_token = ''
    try:
        user_auth = UserAuth.objects.get(expiring_token=expiring_token)
        access_token = user_auth.access_token
    except:
        print('No token found')
    return access_token
