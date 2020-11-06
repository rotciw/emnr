from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["DELETE"])
def delete_user(request):
    return Response()
