from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

# Create your views here.
@api_view(['POST'])
def post_review(request):
	# Hente fullt navn, studieprogram og alle fag fra gruppe-APIet (eller tilsvarende)
	# Validere at fagkoden er for et fag man allerede har tatt, og sjekke at reviewen ikke eksisterer fra før
	# Lagre review-objekt til databasen.
	# Returnere 200 hvis bra, 400 hvis ikke.
	print(json.loads(request.body))

	return Response({"test": "yes"})

