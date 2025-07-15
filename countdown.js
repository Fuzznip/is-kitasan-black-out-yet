/**
 * Countdown Timer Component
 * Handles the countdown functionality independently
 */

class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.timerInterval = null;
        this.elements = {
            days: null,
            hours: null,
            minutes: null,
            seconds: null,
            readyMessage: null
        };
        
        this.init();
    }

    init() {
        // Set the release date in UTC - July 16, 2025, 22:00 UTC (3:00 PM PDT)
        this.targetDate = new Date(Date.UTC(2025, 6, 16, 22, 0, 0));
        
        // Get DOM elements
        this.elements.days = document.getElementById('days');
        this.elements.hours = document.getElementById('hours');
        this.elements.minutes = document.getElementById('minutes');
        this.elements.seconds = document.getElementById('seconds');
        this.elements.readyMessage = document.getElementById('readyMessage');
        
        // Set the release date display
        this.setReleaseDateDisplay();
        
        // Add floating animation
        this.addFloatingAnimation();
        
        // Start the countdown
        this.startCountdown();
    }

    setReleaseDateDisplay() {
        const releaseDateElement = document.getElementById('releaseDate');
        if (releaseDateElement) {
            // Format for user's local time
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            };
            releaseDateElement.textContent = this.targetDate.toLocaleString(undefined, options);
        }
    }

    startCountdown() {
        // Update immediately
        this.updateCountdown();
        
        // Update every second
        this.timerInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            // Countdown finished
            this.showReadyMessage();
            this.stopCountdown();
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display
        this.updateDisplay(days, hours, minutes, seconds);
        
        // Add special effects when countdown is low
        if (days === 0 && hours === 0 && minutes < 10) {
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.classList.add('urgent');
                this.addUrgentStyles();
            }
        }
    }

    updateDisplay(days, hours, minutes, seconds) {
        if (this.elements.days) {
            this.elements.days.textContent = this.padZero(days);
        }
        if (this.elements.hours) {
            this.elements.hours.textContent = this.padZero(hours);
        }
        if (this.elements.minutes) {
            this.elements.minutes.textContent = this.padZero(minutes);
        }
        if (this.elements.seconds) {
            this.elements.seconds.textContent = this.padZero(seconds);
        }
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    showReadyMessage() {
        if (this.elements.readyMessage) {
            this.elements.readyMessage.style.display = 'block';
        }
        
        // Update the subtitle if it exists
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = 'Card Now Available!';
        }
    }

    addUrgentStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .countdown-container.urgent .time-unit {
                animation: urgentPulse 1s infinite;
                border-color: #ff4444;
            }
            
            .countdown-container.urgent .number {
                color: #ff4444;
                text-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
            }
            
            @keyframes urgentPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        
        if (!document.querySelector('style[data-urgent]')) {
            style.setAttribute('data-urgent', 'true');
            document.head.appendChild(style);
        }
    }

    addFloatingAnimation() {
        const timeUnits = document.querySelectorAll('.time-unit');
        timeUnits.forEach((unit, index) => {
            unit.style.animationDelay = `${index * 0.2}s`;
            unit.classList.add('floating');
            
            // Add click effects
            unit.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        const style = document.createElement('style');
        style.textContent = `
            .time-unit.floating {
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
        `;
        
        if (!document.querySelector('style[data-floating]')) {
            style.setAttribute('data-floating', 'true');
            document.head.appendChild(style);
        }
    }

    stopCountdown() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    destroy() {
        this.stopCountdown();
    }
}

// Initialize countdown timer as soon as the script loads
// This will run independently of other page elements
(function() {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            window.countdownTimer = new CountdownTimer();
        });
    } else {
        setTimeout(() => {
            window.countdownTimer = new CountdownTimer();
        }, 0);
    }
})();

// Also initialize when DOM is ready as a fallback
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already initialized
    if (!window.countdownTimer) {
        window.countdownTimer = new CountdownTimer();
    }
});

// Handle page visibility changes to pause/resume timer
document.addEventListener('visibilitychange', () => {
    if (!window.countdownTimer) return;
    
    if (document.hidden) {
        // Page is hidden, we could pause the timer to save resources
        // But for a countdown, it's better to keep it running for accuracy
    } else {
        // Page is visible, ensure timer is running
        if (!window.countdownTimer.timerInterval) {
            window.countdownTimer.startCountdown();
        }
    }
});
