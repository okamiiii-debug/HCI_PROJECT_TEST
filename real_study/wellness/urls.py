from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('mood/', views.mood_tracker, name='mood_tracker'),
    path('breathing/<int:mood_id>/', views.breathing, name='breathing'),
    path('therapist-booking/', views.therapist_booking, name='therapist_booking'),
    path('therapist-booking/<int:mood_id>/', views.therapist_booking, name='therapist_booking_from_mood'),
    path('add-reminder/', views.add_reminder, name='add_reminder'),
    path('delete-reminder/<int:reminder_id>/', views.delete_reminder, name='delete_reminder'),
]
