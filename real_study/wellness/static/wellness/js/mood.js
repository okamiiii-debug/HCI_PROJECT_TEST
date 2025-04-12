document.addEventListener('DOMContentLoaded', function() {
    initMoodTracker();
});

function initMoodTracker() {
    const moodForm = document.getElementById('mood-form');
    if (!moodForm) return;
    
    const moodOptions = document.querySelectorAll('.mood-option');
    const moodInput = document.getElementById('id_mood');
    
    // Set selected mood when clicking an option
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            
            // Update hidden input
            moodInput.value = mood;
            
            // Update UI to show selection
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Auto-submit after a short delay
            setTimeout(() => {
                moodForm.submit();
            }, 500);
        });
    });
    
    // If there's a pre-selected mood, highlight it
    const selectedMood = moodInput.value;
    if (selectedMood) {
        const selectedOption = document.querySelector(`.mood-option[data-mood="${selectedMood}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
    }
}

// For happy mood message display
function showHappyMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'happy-message';
    messageContainer.textContent = message;
    
    document.body.appendChild(messageContainer);
    
    setTimeout(() => {
        messageContainer.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageContainer.classList.remove('show');
        setTimeout(() => {
            messageContainer.remove();
        }, 500);
    }, 5000);
}
