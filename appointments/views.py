from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Appointment, Service
from django.core.mail import send_mail
from django.http import JsonResponse
from django.core.mail import EmailMessage
from users.models import Clients
import json
from datetime import datetime, timedelta

import requests
# Create your views here.

url = 'https://hook.eu2.make.com/y75uqqqe3jf6lsy6vhaow75t1iuyfkqs'


def get_availble_days():
    today = datetime.now().date()
    booking_window = 7
    available_days = []

    for i in range(booking_window):
        day = today + timedelta(days=i)

def booking_confirmed(appointment, mode='Booked'):
     message = f'''
        <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Appointment Confirmation</h2>
            <p>Dear {appointment.client},</p>

            <p>We are pleased to confirm your appointment. Below are the details:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Service:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;">{appointment.service.servicetype}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Date & Time:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;">{datetime.strptime(appointment.date, "%Y-%m-%d").strftime("%b %d, %Y")}{appointment.time.strftime(' at %I:%M %p')}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Status:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;">{appointment.status}</td>
                </tr>
            </table>

            <p>If you have any questions or need to reschedule, feel free to contact us at <a href="mailto:customerservice@marynassifchbat.com">customerservice@marynassifchbat.com</a>.</p>

            <p>Thank you for choosing our services. We look forward to serving you!</p>

            <p style="text-align: center; color: #888;">&copy; 2024 Beauty Clinic | All Rights Reserved</p>
        </div>
    </body>
</html>
'''     
     email = {'body': message, 'recipient': f'{appointment.client.email}', 'subject': 'Booking Confirmed'}
     requests.post(url, data=email)

@login_required
def bookings(request):

    if request.method == 'POST':
        user = request.user
        service_type = request.POST.get('service')
        service = get_object_or_404(Service, id=service_type)
        date_str = request.POST.get('date')
        time_str = request.POST.get('time')
        parsed_date = datetime.strptime(date_str, "%a, %d %b %Y")

        # Format as yyyy-mm-dd

        formatted_date = parsed_date.strftime("%Y-%m-%d")
        print(formatted_date)


        # Combine them into a single string

        try:
            date_obj = formatted_date
            time_obj = datetime.strptime(time_str, "%I:%M %p").time()
        except ValueError:
            return JsonResponse({'error': 'Invalid date or time format'}, status=400)
        # Parse the combined string into a datetime object
         # Create appointment
        appointment = Appointment.objects.create(
            client=user,
            service=service,
            date=date_obj,
            time=time_obj,
        )
        booking_confirmed(appointment)


        return render(request, 'dashboard/bookings/confirmation.html', {'appointment': appointment})

    services = Service.objects.all()

     # Generate allowed days (7 days ahead)
    today = datetime.today().date()
    allowed_days = [
        (today + timedelta(days=i)).strftime('%A, %d %b %Y')
        for i in range(7)
        if (today + timedelta(days=i)).strftime('%A') not in ['Monday', 'Wednesday', 'Sunday']
    ]

    # Prepare services data
    services_data = []
    for service in services:
        service_data = {'id': service.id, 'name': service.servicetype}
        services_data.append(service_data)

    return render(request, 'dashboard/bookings/bookings.html', {
        'services': services_data,
        'allowed_days': allowed_days,
    })




def get_available_times(request):
    if request.method == 'GET':
        service_id = request.GET.get('service_id')
        date_str = request.GET.get('date')
        parsed_date = datetime.strptime(date_str[:24], "%a %b %d %Y %H:%M:%S")
        formatted_date = parsed_date.strftime("%Y-%m-%d")

        try:
            service = get_object_or_404(Service, id=service_id)
            date = formatted_date
            print(date)


        except (ValueError, Service.DoesNotExist):
            return JsonResponse({'error': 'Invalid data provided'}, status=400)

        # Get already booked times for the service on the given date
        booked_times = Appointment.objects.filter(service=service, date=date).exclude(status='Cancelled').values_list('time', flat=True)

        # Define the time slots (e.g., 9:00 AM to 5:00 PM)
        all_times = [
            (datetime(2024, 1, 1, hour=h, minute=m).time())
            for h in range(9, 18)  # From 9 AM to 5 PM
            for m in range(0, 60, 60)  # 30-minute intervals
        ]

        # Filter available times
        available_times = [t.strftime('%I:%M %p') for t in all_times if t not in booked_times]

        return JsonResponse({'available_times': available_times})


