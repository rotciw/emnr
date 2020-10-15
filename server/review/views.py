from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import requests
from course.views import retrieve_courses_from_token, get_current_semester, perform_feide_api_call
from auth.views import get_token
from .models import Review


@api_view(['POST'])
def post_review(request):
    """
    Handles posting of reviews to the database.

    The incoming POST request data should be of the following format:
    {
        courseCode: ...,
        score: (number between 1 and 5),
        workload: (number between 1 and 5),
        difficulty: (number between 1 and 5),
        reviewText: Free text field. Can be empty, but should be provided nonetheless.
    }
    """
    request_data = json.loads(request.body)
    # Get full name, email, study programme and all taken courses from Feide APIs.
    exp_token = request.META['HTTP_AUTHORIZATION']
    try:
        reviewable_courses = get_reviewable_courses(exp_token)
        full_name, email = get_user_full_name_and_email(exp_token)
        study_prg = get_user_study_programme(exp_token)
    except ValueError as e:
        return Response(str(e), status=400)
    except IndexError as e:
        return Response("Course does not exist in the database", status=400)

    # Validate request
    try:
        validate_review_post_request(request_data, reviewable_courses, email)
    except ValueError as e:
        return Response(str(e), status=400)
    except KeyError as e:
        return Response(str(e), status=400)

    # Save the review to the database.
    Review(user_email=email, course_code=request_data["courseCode"], score=request_data["score"],
           workload=request_data["workload"], difficulty=request_data["difficulty"],
           review_text=request_data["reviewText"], full_name=full_name, study_programme=study_prg).save()

    # Indicate successful posting
    return Response(status=200)


def validate_review_post_request(request_data, reviewable_courses, email):
    """
    Validates that all fields in a review post request are present, and have valid values.
    Raises a KeyError if a field is missing, and a ValueError if the review or any of the fields are invalid.
    """
    required_fields = ["courseCode", "score", "workload", "difficulty", "reviewText"]
    for field in required_fields:
        if field not in request_data.keys():
            raise KeyError("Missing field in review: {}".format(field))

    # Validate that the course code is for a course one has already taken, and that a review does not exist already.
    if request_data["courseCode"] not in reviewable_courses:
        raise ValueError("User is unable to review this course, as it has not completed the course.")
    if Review.objects.filter(course_code=request_data["courseCode"], user_email=email).exists():
        raise ValueError("User is unable to review this course, as it has already reviewed it.")

    # Validate score, difficulty and workload
    if not isinstance(request_data["score"], int) or request_data["score"] < 1 or request_data["score"] > 5:
        raise ValueError("Invalid score: {} (Must be between 1 and 5)".format(request_data["score"]))
    if not isinstance(request_data["difficulty"], int) or request_data["difficulty"] < 1 or request_data[
        "difficulty"] > 5:
        raise ValueError("Invalid difficulty: {} (Must be between 1 and 5)".format(request_data["difficulty"]))
    if not isinstance(request_data["workload"], int) or request_data["workload"] < 1 or request_data["workload"] > 5:
        raise ValueError("Invalid workload: {} (Must be between 1 and 5)".format(request_data["workload"]))


def get_reviewable_courses(exp_token):
    """
    Gets a list of course codes for the courses that the user can review (i.e. courses that have been passed in
    semesters earlier than the current).

    The filtering removes courses that are being taken right now,
    and the mapping maps from course object to course code.
    """
    try:
        return list(
            map(lambda filtered_ci: filtered_ci["course_code"],
                filter(lambda course_info: course_info["semester"] != get_current_semester(),
                       retrieve_courses_from_token(exp_token))))
    except TypeError as e:
        raise ValueError("Invalid response from Groups API. May be wrong token.")


def get_user_full_name_and_email(expiring_token):
    """
    Fetches the full name and email of the logged in user, via the Feide UserInfo API.
    """
    json_object = perform_feide_api_call(expiring_token, "https://auth.dataporten.no/openid/userinfo")
    if "error" in json_object.keys():
        raise ValueError("Invalid token")
    return json_object["name"], json_object["email"]


def get_user_study_programme(expiring_token):
    """
    Fetches the study programme of the logged in user, via the Feide Groups API.
    """
    json_object = perform_feide_api_call(expiring_token, 'https://groups-api.dataporten.no/groups/me/groups')
    study_programmes = []

    if isinstance(json_object, dict) and "Unauthorized" in json_object["message"]:
        raise ValueError("Invalid expiring token")
    for obj in json_object:
        if "prg" in obj["type"]:
            study_programmes.append(obj["id"].split(":")[-1])
    if not study_programmes:
        raise ValueError("No study programme found for the given student.")
    return study_programmes[0]
