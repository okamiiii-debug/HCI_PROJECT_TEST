from django.contrib import admin
from .models import Reminder, MoodEntry, TherapistBooking

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'reminder_type')
    list_filter = ('reminder_type', 'date')
    search_fields = ('title', 'description')

@admin.register(MoodEntry)
class MoodEntryAdmin(admin.ModelAdmin):
    list_display = ('mood', 'created_at')
    list_filter = ('mood', 'created_at')

@admin.register(TherapistBooking)
class TherapistBookingAdmin(admin.ModelAdmin):
    list_display = ('therapist_name', 'appointment_date', 'created_at')
    list_filter = ('therapist_name', 'appointment_date')
    search_fields = ('feelings',)
