"""
URL configuration for beautyclinic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users import views
from reviews import views as re_view
from appointments import views as ap_views
from django.views.generic import RedirectView
from django.views.generic import TemplateView
urlpatterns = [
    path('admin/', admin.site.urls),
    path("robots.txt/", TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('', views.landing, name='landing'),
    # path('user/', include())
    path('login/', views.login_view, name='login'),
    path('about/', views.about, name='about'),
    path('review/', include('reviews.urls')),
    path('signup/', views.signup, name='signup'),
    path('bookings/', ap_views.bookings, name='bookings'),
    path('admin-booking/<int:id>/', ap_views.admin_bookings, name='admin-booking'),
    path('secretary/', ap_views.dashboard, name='dashboard'),
    path('add-service/', ap_views.add_service, name='add-service'),
    path('delete-service/<int:id>/', ap_views.delete_service, name='delete-service'),
    path('api/clients/', views.clients_list, name='clients-list'),
    path('api/appointments/', views.appointments_list, name='appointments-list'),
    path('api/services/', views.services_list, name='services-list'),
    path('states/<str:country>', views.get_states),
    path('countries/', views.get_countries),
    path('reviews/', views.reviews, name='reviews'),
    path('dashboard/update/<int:id>', ap_views.update, name='update'),
    path('get-available-times/', ap_views.get_available_times, name='get_available_times'),
    path('appointments/', ap_views.user_appointments,name='appointments'),
    path('cancel_appointment/<int:id>', ap_views.cancel_appointment, name='cancel_appointment'),
    path('registeruser/', ap_views.register_user, name='register_user'),
    path('favicon.ico/', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),



]
