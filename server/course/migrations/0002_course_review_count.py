# Generated by Django 2.2.2 on 2020-10-22 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='review_count',
            field=models.IntegerField(default=0),
        ),
    ]