# Generated by Django 2.2.2 on 2020-10-31 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_auto_20201029_1711'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='advanced_sorting_score',
            field=models.FloatField(default=-1),
        ),
    ]
