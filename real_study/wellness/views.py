from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.contrib import messages
from datetime import datetime, timedelta
import json

from .models import Reminder, MoodEntry, TherapistBooking
from .forms import ReminderForm, MoodForm, TherapistBookingForm

def dashboard(request):
    today = timezone.now().date()
    
    # Get reminders
    reminders = Reminder.objects.all().order_by('date')
    upcoming_reminders = reminders.filter(date__gte=timezone.now())
    
    # Get recent mood entry
    recent_mood = MoodEntry.objects.order_by('-created_at').first()
    
    # Create context for calendar showing the next 30 days
    calendar_days = []
    start_date = today
    for i in range(30):
        current_date = start_date + timedelta(days=i)
        day_reminders = reminders.filter(date__date=current_date)
        calendar_days.append({
            'date': current_date,
            'reminders': day_reminders,
            'has_reminders': day_reminders.exists()
        })
    
    context = {
        'today': today,
        'reminders': reminders,
        'upcoming_reminders': upcoming_reminders,
        'calendar_days': calendar_days,
        'recent_mood': recent_mood,
        'reminder_form': ReminderForm(),
        'mood_form': MoodForm(),
    }
    return render(request, 'wellness/dashboard.html', context)

def mood_tracker(request):
    if request.method == 'POST':
        form = MoodForm(request.POST)
        if form.is_valid():
            mood_entry = form.save()
            
            # Different response based on mood
            if mood_entry.mood == 'happy':
                # Redirect to dashboard with message
                messages.success(request, "Hey well done! Remember to take things slow—you got this.")
                return redirect('dashboard')
            else:
                # Redirect to breathing session
                return redirect('breathing', mood_id=mood_entry.id)
    else:
        form = MoodForm()
    
    return render(request, 'wellness/mood_tracker.html', {'form': form})

def breathing(request, mood_id):
    try:
        mood_entry = MoodEntry.objects.get(id=mood_id)
        return render(request, 'wellness/breathing.html', {'mood_entry': mood_entry})
    except MoodEntry.DoesNotExist:
        messages.error(request, "Mood entry not found.")
        return redirect('dashboard')

def therapist_booking(request, mood_id=None):
    try:
        mood_entry = None
        if mood_id:
            mood_entry = MoodEntry.objects.get(id=mood_id)
        
        if request.method == 'POST':
            form = TherapistBookingForm(request.POST)
            if form.is_valid():
                booking = form.save()
                messages.success(request, f"Your appointment with {booking.therapist_name} on {booking.appointment_date.strftime('%B %d, %Y at %I:%M %p')} has been booked.")
                return redirect('dashboard')
        else:
            form = TherapistBookingForm()
        
        return render(request, 'wellness/therapist_booking.html', {
            'form': form,
            'mood_entry': mood_entry,
        })
    except MoodEntry.DoesNotExist:
        messages.error(request, "Mood entry not found.")
        return redirect('dashboard')

@require_POST
def add_reminder(request):
    form = ReminderForm(request.POST)
    if form.is_valid():
        reminder = form.save()
        return JsonResponse({
            'success': True,
            'id': reminder.id,
            'title': reminder.title,
            'date': reminder.date.strftime('%Y-%m-%d %H:%M'),
            'type': reminder.reminder_type
        })
    return JsonResponse({'success': False, 'errors': form.errors})

@require_POST
def delete_reminder(request, reminder_id):
    try:
        reminder = Reminder.objects.get(id=reminder_id)
        reminder.delete()
        return JsonResponse({'success': True})
    except Reminder.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Reminder not found'})
