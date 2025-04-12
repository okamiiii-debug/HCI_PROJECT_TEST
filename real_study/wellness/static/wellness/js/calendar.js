document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});

function initCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    if (!calendarContainer) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    renderCalendar(currentMonth, currentYear);
    
    // Previous month button
    const prevMonthBtn = document.getElementById('prev-month');
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            let month = parseInt(calendarContainer.getAttribute('data-month'));
            let year = parseInt(calendarContainer.getAttribute('data-year'));
            
            month--;
            if (month < 0) {
                month = 11;
                year--;
            }
            
            renderCalendar(month, year);
        });
    }
    
    // Next month button
    const nextMonthBtn = document.getElementById('next-month');
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            let month = parseInt(calendarContainer.getAttribute('data-month'));
            let year = parseInt(calendarContainer.getAttribute('data-year'));
            
            month++;
            if (month > 11) {
                month = 0;
                year++;
            }
            
            renderCalendar(month, year);
        });
    }
}

function renderCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar-container');
    if (!calendarContainer) return;
    
    // Update container data attributes
    calendarContainer.setAttribute('data-month', month);
    calendarContainer.setAttribute('data-year', year);
    
    // Update month/year display
    const monthYearDisplay = document.getElementById('month-year-display');
    if (monthYearDisplay) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();
    
    // Get reminders data from the DOM
    const remindersData = [];
    const reminderElements = document.querySelectorAll('.reminder-item');
    reminderElements.forEach(element => {
        const dateText = element.querySelector('.reminder-date').textContent;
        const reminderDate = new Date(dateText);
        
        remindersData.push({
            id: element.getAttribute('data-id'),
            date: reminderDate
        });
    });
    
    // Create calendar grid
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add blank spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const blankDay = document.createElement('div');
        blankDay.className = 'calendar-day empty';
        calendarGrid.appendChild(blankDay);
    }
    
    // Add days of the month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = i;
        
        // Check if this day is today
        if (today.getDate() === i && today.getMonth() === month && today.getFullYear() === year) {
            dayElement.classList.add('today');
        }
        
        // Check if this day has reminders
        const currentDate = new Date(year, month, i);
        const hasReminders = remindersData.some(reminder => {
            return reminder.date.getDate() === currentDate.getDate() && 
                   reminder.date.getMonth() === currentDate.getMonth() && 
                   reminder.date.getFullYear() === currentDate.getFullYear();
        });
        
        if (hasReminders) {
            dayElement.classList.add('has-events');
            
            // Add indicator dot
            const indicator = document.createElement('div');
            indicator.className = 'event-indicator';
            dayElement.appendChild(indicator);
        }
        
        // Make day clickable to add reminder
        dayElement.addEventListener('click', function() {
            const reminderDate = new Date(year, month, i);
            openAddReminderModal(reminderDate);
        });
        
        calendarGrid.appendChild(dayElement);
    }
}

function openAddReminderModal(date) {
    const modal = document.getElementById('add-reminder-modal');
    if (modal) {
        // Format date for the datetime-local input
        const dateField = document.getElementById('id_date');
        if (dateField) {
            // Format: YYYY-MM-DDThh:mm
            const formattedDate = date.toISOString().slice(0, 16);
            dateField.value = formattedDate;
        }
        
        modal.classList.add('show');
    } else {
        // If no modal exists, redirect to add reminder form
        const formattedDate = date.toISOString().slice(0, 16);
        window.location.href = `/wellness/add-reminder/?date=${encodeURIComponent(formattedDate)}`;
    }
}
