from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
import json
from .models import Course
from auth.views import get_token
import requests
import json
import time
from review.models import Review
from auth.models import UserAuth


# Create your views here.
def health(request):
    return HttpResponse("OK")


@api_view(['GET'])
def get_all_courses(request):
    try:
        data = get_courses_from_db(request)
    except ValueError as e:
        return Response(str(e), status=400)
    return Response(data)


def get_courses_from_db(request):
    """
    Helper method for fetching an arbitrary sequence of courses from the database.
    :param request: GET request containing optional parameters n (number of courses to fetch), offset (index to
                    start the fetching at) and search (filters courses on whether code or name contains the search
                    input).
    :raises: ValueError if n or offset is invalid.
    :return: JSON containing total number of courses in database (count), and list of JSON objects (data),
                each containing course information.
    """
    # Get search parameter and combines the fields "course_code" and "course_name" into an OR field,
    # by making a Q object.
    search = request.GET.get("search", "")
    combined_search_filter = Q(course_code__icontains=search) | Q(course_name__icontains=search)

    # Get and validate n parameter
    number_of_courses = Course.objects.filter(combined_search_filter).count()
    n = request.GET.get("n", number_of_courses)
    if isinstance(n, str) and not n.isdigit():
        raise ValueError("Invalid value for n: {}".format(n))
    n = int(n)

    # Get and validate offset parameter
    offset = request.GET.get("offset", 0)
    if isinstance(offset, str) and not offset.isdigit():
        raise ValueError("Invalid value for offset: {}".format(offset))
    offset = int(offset)
    if offset > number_of_courses:
        raise ValueError("offset is too large")

    # Sorts either on an advanced sorting with weighting of different parameters, or one sorting attribute
    advanced_sorting = request.GET.get("advanced_sorting", "false")
    if advanced_sorting not in ["true", "false"]:
        raise ValueError("Invalid value for advanced_sorting: {}".format(advanced_sorting))

    # Use advanced sorting. This overrides if the order_by parameter is also set.
    if advanced_sorting == "true":
        params = get_advanced_sorting_parameters(request)  # Dictionary mapping parameters to their values
        # Used to weight accurately between the values, e.g. pass_rate ranges from 0 - 100, workload from 0 - 2.
        max_values = {"score": 5, "difficulty": 2, "workload": 2, "pass_rate": 100, "grade": 5}
        # Takes every course object, calculates a sorting_score, and adds it to the object.
        data = list(map(lambda course: map_course_to_sorting_score(course, params, max_values),
                        Course.objects.filter(combined_search_filter).values()))
        # Sorts in reverse as default, largest score first.
        data.sort(key=lambda course: course["advanced_sorting_score"], reverse=True)
        data = data[offset:offset + n]
    # Use normal sorting. Set to "course_name" if not set.
    else:
        # Get and validate order_by and ascending parameters
        order_by = request.GET.get("order_by", "course_name")
        valid_order_parameters = ["course_code", "course_name", "credit", "average_grade", "review_count", "pass_rate",
                                  "average_review_score"]
        if order_by not in valid_order_parameters:
            raise ValueError(
                "Invalid value for order_by: {}. Valid  values: {}".format(order_by, valid_order_parameters))
        ascending = request.GET.get("ascending", "1")
        if ascending not in ["0", "1"]:
            raise ValueError("Invalid value for ascending: {}".format(ascending))
        if ascending == "0":
            order_by = "-" + order_by
        # Fetch data from database
        data = list(Course.objects.filter(combined_search_filter).order_by(order_by)[offset:offset + n].values())
    return {"count": number_of_courses, "data": data}


def get_advanced_sorting_parameters(request):
    """
    Helper method to get hold of the parameters for advanced sorting. Sets default values for parameters not in the
    request.
    Parameters it looks for in the request:
    score_high: boolean - sort from high to low
    score_weight: number from 0 to 5
    difficulty_high: boolean - sort from high to low
    difficulty_weight: number from 0 to 5
    workload_high: boolean - sort from high to low
    workload_weight: number from 0 to 5
    pass_rate_high: boolean - sort from high to low
    pass_rate_weight: number from 0 to 5
    grade_high: boolean - sort from high to low
    grade_weight: number from 0 to 5
    :param request: GET request containing optional parameters listed above.
    :raises: ValueError if boolean values are not "true" or "false", and if the weight is string integer from 0 - 5.
    :return: dictionary, parameters as keys, value being sorting direction and weight as a list
    """
    param_dict = {}
    parameters = ["score", "difficulty", "workload", "pass_rate", "grade"]
    for param in parameters:
        # Sets default values
        high = request.GET.get(param+"_high", "true")
        weight = request.GET.get(param+"_weight", "0")
        # Validation
        if high in ["true", "false"]:
            high = True if high == "true" else False
        else:
            raise ValueError("Invalid value for {}_high: {}".format(param, high))
        if weight in ["0", "1", "2", "3", "4", "5"]:
            weight = int(weight)
        else:
            raise ValueError("Invalid value for {}_weight: {}".format(param, weight))
        param_dict[param] = [high, weight]
    return param_dict


