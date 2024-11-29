from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model

# Create your views here.

def landing(request):
    return render(request, 'new/landing.html')

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
        gender = request.POST.get('gender')
        phone_number = request.POST.get('phone_number')
        location = request.POST.get('location')
        password = request.POST.get('password1')
        email = request.POST.get('email')

        print(birth_date)


        user = get_user_model()
        user = user.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            birth_date = birth_date,
            password=password,
            location=location,
            username=username,
            gender=gender,
            phone_number=phone_number

        )
        return redirect('bookings')

    return render(request, 'signup.html')