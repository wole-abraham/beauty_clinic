from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, get_user_model
from reviews.models import Review
from django.core.mail import EmailMessage
from .models import Location
from .models import Clients
import json
from appointments.models import Appointment, Service
from twilio.rest import Client
import os

# Create your views here.
current_dir = os.path.dirname(__file__)

    # Construct the full path to the JSON file
json_file_path = os.path.join(current_dir, 'states.json')
with open(json_file_path, mode='r', encoding='utf-8') as file:
    countries = json.load(file)



def landing(request):
    review = Review.objects.order_by('-date')
    return render(request, 'new/landing.html', {'request': request, 'reviews': review}  )

def about(request):
    return render(request, 'new/about.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('bookings')
        else:
            return render(request, 'login.html', {"error": "Invalid email or password"})
    return render(request, 'login.html')


def signup(request):
    """
        cerate user view 
        using sign up 
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        birth_date = request.POST.get('age')
        phone_number = request.POST.get('phone_number')
        country = request.POST.get('country_name')
        state = request.POST.get('state_name')
        password = request.POST.get('password1')
        email = request.POST.get('email')
        gender = request.POST.get('gender')


        user = get_user_model()
        try:
            user = user.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            birth_date = birth_date,
            gender=gender,
            password=password,
            country = country,
            state = state,
            username=username,
            phone_number=phone_number,
        

        )
            
            message = f'''
                <html>
                    <head>
                        <style>
                            body {{
                                font-family: Arial, sans-serif;
                                background-color: #f9f9f9;
                                color: #333;
                                margin: 0;
                                padding: 0;
                            }}
                            .container {{
                                max-width: 600px;
                                margin: 20px auto;
                                background: #fff;
                                padding: 20px;
                                border-radius: 10px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            }}
                            .header {{
                                text-align: center;
                            }}
                            .header img {{
                                max-width: 150px;
                                margin-bottom: 20px;
                            }}
                            .content {{
                                line-height: 1.6;
                            }}
                            .footer {{
                                text-align: center;
                                font-size: 12px;
                                color: #888;
                                margin-top: 20px;
                            }}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://i.ibb.co/4VJdTrJ/logo.png" alt="Clinic Logo">
                                <h1>Welcome to Mary Nassif Chbat Beauty Clinic</h1>
                            </div>
                            <div class="content">
                                <p>Dear {user.first_name},</p>
                                <p>Thank you for choosing Mary Nassif Chbat Beauty Clinic. We are delighted to have you join our family of valued clients. Your journey to unparalleled beauty and wellness begins here!</p>
                                <p>Our team of professionals is committed to providing you with the best services tailored to your needs.</p>
                                <p>For any inquiries or to explore our offerings, feel free to contact us anytime.</p>
                            </div>
                            <div class="footer">
                                <p><strong>Contact Us:</strong></p>
                                <p>Email: contact@beautyclinic.com | Phone: +961 1 895 168 </p>
                                <p>Follow us on social media: <a href="https://web.facebook.com/marynassifchbat">Facebook</a> | <a href="https://www.instagram.com/marynassifchbat/">Instagram</a></p>
                            </div>
                        </div>
                    </body>
                </html>
                '''


            email = EmailMessage(
                body= message,
                to=[f'{user.email}'],
                subject='Account Created',
                from_email='testprojectmail75@gmail.com',
        
            )

            email.content_subtype = "html"  # Set the email content type to HTML
            email.send()
            
        except Exception as e:
            return render(request, 'signup.html', {'error': 'error'})


        return redirect('bookings')

    return render(request, 'signup.html')



def user_location(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            region = data.get("region")
        except Exception as e:
            pass


def clients_list(request):
    """API to retrieve all clients."""
    clients = Clients.objects.values(
        "id", "first_name", "last_name", "email", "phone_number", "country", "state", "gender", "birth_date"
    )
    return JsonResponse(list(clients), safe=False)


def appointments_list(request):
    """API to retrieve all appointments."""
    appointments = Appointment.objects.values(
        "id", 
        "client__id", 
        "client__first_name", 
        "client__last_name", 
        "service__id", 
        "service__servicetype", 
        "time", 
        "status"
    )
    return JsonResponse(list(appointments), safe=False)


def services_list(request):
    """API to retrieve all services."""
    services = Service.objects.values("id", "servicetype", "price")
    return JsonResponse(list(services), safe=False)

def get_states(request, country):
    for countrys in countries:
        if countrys.get('name') == country:
            return JsonResponse(countrys.get('states'), safe=False)
        
def get_countries(request):
    return JsonResponse(countries, safe=False)
