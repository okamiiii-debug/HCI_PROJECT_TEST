# Generated by Django 5.2 on 2025-04-12 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MoodEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mood', models.CharField(choices=[('happy', 'Happy'), ('angry', 'Angry'), ('sad', 'Sad'), ('frustrated', 'Frustrated')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Mood entries',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Reminder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('date', models.DateTimeField()),
                ('reminder_type', models.CharField(choices=[('test', 'Test'), ('assignment', 'Assignment'), ('presentation', 'Presentation')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['date'],
            },
        ),
        migrations.CreateModel(
            name='TherapistBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('therapist_name', models.CharField(choices=[('Dr. Motho Mothoane', 'Dr. Motho Mothoane'), ('Dr. James Jamerson', 'Dr. James Jamerson'), ('Dr. Frida Fridada', 'Dr. Frida Fridada')], max_length=100)),
                ('appointment_date', models.DateTimeField()),
                ('feelings', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['appointment_date'],
            },
        ),
    ]
