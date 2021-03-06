from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from .models import Upvote
from user.models import BannedUser
from review.models import Review
from auth.models import UserAuth
from course.views import perform_feide_api_call


@api_view(['POST'])
def post_upvote(request):
    status_response = get_upvote_status_from_db(request=request)
    if status_response.status_code != 200:
        return status_response

    if status_response.data != 0:
        return Response("User cannot upvote this review.", status=400)
    else:
        exp_token = request.META['HTTP_AUTHORIZATION']
        user = get_user(exp_token)
        review_id = request.GET.get("reviewId")
        review = Review.objects.get(id=review_id)
        Upvote(user=user, review=review).save()
        return Response("Upvoted!", 200)


@api_view(['DELETE'])
def delete_upvote(request):
    """
    Removes the user's upvote from the given review (reviewId), if it has one.
    """
    status_response = get_upvote_status_from_db(request=request)
    if status_response.status_code != 200:
        return status_response

    if status_response.data != 1:
        return Response("User cannot delete upvote for this review.", status=400)
    else:
        exp_token = request.META['HTTP_AUTHORIZATION']
        user = get_user(exp_token)
        review_id = request.GET.get("reviewId")
        review = Review.objects.get(id=review_id)
        upvote = Upvote.objects.get(user=user, review=review)
        upvote.delete()
        return Response("Upvote successfully removed.", status=200)


@api_view(['GET'])
def upvote_status(request):
    return get_upvote_status_from_db(request=request)


def get_upvote_status_from_db(request):
    """
    See the user's upvote status for a given review(reviewId).
    0: User can upvote this review
    1. User has already upvoted this review.
    2: User cannot review because its expiring token does not exist.
    3. User is banned from making upvotes
    """
    try:
        exp_token = request.META['HTTP_AUTHORIZATION']
    except KeyError:
        return Response("Field HTTP_AUTHORIZATION missing in request, i.e. missing user's expiring token.", status=401)

    review_id = request.GET.get('reviewId', None)
    return _get_upvote_status_from_db(exp_token=exp_token, review_id=review_id)


def _get_upvote_status_from_db(exp_token, review_id):
    """
    Helper method for get_upvote_status_from_db
    """
    if review_id is None or review_id == "undefined":
        return Response("No review id provided", status=400)
    try:
        int(review_id)
    except ValueError:
        return Response("reviewId is not an integer.", status=400)
    if not Review.objects.filter(id=review_id).exists():
        return Response("Review does not exist", status=400)
    review = Review.objects.get(id=review_id)

    if not UserAuth.objects.filter(expiring_token=exp_token).exists():
        return Response(2, status=200)

    user = get_user(exp_token)
    if user is None:
        return Response("User not found in our database", status=401)
    if BannedUser.objects.filter(user_email=user.email).exists():
        return Response(3, status=200)
    elif Upvote.objects.filter(user=user).filter(review=review).exists():
        return Response(1, status=200)
    else:
        return Response(0, status=200)


def get_user(exp_token):
    """
    Helper method to get the user stored in our db from the email at dataporten.
    """
    json_object = perform_feide_api_call(exp_token, "https://auth.dataporten.no/openid/userinfo")
    user_mail = json_object["email"]
    try:
        user = User.objects.get(email=user_mail)
    except ObjectDoesNotExist as e:
        print(e, "User object not found in our database.")
        return None
    return user