def map_course_to_sorting_score(course, params, max_values):
    """
    Helper method to calculate and add a sorting score to it.
    :param course:
    :param params:
    :param max_values:
    :return: A single course object
    """
    sorting_score = 0
    param_names = {"score": "average_review_score", "difficulty": "average_difficulty", "workload": "average_workload",
                   "pass_rate": "pass_rate", "grade": "average_grade"}
    for param, values in params.items():  # Review score can possibly create problems here, since it defaults to 0
        temp = course[param_names[param]] / max_values[param]
        # Subjects with temp < 0 has a default value of -1. The param is then irrelevant, set to mid-value.
        if temp < 0:
            temp = 0.5  # If no reviews exist, the parameter gets a neutral value
        # Subjects with score 0 has no reviews yet. Score is then irrelevant, and set to mid-value.
        elif temp == 0 and param == "score":
            temp = 0.5
        # Subjects with grade 0 are pass / fail-subjects. Grade is irrelevant, and set to mid-value.
        elif temp == 0 and param == "grade":
            temp = 0.5
        elif temp == -1 and param == "pass_rate":
            temp = 0.5
        if not values[0]:
            temp = 1 - temp
        sorting_score += temp * values[1]
    course["advanced_sorting_score"] = sorting_score
    return course


@api_view(['GET'])
def get_course(request):
    try:
        data = get_single_course_from_db(request)
    except ValueError as e:
        return Response(str(e), status=400)
    return Response(data)


def get_single_course_from_db(request):
    """
    Helper method for fetching a single course from the database.
    :param request: GET request containing mandatory parameter code (course code)
    :raises: ValueError if code is None, or not corresponding to a course in the database
    :return: A single JSON object, containing the course data.
    """
    code = request.GET.get("code", None)
    if code is None:
        raise ValueError("No code provided")
    if not Course.objects.filter(course_code=code).exists():
        raise ValueError("Course does not exist in database")
    return Course.objects.filter(course_code=code).values()[0]


@api_view(["GET"])
def get_current_user_courses(request):
    try:
        course_info = retrieve_courses_from_token(request.META['HTTP_AUTHORIZATION'])
        course_info = add_review_info_to_my_courses(course_info, request.META['HTTP_AUTHORIZATION'])
        return HttpResponse(json.dumps(course_info))
    except TypeError as e:
        return Response("Invalid expiring token", status=401)


def add_review_info_to_my_courses(course_info, expiring_token):
    user_email = UserAuth.objects.get(expiring_token=expiring_token).user_email
    for course_dict in course_info:
        if Review.objects.filter(course_code=course_dict["course_code"], user_email=user_email).exists():
            course_dict["has_reviewed"] = True
            course_dict["my_review_score"] = Review.objects.get(course_code=course_dict["course_code"],
                                                                user_email=user_email).score
        else:
            course_dict["has_reviewed"] = False
            course_dict["my_review_score"] = -1
    return course_info


def retrieve_courses_from_token(token):
    """
    Helper method for getting the list of courses that the current user has taken (based on the frontend token).
    """
    json_object = perform_feide_api_call(token, 'https://groups-api.dataporten.no/groups/me/groups')
    course_info = []
    for obj in json_object:
        parsed_obj = parse_course_object(obj)
        if parsed_obj is not None:
            course_info.append(parsed_obj)
    return course_info


def parse_course_object(obj):
    """
    Helper method for parsing a JSON containing course information from the Feide Groups API
    into a dictionary containing course code and semester.
    """
    if 'emne' not in obj['type'].split(':'):
        return None

    # Get course code
    course_code = obj["id"].split(":")[-2]

    # Get semester
    if 'notAfter' in obj['membership']:
        # Course has already been taken
        semester = ""
        notAfter_split = (obj['membership']['notAfter']).split('-')
        if notAfter_split[1] == "08":
            semester += "V"
        elif notAfter_split[1] == "12":
            semester += "H"
        else:
            raise ValueError("Unknown semester end month: {}".format(notAfter_split[1]))
        semester += notAfter_split[0]
    else:
        semester = get_current_semester()

    # Get course name from Course table
    course_name = Course.objects.filter(course_code=course_code)[0].course_name

    return {"course_code": course_code, "course_name": course_name, "semester": semester}


