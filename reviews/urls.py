from django.urls import path
from . import views



urlpatterns = [
    path('', views.review, name='review'),

]