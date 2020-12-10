from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import requests
from course.views import retrieve_courses_from_token, get_current_semester, perform_feide_api_call
from auth.models import UserAuth
from .models import Review
from course.models import Course
from user.models import AdminUser, BannedUser
from django.db.models import Avg


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

    # Check if user is banned from posting reviews
    if BannedUser.objects.filter(user_email=email).exists():
        return Response("User is banned from posting reviews", status=401)

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

    # Update the review counter in Course
    course_qs = Course.objects.filter(course_code=request_data["courseCode"])
    review_qs = Review.objects.filter(course_code=request_data["courseCode"])
    course_qs.update(review_count=review_qs.count())

    # Update the average review score in Course
    course_qs.update(average_review_score=review_qs.aggregate(Avg("score"))["score__avg"])

    # Update the average difficulty in Course
    if request_data["difficulty"] > -1:
        course_qs.update(average_difficulty=review_qs.aggregate(Avg("difficulty"))["difficulty__avg"])

    # Update the average workload in Course
    if request_data["workload"] > -1:
        course_qs.update(average_workload=review_qs.aggregate(Avg("workload"))["workload__avg"])

    # Indicate successful posting
    return Response(status=200)


@api_view(["GET"])
def get_reviews(request):
    try:
        data = get_reviews_from_db(request)
    except ValueError as e:
        return Response(str(e), status=400)
    except KeyError as e:
        return Response(str(e), status=401)
    return Response(data, status=200)


@api_view(["GET"])
def can_review(request):
    """
    Checks whether a user can review a given course or not. Returns a 200 response with the following numbers
    if the request is valid:

    0: User can review
    1: User cannot review because it has not taken the course
    2: User cannot review because it has already reviewed the course
    3: User cannot review because its expiring token does not exist.
    4: User cannot review because it is banned from reviewing
    """
    # Check if expiring token is stored in db
    exp_token = request.META["HTTP_AUTHORIZATION"]
    if not UserAuth.objects.filter(expiring_token=exp_token).exists():
        return Response(3)
    user_email = UserAuth.objects.filter(expiring_token=exp_token)[0].user_email

    # Check if user is banned from posting reviews
    if BannedUser.objects.filter(user_email=user_email).exists():
        return Response(4)

    # Check if user has had the course
    course_code = request.GET.get("courseCode", None)
    if course_code is None:
        return Response("No course code provided", status=400)
    elif not Course.objects.filter(course_code=course_code).exists():
        return Response("Course code {} does not exist in the course database.".format(course_code), status=400)

    try:
        reviewable_courses = get_reviewable_courses(exp_token)
    except ValueError:
        return Response("Invalid FEIDE token", status=401)

    if course_code not in reviewable_courses:
        return Response(1)

    # Check if review exists
    if Review.objects.filter(course_code=course_code, user_email=user_email).exists():
        return Response(2)

    # User can review, so 0 is returned
    return Response(0)


def get_reviews_from_db(request):
    """
    Helper method for fetching all reviews for a given course code.

    :param request: GET request containing a course code parameter, and optional parameters n (number of reviews)
                    and offset (index to start the fetching at).
    :raises ValueError: if course code, n or offset is invalid.
    :return: JSON containing total number of reviews in database (count), and list of JSON objects (data),
                each containing a review.
    """
    try:
        exp_token = request.META["HTTP_AUTHORIZATION"]
    except KeyError:
        raise KeyError("No expiring token provided")

    # Get and validate course_code parameter
    course_code = get_course_code_parameter(request)

    # Get and validate show_my_programme parameter
    show_my_programme = request.GET.get("showMyProgramme", "false")
    if show_my_programme not in ["true", "false"]:
        raise ValueError("Illegal boolean value")
    show_my_programme = show_my_programme == "true"

    # Define a base queryset, which is used for all queries later in the method
    base_qs = Review.objects.filter(course_code=course_code)
    if show_my_programme:
        base_qs = base_qs.filter(study_programme=get_user_study_programme(exp_token))

    # Get and validate n parameter
    number_of_reviews = base_qs.count()
    n = request.GET.get("n", number_of_reviews)
    if isinstance(n, str) and not n.isdigit():
        raise ValueError("Invalid value for n: {}".format(n))
    n = int(n)

    # Get and validate offset parameter
    offset = request.GET.get("offset", 0)
    if isinstance(offset, str) and not offset.isdigit():
        raise ValueError("Invalid value for offset: {}".format(offset))
    offset = int(offset)
    if offset > number_of_reviews:
        raise ValueError("offset is too large")

    # Get total average review scores for course
    average_score = base_qs.aggregate(Avg("score"))["score__avg"]
    average_workload = base_qs.filter(workload__gt=-1).aggregate(Avg("workload"))["workload__avg"]
    average_difficulty = base_qs.filter(difficulty__gt=-1).aggregate(Avg("difficulty"))["difficulty__avg"]

    # Fetch reviews from database
    data = list(base_qs.order_by("-date")[offset:offset + n].values())

    # Append if user can delete review to the list of reviews
    _, user_email = get_user_full_name_and_email(exp_token)

    # Check if user is admin
    is_admin = check_if_is_admin(user_email)

    # Append if user can delete review to the list of reviews
    for review in data:
        review["can_delete"] = check_if_can_delete(review, user_email, is_admin)

    # Remove user email field from reviews
    for review in data:
        review.pop("user_email", None)

    # Return the data
    return {"count": number_of_reviews, "data": data, "average_score": average_score,
            "average_workload": average_workload, "average_difficulty": average_difficulty, "is_admin": is_admin}


