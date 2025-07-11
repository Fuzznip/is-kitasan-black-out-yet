// Target release date: July 16th, 2025 at 3:00 PM PDT (Pacific Daylight Time)
// Convert PDT to UTC: 3:00 PM PDT = 10:00 PM UTC (PDT is UTC-7)
const targetDate = new Date('2025-07-16T22:00:00.000Z'); // UTC time

function updateCountdown() {
    const now = new Date();
    const timeDifference = targetDate.getTime() - now.getTime();

    // Check if the target date has passed
    if (timeDifference <= 0) {
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('readyMessage').style.display = 'block';
        
        // Update the title to show it's available
        document.querySelector('.subtitle').textContent = 'Card Now Available!';
        return;
    }

    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update the display with leading zeros
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    // Add special effects when countdown is low
    if (days === 0 && hours === 0 && minutes < 10) {
        document.querySelector('.countdown-container').classList.add('urgent');
        addUrgentStyles();
    }
}

function addUrgentStyles() {
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

// Add floating animation to time units
function addFloatingAnimation() {
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach((unit, index) => {
        unit.style.animationDelay = `${index * 0.2}s`;
        unit.classList.add('floating');
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
    document.head.appendChild(style);
}

// Initialize countdown
function init() {
    updateCountdown();
    addFloatingAnimation();
    
    // Update every second
    setInterval(updateCountdown, 1000);
    
    // Display current time for reference
    console.log('Current time (UTC):', new Date().toISOString());
    console.log('Current time (Local):', new Date().toLocaleString());
    console.log('Target time (UTC):', targetDate.toISOString());
    console.log('Target time (Local):', targetDate.toLocaleString());
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    init();
    initRerollSimulator();
    
    // Add click effects to time units
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
        unit.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add particle effect on card hover
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
        cardContainer.addEventListener('mouseenter', function() {
            createParticles(this);
            createGoldenSparkles(this);
        });
    }
});

function createParticles(element) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffd700;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + Math.random() * rect.width + 'px';
        particle.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        particle.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-50px)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function createGoldenSparkles(element) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('img');
        sparkle.src = 'images/karat.png';
        sparkle.alt = 'Karat';
        sparkle.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 1001;
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
        `;
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
        sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        const randomDirection = Math.random() * 360;
        const distance = 30 + Math.random() * 30;
        const x = Math.cos(randomDirection * Math.PI / 180) * distance;
        const y = Math.sin(randomDirection * Math.PI / 180) * distance;
        
        sparkle.animate([
            { 
                transform: 'translate(0px, 0px) scale(0) rotate(0deg)', 
                opacity: 1,
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
            },
            { 
                transform: `translate(${x}px, ${y}px) scale(1.5) rotate(180deg)`, 
                opacity: 0,
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))'
            }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

// Reroll simulator variables
let rerollCount = 0;
let totalKitasanCount = 0;
let totalPulls = 0;
let rerollHistory = [];

// Reroll simulator functionality
function initRerollSimulator() {
    const rerollButton = document.getElementById('rerollButton');
    if (rerollButton) {
        rerollButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            performReroll();
        });
    }
}

function performReroll() {
    const button = document.getElementById('rerollButton');
    
    if (!button) {
        return;
    }
    
    button.disabled = true;
    button.querySelector('.button-text').textContent = 'ROLLING...';
    
    // Simulate rolling delay
    setTimeout(() => {
        rerollCount++;
        let kitasanPulled = 0;
        
        // Perform 50 pulls with 0.75% chance each
        for (let i = 0; i < 50; i++) {
            totalPulls++;
            const random = Math.random();
            if (random < 0.0075) { // 0.75% chance
                kitasanPulled++;
                totalKitasanCount++;
            }
        }
        
        // Store this reroll result
        rerollHistory.push({
            rerollNumber: rerollCount,
            kitasanCount: kitasanPulled,
            pullsToGet: kitasanPulled > 0 ? rerollCount : null
        });
        
        // Update display
        updateStats();
        showRerollResult(kitasanPulled);
        updateLuckMeter();
        
        // Re-enable button
        button.disabled = false;
        button.querySelector('.button-text').textContent = 'REROLL (50 PULLS)';
    }, 1500);
}

function updateStats() {
    document.getElementById('rerollCount').textContent = rerollCount;
    document.getElementById('kitasanCount').textContent = totalKitasanCount;
    document.getElementById('totalPulls').textContent = totalPulls;
}

function showRerollResult(kitasanPulled) {
    const resultsDiv = document.getElementById('rerollResults');
    const resultText = document.getElementById('resultText');
    const percentileText = document.getElementById('percentileText');
    
    let message = '';
    let percentile = '';
    
    if (kitasanPulled === 0) {
        message = '💔 No Kitasan Black this time...';
        percentile = calculatePercentile(0);
    } else if (kitasanPulled === 1) {
        message = '🎉 Got 1 Kitasan Black!';
        percentile = calculatePercentile(1);
    } else if (kitasanPulled === 2) {
        message = '🌟 Amazing! 2 Kitasan Blacks!';
        percentile = calculatePercentile(2);
    } else if (kitasanPulled >= 3) {
        message = `✨ INCREDIBLE! ${kitasanPulled} Kitasan Blacks!`;
        percentile = calculatePercentile(kitasanPulled);
    }
    
    resultText.textContent = message;
    percentileText.textContent = percentile;
    resultsDiv.style.display = 'block';
    
    // Add special effects for rare pulls
    if (kitasanPulled >= 2) {
        createCelebrationEffect();
    }
}

function calculatePercentile(kitasanCount) {
    // Calculate probability and percentile based on binomial distribution
    // For 50 pulls at 0.75% each:
    // P(0) ≈ 69.26%
    // P(1) ≈ 26.11% 
    // P(2) ≈ 4.01%
    // P(3) ≈ 0.49%
    // P(4+) ≈ 0.13%
    
    const probabilities = {
        0: 69.26,
        1: 26.11,
        2: 4.01,
        3: 0.49,
        4: 0.13
    };
    
    let percentile;
    if (kitasanCount === 0) {
        percentile = `Bottom ${probabilities[0].toFixed(1)}% (Most common result)`;
    } else if (kitasanCount === 1) {
        percentile = `Top ${(100 - probabilities[0]).toFixed(1)}% (Good luck!)`;
    } else if (kitasanCount === 2) {
        percentile = `Top ${(probabilities[2] + probabilities[3] + probabilities[4]).toFixed(2)}% (Very lucky!)`;
    } else if (kitasanCount === 3) {
        percentile = `Top ${(probabilities[3] + probabilities[4]).toFixed(2)}% (Extremely lucky!)`;
    } else {
        percentile = `Top ${probabilities[4].toFixed(2)}% (LEGENDARY LUCK!)`;
    }
    
    return percentile;
}

function updateLuckMeter() {
    const luckFill = document.getElementById('luckFill');
    const luckText = document.getElementById('luckText');
    
    if (totalKitasanCount === 0) {
        luckFill.style.width = '10%';
        luckFill.style.background = '#ff4444';
        luckText.textContent = 'Keep trying!';
    } else {
        const luckPercentage = Math.min((totalKitasanCount / rerollCount) * 100 / 0.75, 100);
        luckFill.style.width = `${Math.max(luckPercentage * 0.8, 20)}%`;
        
        if (luckPercentage > 150) {
            luckFill.style.background = 'linear-gradient(90deg, #ffd700, #00ff88)';
            luckText.textContent = 'Incredible luck!';
        } else if (luckPercentage > 100) {
            luckFill.style.background = 'linear-gradient(90deg, #ffaa00, #ffd700)';
            luckText.textContent = 'Above average luck!';
        } else if (luckPercentage > 50) {
            luckFill.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
            luckText.textContent = 'Average luck';
        } else {
            luckFill.style.background = '#ff4444';
            luckText.textContent = 'Below average luck';
        }
    }
}

function createCelebrationEffect() {
    // Create golden particles across the screen for rare pulls
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('img');
            particle.src = 'images/karat.png';
            particle.style.cssText = `
                position: fixed;
                width: 15px;
                height: 15px;
                pointer-events: none;
                z-index: 2000;
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
            `;
            
            document.body.appendChild(particle);
            
            particle.animate([
                { 
                    transform: 'translateY(0px) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${window.innerHeight + 50}px) rotate(360deg)`, 
                    opacity: 0 
                }
            ], {
                duration: 3000 + Math.random() * 2000,
                easing: 'ease-in'
            }).onfinish = () => particle.remove();
        }, i * 100);
    }
}
