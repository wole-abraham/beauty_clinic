from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Appointment, Service
from django.core.mail import send_mail
from django.http import JsonResponse
from django.core.mail import EmailMessage
import json
from datetime import datetime
# Create your views here.


@login_required
def bookings(request):

    if request.method == 'POST':
        user = request.user
        service = request.POST.get('service')
        service = Service.objects.get(servicetype=service)
        # Date and time as strings
        date_str = request.POST.get('date')
        time_str = request.POST.get('time')

        # Combine them into a single string
        combined_str = f"{date_str} {time_str}"

        # Parse the combined string into a datetime object
        final_datetime = datetime.strptime(combined_str, "%Y-%m-%d %H:%M")

        appointment = Appointment.objects.create(
            client = user,
            service = service,
            time = final_datetime
        )
        message = f'''
    <html>
        <body>
            <p>Hello {appointment.client.first_name} {appointment.client.last_name},</p>
            <p><strong>Confirmed:</strong> Your Appointment Has Been Booked</p>
            <p><strong>Date:</strong>  {appointment.time.strftime('%d-%m-%Y %H:%M')}</p>
        </body>
    </html>
'''

        email = EmailMessage(
            body= message,
            to=[f'{request.user.email}'],
            subject='Booking Confirmed',
            from_email='testprojectmail75@gmail.com',
    
        )

        email.content_subtype = "html"  # Set the email content type to HTML
        email.send()
        return render(request, 'dashboard/bookings/confirmation.html', {'appointment': appointment})

    services = Service.objects.all()

    return render(request, 'dashboard/bookings/bookings.html', {'services': services})
7





def dashboard(request):
    appointment  = Appointment.objects.all()
    service = Service.objects.all()

    return render(request, 'dashboard/dashboard.html',
                   {'appointments': appointment, 'services':service})


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


