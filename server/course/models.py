from django.db import models


class Course(models.Model):
    course_code = models.CharField(max_length=20, primary_key=True)
    course_name = models.CharField(max_length=200)
    credit = models.FloatField()
    average_grade = models.FloatField()
    pass_rate = models.FloatField()
    review_count = models.IntegerField(default=0)

    @classmethod
    def create(cls, code, name, credit, average_grade, pass_rate):
        course = cls(course_code=code, course_name=name, credit=credit, average_grade=average_grade,
                     pass_rate=pass_rate)
        return course
