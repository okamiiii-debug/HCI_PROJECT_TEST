document.addEventListener('DOMContentLoaded', function() {
    initBreathingExercise();
});

function initBreathingExercise() {
    const breathingContainer = document.getElementById('breathing-container');
    if (!breathingContainer) return;
    
    const breathingCircle = document.getElementById('breathing-circle');
    const timerElement = document.getElementById('breathing-timer');
    const instructionElement = document.getElementById('breathing-instruction');
    const continueButton = document.getElementById('continue-app');
    const bookTherapistButton = document.getElementById('book-therapist');
    
    // Initial state
    let timeLeft = 45; // 45 seconds
    let isExpanding = true;
    timerElement.textContent = formatTime(timeLeft);
    instructionElement.textContent = 'Breathe in...';
    breathingCircle.classList.add('breathing-expanding');
    
    // Hide buttons during exercise
    if (continueButton) continueButton.style.display = 'none';
    if (bookTherapistButton) bookTherapistButton.style.display = 'none';
    
    // Start breathing exercise
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
        
        // Toggle breathing state every 4 seconds
        if (timeLeft % 4 === 0) {
            isExpanding = !isExpanding;
            
            if (isExpanding) {
                breathingCircle.classList.remove('breathing-contracting');
                breathingCircle.classList.add('breathing-expanding');
                instructionElement.textContent = 'Breathe in...';
            } else {
                breathingCircle.classList.remove('breathing-expanding');
                breathingCircle.classList.add('breathing-contracting');
                instructionElement.textContent = 'Breathe out...';
            }
        }
        
        // End exercise when time is up
        if (timeLeft <= 0) {
            clearInterval(timer);
            breathingCircle.classList.remove('breathing-expanding');
            breathingCircle.classList.remove('breathing-contracting');
            
            instructionElement.textContent = 'Great job! How would you like to proceed?';
            timerElement.textContent = 'Complete';
            
            // Show buttons
            if (continueButton) continueButton.style.display = 'block';
            if (bookTherapistButton) bookTherapistButton.style.display = 'block';
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}