def perform_feide_api_call(expiring_token, api_url):
    """
    Performs a get request to a given API that requires the current user's Feide Access token
    (like the Groups API or the UserInfo API).
    Returns a dictionary representation of the JSON data returned from the API call.
    """
    access_token = get_token(expiring_token)
    session = requests.Session()
    session.headers.update({'authorization': 'bearer {}'.format(access_token)})

    api_request = requests.get(
        api_url, headers={
            'content-type': 'application/json; charset=utf-8',
            'authorization': 'Bearer {}'.format(access_token),
        }
    )
    return api_request.json()


def get_current_semester():
    """
    Helper method for creating a string representing the current semester.

    E.g. if we are in september 2018, it will return H2018 (H for Høst/Autumn).
    """
    semester = ""
    if int(time.strftime("%m")) < 8:
        semester += "V"
    else:
        semester += "H"
    semester += time.strftime("%Y")
    return semester


def get_grade_info_from_grades_api(course_code):
    """
    Gets the grade distribution from the previous ordinary exam for the given course
    (through calling the grades.no API).

    :param course_code: string, Code for the course to get info from
    :return: dict on the form {course_code=..., godkjent_rate=..., a_rate=..., b_rate=..., ...., f_rate=...}.
                If godkjent_rate is -1, the previous ordinary exam was graded with letter grades,
                otherwise the previous ordinary exam was pass/fail.
    """
    # Get data from grades API
    course_response = requests.get("https://grades.no/api/v2/courses/{}/grades/".format(course_code))
    course_response.encoding = "utf-8"
    course_grades = course_response.json()

    # Validate that response is not empty
    if not course_grades:
        raise ValueError("No course exam info provided from API")

    # Sort the semester grade info on year, to extract last ordinary semester
    course_grades.sort(key=lambda c: c.get("year"), reverse=True)
    previous_ordinary_exam = None

    # Find last ordinary grade results
    for exam_results in course_grades:
        if exam_results["semester"] != "SUMMER":
            previous_ordinary_exam = exam_results
            break
    if previous_ordinary_exam is None:
        raise ValueError("No ordinary exams found")

    # Check if last ordinary grades were letter grades or pass/fail
    no_letters = previous_ordinary_exam["passed"] != 0

    # Set all letters to -1 if the course was pass/fail
    if no_letters:
        info = create_gradeinfo_dict(course_id=course_code, semester=previous_ordinary_exam["semester_code"],
                                     godkjent_rate=previous_ordinary_exam["passed"] / previous_ordinary_exam[
                                         "attendee_count"],
                                     f_rate=previous_ordinary_exam["f"] / previous_ordinary_exam["attendee_count"])
    # Else, set godkjent_rate to -1
    else:
        info = create_gradeinfo_dict(course_id=course_code, semester=previous_ordinary_exam["semester_code"],
                                     a_rate=previous_ordinary_exam["a"] / previous_ordinary_exam["attendee_count"],
                                     b_rate=previous_ordinary_exam["b"] / previous_ordinary_exam["attendee_count"],
                                     c_rate=previous_ordinary_exam["c"] / previous_ordinary_exam["attendee_count"],
                                     d_rate=previous_ordinary_exam["d"] / previous_ordinary_exam["attendee_count"],
                                     e_rate=previous_ordinary_exam["e"] / previous_ordinary_exam["attendee_count"],
                                     f_rate=previous_ordinary_exam["f"] / previous_ordinary_exam["attendee_count"])
    return info


def create_gradeinfo_dict(course_id, semester, godkjent_rate=-1, a_rate=-1, b_rate=-1, c_rate=-1, d_rate=-1, e_rate=-1,
                          f_rate=-1):
    return {
        "course_id": course_id, "godkjent_rate": godkjent_rate,
        "a_rate": a_rate, "b_rate": b_rate, "c_rate": c_rate, "d_rate": d_rate, "e_rate": e_rate,
        "f_rate": f_rate, "semester": semester
    }


@api_view(["GET"])
def get_grade_info(request):
    """
    Returns the grade distribution for the last ordinary exam for a course,
    as provided by the grades.no API.

    :param request: GET request containing the parameter "courseCode"
    :return: JSON object with grade info for the given course.
    """
    course_code = request.GET.get("courseCode", None)

    # Validate course code
    if course_code is None:
        return Response("Course code not provided", status=400)
    if not Course.objects.filter(course_code=course_code).exists():
        return Response("Course code does not exist in the database", status=400)

    # Get grade data from the grades API
    try:
        data = get_grade_info_from_grades_api(course_code)
    except ValueError as e:
        return Response(str(e), status=400)

    # Return grade data
    return Response(data)
