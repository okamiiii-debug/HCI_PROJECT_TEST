# Real Study - Student Wellness Application

A Django-based student wellness app that helps students manage their academic workload while monitoring their well-being.

## Features

- **Calendar with Reminders**: Track tests, assignments, and presentations with an interactive calendar
- **Mood Tracker**: Record your mood and receive appropriate responses:
  - Happy moods get encouraging messages
  - Other moods (sad, angry, frustrated) lead to breathing exercises
- **Therapist Booking**: Book sessions with wellness professionals when needed

## Technologies Used

- Django web framework
- SQLite database
- Custom CSS styling (no Bootstrap)
- Vanilla JavaScript for interactive features

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/yourusername/real-study.git
cd real-study
```

2. Install dependencies
```bash
pip install django
```

3. Run migrations
```bash
cd real_study
python manage.py migrate
```

4. Start the development server
```bash
python manage.py runserver
```

5. Access the application at http://localhost:8000

## Screenshots

![Dashboard Screenshot](screenshots/dashboard.png)

## Project Structure

- `real_study/` - Django project directory
  - `wellness/` - Main application
    - `models.py` - Data models (Reminder, MoodEntry, TherapistBooking)
    - `views.py` - View functions for all pages
    - `templates/` - HTML templates
    - `static/` - CSS, JavaScript, and SVG assets

## License

MIT