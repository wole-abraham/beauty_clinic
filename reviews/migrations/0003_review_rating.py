# Generated by Django 5.1.3 on 2024-12-04 00:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0002_rename_reviews_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='rating',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
