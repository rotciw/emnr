from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .models import Upvote
from review.models import Review
from course.views import retrieve_courses_from_token, get_current_semester, perform_feide_api_call


@api_view(['GET'])
def get_user(request):
    exp_token = request.META['HTTP_AUTHORIZATION']
    json_object = perform_feide_api_call(exp_token, "https://auth.dataporten.no/openid/userinfo")
    user_mail = json_object["email"]
    user = User.objects.filter(email=user_mail).first()
    return Response(user.get_username())


@api_view(['POST'])
def upvote(request):
    exp_token = request.META['HTTP_AUTHORIZATION']
    user = get_user1(exp_token)
    review_id = request.GET.get("reviewId", None)

    if review_id is None or review_id == "undefined":
        return Response("No review id provided", status=400)
    if not Review.objects.filter(id=review_id).exists():
        return Response("Review does not exist", status=400)

    review = Review.objects.get(id=review_id)
    print(review.full_name)
    Upvote(user=user, review=review).save()
    return Response("Upvoted!", 200)


@api_view(['GET'])
def can_upvote(request):
    pass


@api_view(['DELETE'])
def remove_upvote(request):
    pass


def get_user1(exp_token):
    """
    Helper method to get the user stored in our db from the email at dataporten.
    """
    json_object = perform_feide_api_call(exp_token, "https://auth.dataporten.no/openid/userinfo")
    user_mail = json_object["email"]
    user = User.objects.filter(email=user_mail).first()
    return user