def get_course_code_parameter(request):
    """
    Helper method for extracting and validation the courseCode parameter from a request.
    """
    course_code = request.GET.get("courseCode", None)
    if course_code is None:
        raise ValueError("No course code provided")
    elif not Course.objects.filter(course_code=course_code).exists():
        raise ValueError("Course code {} does not exist in the course database.".format(course_code))
    return course_code


def check_if_is_admin(user_email):
    """
    Checks if the currently logged in user is an admin (based on the AdminUser table).
    :param user_email: str, Email of the logged in user.
    :return: bool, Whether the user is an admin.
    """
    return AdminUser.objects.filter(user_email=user_email).exists()


def check_if_can_delete(review, user_email, is_admin):
    """
    Checks if the user can delete a given review.

    :param review: dict, Dictionary representation of a Review instance.
    :param user_email: str, The currently logged in user's email.
    :param is_admin: bool, If the user is an admin
    :return: bool, Whether the user can delete a review or not.
    """
    return is_admin or review["user_email"] == user_email


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
    if score_is_invalid(request_data["score"]):
        raise ValueError("Invalid score: {} (Must be between 1 and 5)".format(request_data["score"]))
    if otherparams_is_invalid(request_data["difficulty"]):
        raise ValueError("Invalid difficulty: {} (Must be between -1 and 2)".format(request_data["difficulty"]))
    if otherparams_is_invalid(request_data["workload"]):
        raise ValueError("Invalid workload: {} (Must be between -1 and 2)".format(request_data["workload"]))


def score_is_invalid(score):
    return not isinstance(score, int) or score < 1 or score > 5


def otherparams_is_invalid(param):
    return not isinstance(param, int) or param < -1 or param > 2


def get_reviewable_courses(exp_token):
    """
    Gets a list of course codes for the courses that the user can review (i.e. courses that have been taken or
    are being taken this semester).

    The mapping maps from course object to course code.
    """
    try:
        return list(map(lambda filtered_ci: filtered_ci["course_code"], retrieve_courses_from_token(exp_token)))
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


@api_view(["DELETE"])
def delete_review(request):
    """
    Deletes a given review, based on review id passed as parameter.
    """
    # Get and authenticate expiring token
    try:
        exp_token = request.META["HTTP_AUTHORIZATION"]
    except KeyError:
        return Response("No expiring token provided", 401)
    if not UserAuth.objects.filter(expiring_token=exp_token).exists():
        return Response("Invalid expiring token provided", 401)

    # Get and validate review id parameter
    review_id = request.GET.get("reviewId", None)
    if review_id is None or review_id == "undefined":
        return Response("No review id provided", status=400)
    if not Review.objects.filter(id=review_id).exists():
        return Response("Review does not exist", status=400)

    # Get review from database and extract relevant fields
    review = Review.objects.get(id=review_id)
    passed_email = review.user_email
    course_code = review.course_code


    # Check if user can delete review
    try:
        _, user_email = get_user_full_name_and_email(exp_token)
    except ValueError as e:
        return Response(str(e), status=400)

    is_admin = check_if_is_admin(user_email)
    if not (is_admin or user_email == passed_email):
        return Response("User cannot delete this review", status=401)

    # Delete review
    review.delete()

    # Update course review data
    course_qs = Course.objects.filter(course_code=course_code)
    review_qs = Review.objects.filter(course_code=course_code)

    course_qs.update(review_count=review_qs.count())
    course_qs.update(average_review_score=get_avg_or_default(review_qs, "score"))
    course_qs.update(average_difficulty=get_avg_or_default(review_qs.filter(difficulty__gt=-1), "difficulty", -1))
    course_qs.update(average_workload=get_avg_or_default(review_qs.filter(workload__gt=-1), "workload", -1))

    # Return 200 if successful
    return Response("Review successfully deleted.", status=200)


def get_avg_or_default(queryset, field, default=0):
    """
    Helper method for getting the average of a field in a QuerySet,
    or a default value if it is None.
    """
    result = queryset.aggregate(Avg(field))["{}__avg".format(field)]
    return default if result is None else result
