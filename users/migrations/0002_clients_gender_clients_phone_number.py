# Generated by Django 5.1.3 on 2024-11-29 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='clients',
            name='gender',
            field=models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], default='Female', max_length=50),
        ),
        migrations.AddField(
            model_name='clients',
            name='phone_number',
            field=models.CharField(default='+961', max_length=15),
            preserve_default=False,
        ),
    ]