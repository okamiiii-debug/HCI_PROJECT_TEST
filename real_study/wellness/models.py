from django.db import models
from django.utils import timezone

class Reminder(models.Model):
    REMINDER_TYPES = [
        ('test', 'Test'),
        ('assignment', 'Assignment'),
        ('presentation', 'Presentation'),
    ]
    
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.date.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['date']

class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('angry', 'Angry'),
        ('sad', 'Sad'),
        ('frustrated', 'Frustrated'),
    ]
    
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.mood} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        verbose_name_plural = "Mood entries"
        ordering = ['-created_at']

class TherapistBooking(models.Model):
    THERAPIST_CHOICES = [
        ('Dr. Motho Mothoane', 'Dr. Motho Mothoane'),
        ('Dr. James Jamerson', 'Dr. James Jamerson'),
        ('Dr. Frida Fridada', 'Dr. Frida Fridada'),
    ]
    
    therapist_name = models.CharField(max_length=100, choices=THERAPIST_CHOICES)
    appointment_date = models.DateTimeField()
    feelings = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Booking with {self.therapist_name} on {self.appointment_date.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['appointment_date']
