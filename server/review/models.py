from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from course.models import Course


# Create your models here.

class Review(models.Model):
    user_email = models.EmailField(max_length=254)
    course_code = models.ForeignKey(Course, on_delete=models.CASCADE)
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    workload = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    difficulty = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField()
    full_name = models.CharField(max_length=100)
    study_programme= models.CharField(max_length=10)




