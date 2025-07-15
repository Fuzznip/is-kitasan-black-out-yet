/**
 * Countdown Time        // Set the release date in UTC - July 16, 2025, 22:00 UTC (3:00 PM PDT)
        this.targetDate = new Date(Date.UTC(2025, 6, 15, 22, 10, 0));

        // Set target date as 5 seconds from now for testing
        // this.targetDate = new Date(Date.now() + 5000);ponent
 * Handles the countdown functionality independently
 */

class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.timerInterval = null;
        this.lastUnitCount = 0;
        this.isInitialLoad = true;
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

        // Set target date as 5 seconds from now for testing
        // this.targetDate = new Date(Date.now() + 5000);
        // Set target date as 10 minutes and 5 seconds from now
        // this.targetDate = new Date(Date.now() + 600000 + 5000); // 10 minutes and 5 seconds
        // Set target date as 5 minutes 5 seconds from now
        //this.targetDate = new Date(Date.now() + 305000); // 5 minutes and 5 seconds
        // Set target date as 1 hour 5 seconds now for testing
        // this.targetDate = new Date(Date.now() + 60000*60 + 5000);
        
        // Get countdown container
        this.countdownContainer = document.getElementById('countdown');
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
        // Determine which time units should be visible
        const shouldShow = {
            days: days > 0,
            hours: hours > 0 || days > 0,
            minutes: minutes > 0 || hours > 0 || days > 0,
            seconds: true // Always show seconds
        };

        // Get current time units
        const currentUnits = Array.from(this.countdownContainer.children);
        const currentStructure = currentUnits.map(unit => {
            const label = unit.querySelector('.label').textContent;
            return label.toLowerCase();
        });

        // Determine target structure
        const targetStructure = [];
        if (shouldShow.days) targetStructure.push('days');
        if (shouldShow.hours) targetStructure.push('hours');
        if (shouldShow.minutes) targetStructure.push('minutes');
        if (shouldShow.seconds) targetStructure.push('seconds');

        // Check if structure needs to change
        const structureChanged = this.isInitialLoad || JSON.stringify(currentStructure) !== JSON.stringify(targetStructure);

        if (structureChanged) {
            // Structure changed - rebuild with animations
            this.rebuildCountdownStructure(targetStructure, days, hours, minutes, seconds);
            this.isInitialLoad = false;
        } else {
            // Structure same - just update numbers
            this.updateCountdownNumbers(days, hours, minutes, seconds);
        }
    }

    updateCountdownNumbers(days, hours, minutes, seconds) {
        // Update only the numbers without changing structure
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

    rebuildCountdownStructure(targetStructure, days, hours, minutes, seconds) {
        const isInitial = this.countdownContainer.children.length === 0;
        
        if (!isInitial) {
            // Fade out current elements
            const currentUnits = Array.from(this.countdownContainer.children);
            currentUnits.forEach(unit => {
                unit.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                unit.style.opacity = '0';
                unit.style.transform = 'scale(0.8)';
            });
        }

        // After fade out (or immediately for initial load), rebuild structure
        setTimeout(() => {
            this.countdownContainer.innerHTML = '';
            
            const timeUnits = [];
            if (targetStructure.includes('days')) {
                timeUnits.push({ value: days, label: 'DAYS', id: 'days' });
            }
            if (targetStructure.includes('hours')) {
                timeUnits.push({ value: hours, label: 'HOURS', id: 'hours' });
            }
            if (targetStructure.includes('minutes')) {
                timeUnits.push({ value: minutes, label: 'MINUTES', id: 'minutes' });
            }
            if (targetStructure.includes('seconds')) {
                timeUnits.push({ value: seconds, label: 'SECONDS', id: 'seconds' });
            }

            // Create elements for each time unit
            timeUnits.forEach((unit, index) => {
                const timeUnitDiv = document.createElement('div');
                timeUnitDiv.className = 'time-unit floating';
                timeUnitDiv.style.animationDelay = `${index * 0.2}s`;
                
                if (!isInitial) {
                    timeUnitDiv.style.opacity = '0';
                    timeUnitDiv.style.transform = 'scale(0.8)';
                }
                
                const numberSpan = document.createElement('span');
                numberSpan.className = 'number';
                numberSpan.id = unit.id;
                numberSpan.textContent = this.padZero(unit.value);
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = unit.label;
                
                timeUnitDiv.appendChild(numberSpan);
                timeUnitDiv.appendChild(labelSpan);
                
                // Add click effect
                timeUnitDiv.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
                
                this.countdownContainer.appendChild(timeUnitDiv);
                
                // Store references for easy updates
                this.elements[unit.id] = numberSpan;

                // Fade in new elements with delay (only if not initial load)
                if (!isInitial) {
                    setTimeout(() => {
                        timeUnitDiv.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                        timeUnitDiv.style.opacity = '1';
                        timeUnitDiv.style.transform = 'scale(1)';
                    }, index * 100);
                }
            });

            // Add smooth transition animation to container (only if not initial load)
            if (!isInitial) {
                this.countdownContainer.style.animation = 'recenterSlide 0.6s ease-out';
                setTimeout(() => {
                    this.countdownContainer.style.animation = '';
                }, 600);
            }

        }, isInitial ? 0 : 300);

        this.lastUnitCount = targetStructure.length;
    }

    padZero(num) {
        return num.toString().padStart(2, '0');
    }

    showReadyMessage() {
        // Completely remove the countdown container
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            countdownContainer.style.opacity = '0';
            countdownContainer.style.transform = 'scale(0.8)';
            
            // Remove the element after the transition completes
            setTimeout(() => {
                if (countdownContainer.parentNode) {
                    countdownContainer.remove();
                }
            }, 800);
        }

        // Create epic celebration animation
        this.createEpicCelebration();
        
        // Update the subtitle if it exists
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = 'Card Now Available!';
        }
    }

    createEpicCelebration() {
        // Prevent multiple celebrations
        if (document.querySelector('.celebration-overlay')) {
            return;
        }

        // Create celebration overlay
        const celebrationOverlay = document.createElement('div');
        celebrationOverlay.className = 'celebration-overlay';
        celebrationOverlay.innerHTML = `
            <div class="celebration-content">
                <div class="flash-effect"></div>
                <div class="celebration-text">
                    <div class="main-announcement">KITASAN BLACK</div>
                    <div class="sub-announcement">IS NOW AVAILABLE! GO SCOUT NOW!</div>
                </div>
                <div class="celebration-card">
                    <div class="card-burst"></div>
                    <img src="images/tex_support_card_30028.png" alt="Kitasan Black" class="celebration-card-image">
                </div>
                <div class="close-celebration" onclick="this.parentElement.parentElement.remove()">×</div>
            </div>
        `;
        
        document.body.appendChild(celebrationOverlay);
        
        // Add celebration styles
        this.addCelebrationStyles();
        
        // Add click anywhere to dismiss
        celebrationOverlay.addEventListener('click', (e) => {
            if (e.target === celebrationOverlay || e.target.classList.contains('celebration-content')) {
                celebrationOverlay.classList.add('fade-out');
                setTimeout(() => celebrationOverlay.remove(), 500);
            }
        });
        
        // Trigger animations with delays
        setTimeout(() => {
            celebrationOverlay.classList.add('active');
        }, 100);
        
        // Auto-close after 8 seconds
        // setTimeout(() => {
        //     if (celebrationOverlay.parentNode) {
        //         celebrationOverlay.classList.add('fade-out');
        //         setTimeout(() => celebrationOverlay.remove(), 500);
        //     }
        // }, 8000);

        // Show the ready message in the original location too
        if (this.elements.readyMessage) {
            this.elements.readyMessage.style.display = 'block';
            this.elements.readyMessage.classList.add('epic-ready');
        }
    }

    addCelebrationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .celebration-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(to top, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.8s ease-out;
                backdrop-filter: blur(3px);
                cursor: pointer;
            }

            .celebration-overlay.active {
                opacity: 1;
            }

            .celebration-overlay.fade-out {
                opacity: 0;
                transition: opacity 0.5s ease-in;
            }

            .celebration-content {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                pointer-events: none;
            }

            .flash-effect {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                animation: flashBurst 0.4s ease-out;
                pointer-events: none;
            }

            @keyframes flashBurst {
                0% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.2); }
            }

            .celebration-text {
                text-align: center;
                z-index: 10;
                animation: textReveal 0.8s ease-out 0.3s both;
                pointer-events: none;
            }

            .main-announcement {
                font-family: 'Orbitron', monospace;
                font-size: clamp(2rem, 6vw, 4rem);
                font-weight: 900;
                background: linear-gradient(45deg, #FFD700, #FFA500, #FF6B35, #FFD700);
                background-size: 300% 300%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 2s ease-in-out infinite;
                margin-bottom: 0.5rem;
                /* Add outline and shadow for better visibility */
                -webkit-text-stroke: 2px rgba(0, 0, 0, 0.8);
                text-stroke: 2px rgba(0, 0, 0, 0.8);
                filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));
            }

            .sub-announcement {
                font-family: 'Orbitron', monospace;
                font-size: clamp(1rem, 3vw, 1.8rem);
                font-weight: 700;
                color: #FFD700;
                text-shadow: 
                    2px 2px 4px rgba(0, 0, 0, 0.8),
                    0 0 20px rgba(255, 215, 0, 0.6),
                    0 0 30px rgba(255, 215, 0, 0.3);
                margin-bottom: 1rem;
                animation: pulseGlow 2s ease-in-out infinite;
                /* Add outline for better visibility */
                -webkit-text-stroke: 1px rgba(0, 0, 0, 0.6);
                text-stroke: 1px rgba(0, 0, 0, 0.6);
            }

            @keyframes textReveal {
                0% { opacity: 0; transform: translateY(30px) scale(0.9); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }

            @keyframes pulseGlow {
                0%, 100% { 
                    transform: scale(1);
                    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                }
                50% { 
                    transform: scale(1.03);
                    text-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
                }
            }

            .celebration-card {
                position: relative;
                margin: 1rem 0;
                animation: cardReveal 1s ease-out 0.8s both;
                pointer-events: none;
            }

            .celebration-card-image {
                width: clamp(150px, 20vw, 220px);
                height: auto;
                border-radius: 12px;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
                border: 2px solid #FFD700;
                animation: cardFloat 3s ease-in-out infinite;
            }

            .card-burst {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 150%;
                height: 150%;
                background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
                transform: translate(-50%, -50%);
                animation: burstPulse 2s ease-out infinite;
                pointer-events: none;
            }

            @keyframes cardReveal {
                0% { 
                    opacity: 0; 
                    transform: scale(0); 
                }
                50% { 
                    opacity: 0.8; 
                    transform: scale(1.1); 
                }
                100% { 
                    opacity: 1; 
                    transform: scale(1); 
                }
            }

            @keyframes cardFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-8px) rotate(1deg); }
                75% { transform: translateY(-4px) rotate(-1deg); }
            }

            @keyframes burstPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
                50% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
            }

            .close-celebration {
                position: absolute;
                top: 15px;
                right: 20px;
                width: 35px;
                height: 35px;
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                color: white;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                z-index: 15;
                pointer-events: auto;
            }

            .close-celebration:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            }

            .epic-ready {
                animation: epicReadyPulse 2s ease-in-out infinite;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: bold;
                font-size: 1.2rem;
                text-align: center;
            }

            @keyframes epicReadyPulse {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5)); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)); }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .celebration-card-image {
                    width: clamp(120px, 25vw, 180px);
                }
                
                .close-celebration {
                    top: 10px;
                    right: 15px;
                    width: 30px;
                    height: 30px;
                    font-size: 18px;
                }
            }
        `;
        
        if (!document.querySelector('style[data-celebration]')) {
            style.setAttribute('data-celebration', 'true');
            document.head.appendChild(style);
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
            .countdown-container {
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                display: flex;
                justify-content: center;
                width: 100%;
            }
            
            .countdown {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                min-height: 120px;
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
            }
            
            .time-unit {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                opacity: 1;
                transform: scale(1);
                transform-origin: center;
                visibility: visible;
                min-width: fit-content;
                width: 80px; /* Fixed width to prevent shifting */
                text-align: center;
            }
            
            .time-unit .number {
                display: block;
                margin-bottom: 0.5rem;
                transition: all 0.3s ease-out;
                font-family: 'Orbitron', monospace;
                font-weight: 700;
                width: 60px; /* Fixed width for numbers */
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: auto;
                margin-right: auto;
            }
            
            .time-unit .label {
                display: block;
                font-size: 0.8rem;
                opacity: 0.8;
                transition: all 0.3s ease-out;
                width: 60px; /* Fixed width for labels */
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: auto;
                margin-right: auto;
            }
            
            .time-unit.floating {
                animation: float 6s ease-in-out infinite;
            }
            
            /* Enhanced floating animation */
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0px) scale(var(--scale, 1)); 
                }
                50% { 
                    transform: translateY(-10px) scale(var(--scale, 1)); 
                }
            }

            /* Smooth recentering animation */
            @keyframes recenterSlide {
                0% {
                    transform: scale(0.98);
                    opacity: 0.9;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Responsive gap adjustment */
            @media (max-width: 768px) {
                .countdown {
                    gap: 1rem;
                    min-height: 100px;
                }
                
                .time-unit {
                    width: 70px; /* Slightly smaller on tablets */
                }
                
                .time-unit .number,
                .time-unit .label {
                    width: 50px;
                    margin-left: auto;
                    margin-right: auto;
                }
            }

            @media (max-width: 480px) {
                .countdown {
                    gap: 0.5rem;
                    min-height: 80px;
                }
                
                .time-unit {
                    width: 60px; /* Smaller on mobile */
                }
                
                .time-unit .number,
                .time-unit .label {
                    width: 45px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .time-unit .label {
                    font-size: 0.7rem; /* Slightly smaller text on mobile */
                }
            }

            /* Improved hover effects */
            .time-unit:hover {
                transform: scale(1.05) !important;
                transition: transform 0.2s ease-out;
                --scale: 1.05;
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
