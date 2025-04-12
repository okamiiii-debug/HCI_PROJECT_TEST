from django import forms
from django.utils import timezone
from .models import Reminder, MoodEntry, TherapistBooking

class DateTimeInput(forms.DateTimeInput):
    input_type = 'datetime-local'

class ReminderForm(forms.ModelForm):
    class Meta:
        model = Reminder
        fields = ['title', 'description', 'date', 'reminder_type']
        widgets = {
            'date': DateTimeInput(attrs={'class': 'form-control'}),
            'title': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'reminder_type': forms.Select(attrs={'class': 'form-control'}),
        }
    
    def clean_date(self):
        date = self.cleaned_data.get('date')
        if date and date < timezone.now():
            raise forms.ValidationError("You cannot set reminders in the past.")
        return date

class MoodForm(forms.ModelForm):
    class Meta:
        model = MoodEntry
        fields = ['mood']
        widgets = {
            'mood': forms.RadioSelect(attrs={'class': 'mood-radio'}),
        }

class TherapistBookingForm(forms.ModelForm):
    class Meta:
        model = TherapistBooking
        fields = ['therapist_name', 'appointment_date', 'feelings']
        widgets = {
            'therapist_name': forms.Select(attrs={'class': 'form-control'}),
            'appointment_date': DateTimeInput(attrs={'class': 'form-control'}),
            'feelings': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'How are you feeling?'}),
        }
    
    def clean_appointment_date(self):
        date = self.cleaned_data.get('appointment_date')
        if date and date < timezone.now():
            raise forms.ValidationError("You cannot book appointments in the past.")
        return date