def dashboard(request):
    appointment  = Appointment.objects.all().order_by('-date')
    service = Service.objects.all()
    clients = Clients.objects.all()
    from datetime import date
    today = date.today()


    return render(request, 'dashboard/dashboard.html',
                   {'appointments': appointment, 'services':service, 'clients': clients, 'today':today},)

@login_required
def admin_bookings(request, id):
    if request.method == 'POST':
        id = request.POST.get('id')
        print(id)
        user = Clients.objects.get(id=request.POST.get('id'))
        service_type = request.POST.get('service')
        service = get_object_or_404(Service, id=service_type)
        date_str = request.POST.get('date')
        time_str = request.POST.get('time')
        parsed_date = datetime.strptime(date_str, "%a, %d %b %Y")

        # Format as yyyy-mm-dd

        formatted_date = parsed_date.strftime("%Y-%m-%d")
        print(formatted_date)


        # Combine them into a single string

        try:
            date_obj = formatted_date
            time_obj = datetime.strptime(time_str, "%I:%M %p").time()
        except ValueError:
            return JsonResponse({'error': 'Invalid date or time format'}, status=400)
        # Parse the combined string into a datetime object
         # Create appointment
        appointment = Appointment.objects.create(
            client=user,
            service=service,
            date=date_obj,
            time=time_obj,
        )
        booking_confirmed(appointment)


        return dashboard(request)

    user = Clients.objects.get(id=id)
    context = {'client': user}
    context['services'] = Service.objects.all()
    return render(request, 'dashboard/admin_booking.html', context=context)


def add_service(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        servicetype = data.get('servicetype')
        price = data.get('price')

        Service.objects.create(servicetype=servicetype, price=price)

        return redirect('dashboard')


def delete_service(request, id):
    try:
        service = Service.objects.get(id=id)
        service.delete()
    except Service.DoesNotExist:
        pass

    return redirect('dashboard')

@login_required
def user_appointments(request):
    appointment = Appointment.objects.filter(client=request.user).order_by('-date', 'time')
    return render(request, 'appointment.html',{'appointments': appointment})


def cancel_appointment(request, id):
    appointment = Appointment.objects.get(id=id)
    appointment.status = 'Cancelled'
    appointment.save()
    message = f'''
<html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #FF4500; text-align: center;">Your Appointment Has been Cancelled</h2>
            <p>Dear {appointment.client},</p>

            <p>Your appointment has been successfully canceled. Below are the details of the canceled appointment:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Service:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;">{appointment.service.servicetype}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;"><strong>Date & Time:</strong></td>
                    <td style="padding: 10px; border: 1px solid #e0e0e0;">{appointment.date.strftime("%b %d, %Y")} {appointment.time.strftime(' at %I:%M %p')}</td>
                </tr>
            </table>

            <p>If you wish to book another appointment or have any questions, please feel free to contact us at <a href="mailto:support@beautyclinic.com">support@beautyclinic.com</a>.</p>

            <p>Thank you for letting us know, and we look forward to serving you in the future!</p>

            <p style="text-align: center; color: #888;">&copy; 2024 Beauty Clinic | All Rights Reserved</p>
        </div>
    </body>
</html>
'''
    email = {'body': message, 'recipient': f'{appointment.client.email}', 'subject': 'Cancelled Booking'}
    requests.post(url, data=email)
    if request.user.is_superuser:
        return redirect('dashboard')
    return redirect('appointment')


def update(request, id):
    """
    Update function to implement
    """
    if request.method == 'POST':
        date_str = request.POST.get('date')
        time_str = request.POST.get('time')
        parsed_date = datetime.strptime(date_str, "%a, %d %b %Y")
        formatted_date = parsed_date.strftime("%Y-%m-%d")

     
        time_obj = datetime.strptime(time_str, "%I:%M %p").time()
        
        apppointment = Appointment.objects.get(id=id)
        apppointment.date = formatted_date
        apppointment.status = request.POST.get('status')
        apppointment.time = time_obj
        apppointment.save()
        booking_confirmed(apppointment)
        return(dashboard(request))
    
    apppointment = Appointment.objects.get(id=id)
    service  = Service.objects.all()
    
    return render(request, 'dashboard/update.html', context={'appointment': apppointment, 'services': service})
