# Generated by Django 2.2.2 on 2020-10-22 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_course_review_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='average_review_score',
            field=models.FloatField(default=0),
        ),
    ]