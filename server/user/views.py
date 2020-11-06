from django.db.models import Avg
from django.shortcuts import render
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pathlib import Path
from review.views import check_if_is_admin, get_user_full_name_and_email
from review.models import Review
from course.models import Course
from auth.models import UserAuth


@api_view(["DELETE"])
def delete_user(request):
    """
    Endpoint for handling deletion/banning of a single user.
    Request should contain the expiring token of the current session,
    and the parameter userEmail, indicating the email of the user to be deleted.

    When deleting a user, all their reviews should also be deleted.
    """
    # Get and authenticate expiring token
    try:
        exp_token = request.META["HTTP_AUTHORIZATION"]
    except KeyError:
        return Response("No expiring token provided", 401)
    if not UserAuth.objects.filter(expiring_token=exp_token).exists():
        return Response("Invalid expiring token provided", 401)

    # Validate that user sending the request is an admin
    try:
        _, user_email = get_user_full_name_and_email(exp_token)
    except ValueError as e:
        return Response(str(e), status=400)

    if not check_if_is_admin(user_email):
        return Response("Current user is not an admin.", status=401)

    # Get and validate user email parameter
    passed_email = request.GET.get("userEmail", None)
    if passed_email is None:
        return Response("No user email provided", status=400)

    # Check if blacklist file exists. If it does, check if the user to be banned is already banned.
    if Path(".bannedusers").exists():
        with open(".bannedusers", "r") as blacklist_file:
            banned_users = list(map(lambda raw_line: raw_line.strip(), blacklist_file.readlines()))
        if passed_email in banned_users:
            return Response("User is already banned.", status=200)

    # Add passed email to blacklist file
    with open(".bannedusers", "a") as blacklist_file:
        blacklist_file.write(passed_email + "\n")

    # Delete all reviews belonging to the deleted user, and update the statistics of the related courses
    user_reviews = Review.objects.filter(user_email=passed_email)
    affected_courses = []
    for review in user_reviews:
        affected_courses.append(review.course_code)
        review.delete()

    affected_courses = list(set(affected_courses))  # Remove duplicates from affected courses
    for course_code in affected_courses:
        course_qs = Course.objects.filter(course_code=course_code)
        review_qs = Review.objects.filter(course_code=course_code)

        # Update review counter
        course_qs.update(review_count=review_qs.count())

        # Update average review score
        course_qs.update(average_review_score=review_qs.aggregate(Avg("score"))["score__avg"])

        # Update average difficulty
        course_qs.update(average_difficulty=review_qs.aggregate(Avg("difficulty"))["difficulty__avg"])

        # Update average workload
        course_qs.update(average_workload=review_qs.aggregate(Avg("workload"))["workload__avg"])

    # Return a 200 indicating that the user is successfully banned
    return Response("User successfully banned, with all reviews deleted.", status=200)
