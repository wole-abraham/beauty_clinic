from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Appointment, Service
from django.core.mail import send_mail
# Create your views here.


@login_required
def bookings(request):

    if request.method == 'POST':
        user = request.user
        service = request.POST.get('service')
        service = Service.objects.get(name='Manicure')
        time =  request.POST.get('date')

        appointment = Appointment.objects.create(
            user = user,
            service = service,
            time = time
        )

        send_mail(
            message= 'Your Appointment Has been booked',
            recipient_list=[f'{request.user.email}'],
            subject='Booking Confirmed',
            from_email='testprojectmail75@gmail.com',
            fail_silently=False,
    
        )
        return render(request, 'bookings/confirmation.html', {'appointment': appointment})

    
    return render(request, 'bookings/bookings.html')
7



def dashboard(request):
    appointment  = Appointment.objects.all()

    return render(request, 'dashboard/dashboard.html',
                   {'appointments': appointment})