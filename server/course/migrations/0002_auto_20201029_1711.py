# Generated by Django 2.2.2 on 2020-10-29 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='average_difficulty',
            field=models.FloatField(default=-1),
        ),
        migrations.AddField(
            model_name='course',
            name='average_workload',
            field=models.FloatField(default=-1),
        ),
    ]