from django.db import models


class Course(models.Model):
    course_code = models.CharField(max_length=20, primary_key=True)
    course_name = models.CharField(max_length=200)
    credit = models.FloatField()
    average_grade = models.FloatField()