# Generated by Django 5.1.4 on 2024-12-27 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0003_appointment_date_alter_appointment_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Scheduled', 'Scheduled'), ('Cancelled', 'Cancelled')], default='Scheduled', max_length=50, null=True),
        ),
    ]