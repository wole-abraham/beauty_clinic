import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "beautyclinic.settings")
django.setup()

from users.models import Customer

with open('details.csv', mode='r', encoding='utf-8') as file:
    for line in file:
        first, phone = line.split(",")
        first, last = first.split() if len(first.split()) == 2 else first.split()[:2]
        Customer.objects.create(first_name = first, last_name = last, phone = phone)