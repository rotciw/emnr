from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Review(models.Model):
    user_email = models.EmailField(max_length=254, blank=False)
    course_code = models.CharField(max_length=20, blank=False)
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], blank=False)
    workload = models.IntegerField(validators=[MinValueValidator(-1), MaxValueValidator(2)], blank=False)
    difficulty = models.IntegerField(validators=[MinValueValidator(-1), MaxValueValidator(2)], blank=False)
    review_text = models.TextField()
    full_name = models.CharField(max_length=100, blank=False)
    study_programme = models.CharField(max_length=20, blank=False)
    date = models.DateTimeField(auto_now_add=True)