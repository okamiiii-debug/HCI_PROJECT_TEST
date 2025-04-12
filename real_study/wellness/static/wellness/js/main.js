document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initModals();
    setupReminderForm();
    setupDeleteReminders();
    
    // Show messages with auto-dismiss
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });
});

// Modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetModal = document.querySelector(this.getAttribute('data-target'));
            if (targetModal) {
                targetModal.classList.add('show');
            }
        });
    });
    
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal-backdrop');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Handle reminder form submission
function setupReminderForm() {
    const reminderForm = document.getElementById('add-reminder-form');
    if (reminderForm) {
        reminderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> Adding...';
            
            fetch('/wellness/add-reminder/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Create and append new reminder to the list
                    const remindersList = document.querySelector('.reminders-list');
                    const newReminder = createReminderElement(data);
                    remindersList.prepend(newReminder);
                    
                    // Clear form
                    reminderForm.reset();
                    
                    // Close modal if it exists
                    const modal = reminderForm.closest('.modal-backdrop');
                    if (modal) {
                        modal.classList.remove('show');
                    }
                    
                    // Show success message
                    showNotification('Reminder added successfully', 'success');
                } else {
                    // Show errors
                    if (data.errors) {
                        Object.keys(data.errors).forEach(key => {
                            const inputField = reminderForm.querySelector(`[name="${key}"]`);
                            if (inputField) {
                                inputField.classList.add('is-invalid');
                                const errorFeedback = document.createElement('div');
                                errorFeedback.className = 'invalid-feedback';
                                errorFeedback.textContent = data.errors[key][0];
                                inputField.parentNode.appendChild(errorFeedback);
                            }
                        });
                    } else {
                        showNotification('Failed to add reminder', 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred', 'error');
            })
            .finally(() => {
                // Restore button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
        });
    }
}

// Create new reminder DOM element
function createReminderElement(data) {
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'reminder-item';
    reminderDiv.setAttribute('data-id', data.id);
    
    let typeClass = 'reminder-test';
    let typeIcon = '📝';
    
    if (data.type === 'assignment') {
        typeClass = 'reminder-assignment';
        typeIcon = '📚';
    } else if (data.type === 'presentation') {
        typeClass = 'reminder-presentation';
        typeIcon = '🎯';
    }
    
    reminderDiv.innerHTML = `
        <div class="reminder-type ${typeClass}">${typeIcon}</div>
        <div class="reminder-details">
            <div class="reminder-title">${data.title}</div>
            <div class="reminder-date">${data.date}</div>
        </div>
        <div class="reminder-actions">
            <div class="reminder-delete" data-id="${data.id}">❌</div>
        </div>
    `;
    
    // Attach delete event listener to the new element
    const deleteButton = reminderDiv.querySelector('.reminder-delete');
    deleteButton.addEventListener('click', function() {
        deleteReminder(data.id);
    });
    
    return reminderDiv;
}

// Set up delete buttons for reminders
function setupDeleteReminders() {
    const deleteButtons = document.querySelectorAll('.reminder-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reminderId = this.getAttribute('data-id');
            deleteReminder(reminderId);
        });
    });
}

// Delete reminder
function deleteReminder(reminderId) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        fetch(`/wellness/delete-reminder/${reminderId}/`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the reminder from the DOM
                const reminderElement = document.querySelector(`.reminder-item[data-id="${reminderId}"]`);
                if (reminderElement) {
                    reminderElement.remove();
                }
                showNotification('Reminder deleted successfully', 'success');
            } else {
                showNotification('Failed to delete reminder', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred', 'error');
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationsContainer = document.getElementById('notifications');
    if (!notificationsContainer) {
        const container = document.createElement('div');
        container.id = 'notifications';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `message message-${type}`;
    notification.textContent = message;
    notification.style.transition = 'all 0.3s ease';
    
    const container = document.getElementById('notifications') || document.body;
    container.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
