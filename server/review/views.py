from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['POST'])
def post_reviews(request):
	try:
		data = get_courses_from_db(request)
	except ValueError as e:
		return Response(str(e), status=400)
	return Response(data)


def validate_and_save_review(request):

