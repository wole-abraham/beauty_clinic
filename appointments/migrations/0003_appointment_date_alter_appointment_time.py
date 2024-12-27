# Generated by Django 5.1.3 on 2024-12-10 13:06

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("appointments", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="date",
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="appointment",
            name="time",
            field=models.TimeField(),
        ),
    ]