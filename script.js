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
    initRollSimulator();
    
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

// Roll simulator variables
let totalKitasanCount = 0;
let totalPulls = 0;
let rollHistory = [];

// Roll simulator functionality
function initRollSimulator() {
    const rollButton = document.getElementById('rollButton');
    const resetButton = document.getElementById('resetButton');
    const pullCountSlider = document.getElementById('pullCountSlider');
    const pullCountNumber = document.getElementById('pullCountNumber');
    
    if (rollButton) {
        rollButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            performRoll();
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            resetStats();
        });
    }
    
    // Sync slider and number input
    if (pullCountSlider && pullCountNumber) {
        pullCountSlider.addEventListener('input', function() {
            pullCountNumber.value = this.value;
            updateButtonText();
        });
        
        // Initialize button text
        updateButtonText();
    }
}

function updateButtonText() {
    const pullCount = getPullCount();
    const buttonText = document.querySelector('.button-text');
    if (buttonText) {
        buttonText.textContent = `ROLL (${pullCount} PULLS)`;
    }
}

function resetStats() {
    totalKitasanCount = 0;
    totalPulls = 0;
    rollHistory = [];
    
    // Update display
    updateStats();
    updateLuckMeter();
    
    // Hide roll results
    const resultsDiv = document.getElementById('rollResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

function getPullCount() {
    const pullCountNumber = document.getElementById('pullCountNumber');
    return pullCountNumber ? parseInt(pullCountNumber.value) || 50 : 50;
}

function performRoll() {
    const button = document.getElementById('rollButton');
    
    if (!button) {
        return;
    }
    
    const pullCount = getPullCount();
    
    button.disabled = true;
    button.querySelector('.button-text').textContent = 'ROLLING...';
    
    // Simulate rolling delay
    setTimeout(() => {
        let kitasanPulled = 0;
        
        // Perform pulls with 0.75% chance each
        for (let i = 0; i < pullCount; i++) {
            totalPulls++;
            const random = Math.random();
            if (random < 0.0075) { // 0.75% chance
                kitasanPulled++;
                totalKitasanCount++;
            }
        }
        
        // Store this roll result
        rollHistory.push({
            rollNumber: rollHistory.length + 1,
            kitasanCount: kitasanPulled,
            pullsToGet: kitasanPulled > 0 ? rollHistory.length + 1 : null,
            pullCount: pullCount
        });
        
        // Update display
        updateStats();
        showRollResult(kitasanPulled, pullCount);
        updateLuckMeter();
        
        // Re-enable button
        button.disabled = false;
        updateButtonText();
    }, 1500);
}

function updateStats() {
    document.getElementById('kitasanCount').textContent = totalKitasanCount;
    document.getElementById('totalPulls').textContent = totalPulls;
}

function showRollResult(kitasanPulled, pullCount = 50) {
    const resultsDiv = document.getElementById('rollResults');
    const resultText = document.getElementById('resultText');
    const percentileText = document.getElementById('percentileText');
    
    let message = '';
    let percentile = '';
    
    // Get the percentile calculation first
    percentile = calculatePercentile(kitasanPulled, pullCount);
    
    // Extract the percentile rank for determining message tone
    const percentileMatch = percentile.match(/([\d.]+)(?:st|nd|rd|th) percentile/);
    let percentileValue = 50; // Default to median
    
    if (percentileMatch) {
        percentileValue = parseFloat(percentileMatch[1]);
    }
    
    // Generate message based on luck level
    if (kitasanPulled === 0) {
        message = '💔 No Kitasan Black this time...';
    } else if (percentileValue <= 25) {
        // Bad luck (bottom 25%)
        if (kitasanPulled === 1) {
            message = '😐 Got 1 Kitasan Black (below average luck)';
        } else {
            message = `😐 Got ${kitasanPulled} Kitasan Blacks (below average luck)`;
        }
    } else if (percentileValue <= 75) {
        // Average luck (25th-75th percentile)
        if (kitasanPulled === 1) {
            message = '🙂 Got 1 Kitasan Black (average luck)';
        } else {
            message = `🙂 Got ${kitasanPulled} Kitasan Blacks (average luck)`;
        }
    } else if (percentileValue <= 90) {
        // Good luck (75th-90th percentile)
        if (kitasanPulled === 1) {
            message = '😊 Got 1 Kitasan Black (good luck!)';
        } else {
            message = `🎉 Got ${kitasanPulled} Kitasan Blacks (good luck!)`;
        }
    } else if (percentileValue <= 99) {
        // Very lucky (90th-99th percentile)
        if (kitasanPulled === 1) {
            message = '🌟 Got 1 Kitasan Black (very lucky!)';
        } else {
            message = `🌟 Amazing! ${kitasanPulled} Kitasan Blacks (very lucky!)`;
        }
    } else if (percentileValue <= 99.9) {
        // Extremely lucky (99th-99.9th percentile)
        message = `✨ INCREDIBLE! ${kitasanPulled} Kitasan Black${kitasanPulled > 1 ? 's' : ''} (extremely lucky!)`;
    } else {
        // Legendary luck (99.9th+ percentile)
        message = `🎆 LEGENDARY! ${kitasanPulled} Kitasan Black${kitasanPulled > 1 ? 's' : ''} (legendary luck!)`;
    }
    
    resultText.textContent = message;
    percentileText.textContent = percentile;
    resultsDiv.style.display = 'block';
    
    // Add special effects based on luck level
    const shouldCelebrate = percentileValue >= 90 || kitasanPulled >= 3;
    if (shouldCelebrate) {
        createCelebrationEffect(kitasanPulled);
    }
}

function calculatePercentile(kitasanCount, pullCount = 50) {
    // Calculate binomial probability for getting exactly k successes in n trials with probability p
    function binomialProbability(n, k, p) {
        if (k > n) return 0;
        
        // Calculate binomial coefficient (n choose k)
        function binomialCoeff(n, k) {
            if (k > n - k) k = n - k; // Take advantage of symmetry
            let result = 1;
            for (let i = 0; i < k; i++) {
                result = result * (n - i) / (i + 1);
            }
            return result;
        }
        
        return binomialCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }
    
    const p = 0.0075; // 0.75% chance per pull
    
    // Calculate probability of getting exactly this many or fewer
    let cumulativeProbability = 0;
    for (let i = 0; i <= kitasanCount; i++) {
        cumulativeProbability += binomialProbability(pullCount, i, p);
    }
    
    // Convert to percentile (0-100)
    const percentile = cumulativeProbability * 100;
    
    // Format percentile with appropriate precision and ordinal suffix
    function getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }
    
    let formattedPercentile;
    if (percentile >= 99.9) {
        formattedPercentile = `99.9${getOrdinalSuffix(99)}+ percentile`;
    } else if (percentile >= 99) {
        const rounded = Math.round(percentile * 10) / 10;
        formattedPercentile = `${rounded.toFixed(1)}${getOrdinalSuffix(Math.floor(rounded))} percentile`;
    } else if (percentile >= 90) {
        const rounded = Math.round(percentile);
        formattedPercentile = `${rounded}${getOrdinalSuffix(rounded)} percentile`;
    } else if (percentile >= 10) {
        const rounded = Math.round(percentile);
        formattedPercentile = `${rounded}${getOrdinalSuffix(rounded)} percentile`;
    } else if (percentile >= 1) {
        const rounded = Math.round(percentile * 10) / 10;
        formattedPercentile = `${rounded.toFixed(1)}${getOrdinalSuffix(Math.floor(rounded))} percentile`;
    } else if (percentile >= 0.1) {
        const rounded = Math.round(percentile * 100) / 100;
        formattedPercentile = `${rounded.toFixed(2)}${getOrdinalSuffix(Math.floor(rounded))} percentile`;
    } else {
        const rounded = Math.round(percentile * 1000) / 1000;
        formattedPercentile = `${rounded.toFixed(3)}${getOrdinalSuffix(Math.floor(rounded))} percentile`;
    }
    
    return formattedPercentile;
}

function updateLuckMeter() {
    const luckFill = document.getElementById('luckFill');
    const luckText = document.getElementById('luckText');
    const overallPercentile = document.getElementById('overallPercentile');
    
    // Update overall percentile display
    if (totalPulls >= 50) {
        const overallPercentileValue = calculatePercentile(totalKitasanCount, totalPulls);
        overallPercentile.textContent = `Overall Luck: ${overallPercentileValue}`;
    } else if (totalPulls > 0) {
        overallPercentile.textContent = `Overall Luck: ${totalKitasanCount}/${totalPulls} pulls (need 50+ for percentile)`;
    } else {
        overallPercentile.textContent = 'Overall Luck: Not enough data';
    }
    
    if (totalKitasanCount === 0 && totalPulls > 0) {
        luckFill.style.width = '15%';
        luckFill.style.background = '#ff4444';
        luckText.textContent = 'Keep trying!';
    } else if (totalPulls === 0) {
        luckFill.style.width = '5%';
        luckFill.style.background = '#888';
        luckText.textContent = 'Try your luck!';
    } else if (totalPulls >= 50) {
        // Use percentile-based system for enough data
        const overallPercentileText = calculatePercentile(totalKitasanCount, totalPulls);
        const percentileMatch = overallPercentileText.match(/([\d.]+)(?:st|nd|rd|th) percentile/);
        let percentileValue = 50; // Default to median
        
        if (percentileMatch) {
            percentileValue = parseFloat(percentileMatch[1]);
        }
        
        // Set width based on percentile with better scaling
        let widthPercentage;
        if (percentileValue >= 99.9) {
            widthPercentage = 100;
        } else if (percentileValue >= 99) {
            widthPercentage = 95;
        } else if (percentileValue >= 95) {
            widthPercentage = 90;
        } else if (percentileValue >= 80) {
            widthPercentage = 80;
        } else if (percentileValue >= 60) {
            widthPercentage = Math.max(60, percentileValue);
        } else if (percentileValue >= 20) {
            widthPercentage = Math.max(30, percentileValue * 0.8);
        } else {
            widthPercentage = Math.max(15, percentileValue * 0.75);
        }
        
        luckFill.style.width = `${widthPercentage}%`;
        
        // Set color and text based on percentile thresholds with more granular feedback
        if (percentileValue >= 99.9) {
            luckFill.style.background = 'linear-gradient(90deg, #ff00ff, #ffd700, #00ff88)';
            luckText.textContent = 'Legendary luck!';
        } else if (percentileValue >= 99) {
            luckFill.style.background = 'linear-gradient(90deg, #ffd700, #00ff88, #00ffff)';
            luckText.textContent = 'Extremely lucky!';
        } else if (percentileValue >= 95) {
            luckFill.style.background = 'linear-gradient(90deg, #ffd700, #00ff88)';
            luckText.textContent = 'Very lucky!';
        } else if (percentileValue >= 80) {
            luckFill.style.background = 'linear-gradient(90deg, #ffaa00, #ffd700)';
            luckText.textContent = 'Incredible luck!';
        } else if (percentileValue >= 60) {
            luckFill.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
            luckText.textContent = 'Above average luck!';
        } else if (percentileValue >= 40) {
            luckFill.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
            luckText.textContent = 'Average luck';
        } else if (percentileValue >= 20) {
            luckFill.style.background = 'linear-gradient(90deg, #ff6600, #ff8800)';
            luckText.textContent = 'Below average luck';
        } else {
            luckFill.style.background = '#ff4444';
            luckText.textContent = 'Bad luck streak';
        }
    } else {
        // Fallback for insufficient data (less than 50 pulls)
        // Use simple ratio-based calculation
        const actualRate = (totalKitasanCount / totalPulls) * 100;
        const expectedRate = 0.75;
        const luckRatio = actualRate / expectedRate;
        
        // Set width based on how many Kitasan Blacks obtained relative to total pulls
        const widthPercentage = Math.min(Math.max((totalKitasanCount / (totalPulls / 50)) * 20 + 20, 15), 100);
        luckFill.style.width = `${widthPercentage}%`;
        
        if (luckRatio >= 2.0) {
            luckFill.style.background = 'linear-gradient(90deg, #ffd700, #00ff88)';
            luckText.textContent = 'Great luck!';
        } else if (luckRatio >= 1.3) {
            luckFill.style.background = 'linear-gradient(90deg, #ffaa00, #ffd700)';
            luckText.textContent = 'Above average luck!';
        } else if (luckRatio >= 0.7) {
            luckFill.style.background = 'linear-gradient(90deg, #ff8800, #ffaa00)';
            luckText.textContent = 'Average luck';
        } else if (luckRatio >= 0.3) {
            luckFill.style.background = 'linear-gradient(90deg, #ff6600, #ff8800)';
            luckText.textContent = 'Below average luck';
        } else {
            luckFill.style.background = '#ff4444';
            luckText.textContent = 'Bad luck streak';
        }
    }
}

function createCelebrationEffect(kitasanCount = 1) {
    // Scale celebration intensity based on number of Kitasan Blacks (1-5)
    const intensity = Math.min(kitasanCount, 5);
    
    // Base values for 1 Kitasan Black
    const baseParticles = 20;
    const baseSize = 30;
    const baseDuration = 3000;
    const baseSpread = 100; // ms between particles
    
    // Scale factors based on intensity
    const particleCount = baseParticles * intensity; // 20, 40, 60, 80, 100
    const particleSize = baseSize + (intensity - 1) * 8; // 30, 38, 46, 54, 62
    const animationDuration = baseDuration + (intensity - 1) * 1000; // 3s, 4s, 5s, 6s, 7s
    const particleSpread = Math.max(baseSpread - (intensity - 1) * 15, 25); // Faster spawn for higher intensity
    
    // Add firework bursts for 4+ Kitasan Blacks
    if (intensity >= 4) {
        createFireworkBursts(intensity);
    }
    
    // Create golden particles across the screen for rare pulls
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('img');
            particle.src = 'images/karat.png';
            particle.alt = '';
            
            // Add special effects for higher intensities
            let specialEffects = '';
            if (intensity >= 3) {
                specialEffects += `
                    animation: pulse 0.5s ease-in-out infinite alternate;
                `;
            }
            if (intensity >= 5) {
                // Use filter glow instead of box-shadow to avoid clipping issues
                specialEffects += `
                    filter: drop-shadow(0 0 ${15 + intensity * 5}px rgba(255, 215, 0, ${0.9 + intensity * 0.02})) drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ffd700);
                `;
            } else {
                specialEffects += `
                    filter: drop-shadow(0 0 ${15 + intensity * 5}px rgba(255, 215, 0, ${0.9 + intensity * 0.02}));
                `;
            }
            
            particle.style.cssText = `
                position: fixed;
                width: ${particleSize}px;
                height: ${particleSize}px;
                pointer-events: none;
                z-index: 2000;
                left: ${Math.random() * window.innerWidth}px;
                top: -${particleSize}px;
                background: transparent;
                border: none;
                outline: none;
                ${specialEffects}
            `;
            
            document.body.appendChild(particle);
            
            // Add rotation and falling animation
            const rotationSpeed = 360 + (intensity - 1) * 180; // Faster rotation for more Kitasan Blacks
            const fallDistance = window.innerHeight + particleSize + 50;
            
            particle.animate([
                { 
                    transform: 'translateY(0px) rotate(0deg) scale(0.5)', 
                    opacity: 1 
                },
                { 
                    transform: `translateY(${fallDistance}px) rotate(${rotationSpeed}deg) scale(1.2)`, 
                    opacity: 0 
                }
            ], {
                duration: animationDuration + Math.random() * 2000,
                easing: intensity >= 4 ? 'ease-out' : 'ease-in'
            }).onfinish = () => particle.remove();
        }, i * particleSpread);
    }
    
    // Add CSS keyframes for pulse animation if not already added
    if (intensity >= 3 && !document.querySelector('style[data-celebration]')) {
        const style = document.createElement('style');
        style.setAttribute('data-celebration', 'true');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createFireworkBursts(intensity) {
    const burstCount = intensity - 2; // 2 bursts for 4 Kitasan, 3 for 5 Kitasan
    
    for (let burst = 0; burst < burstCount; burst++) {
        setTimeout(() => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2;
            
            // Create burst particles
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const endX = centerX + Math.cos(angle) * distance;
                const endY = centerY + Math.sin(angle) * distance;
                
                const burstParticle = document.createElement('img');
                burstParticle.src = 'images/karat.png';
                burstParticle.alt = '';
                burstParticle.style.cssText = `
                    position: fixed;
                    width: 25px;
                    height: 25px;
                    pointer-events: none;
                    z-index: 2001;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    background: transparent;
                    border: none;
                    outline: none;
                    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
                `;
                
                document.body.appendChild(burstParticle);
                
                burstParticle.animate([
                    { 
                        transform: 'translate(0px, 0px) scale(0.2)',
                        opacity: 1
                    },
                    { 
                        transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(1.5)`,
                        opacity: 0
                    }
                ], {
                    duration: 800,
                    easing: 'ease-out'
                }).onfinish = () => burstParticle.remove();
            }
        }, burst * 300);
    }
}

// Test function to verify roll simulation probabilities
function testRollProbabilities(numTests = 10000) {
    console.log(`Running ${numTests} roll simulations to test probability convergence...`);
    
    const results = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };
    
    let totalKitasanPulled = 0;
    let totalPullsInTest = 0;
    
    // Run the simulation many times
    for (let test = 0; test < numTests; test++) {
        let kitasanInThisRoll = 0;
        
        // Simulate 50 pulls with 0.75% chance each (same as the actual roll function)
        for (let i = 0; i < 50; i++) {
            totalPullsInTest++;
            const random = Math.random();
            if (random < 0.0075) { // 0.75% chance
                kitasanInThisRoll++;
                totalKitasanPulled++;
            }
        }
        
        // Count results (cap at 5+ for display purposes)
        const resultKey = Math.min(kitasanInThisRoll, 5);
        results[resultKey]++;
    }
    
    // Calculate actual percentages
    const actualPercentages = {};
    for (let i = 0; i <= 5; i++) {
        actualPercentages[i] = (results[i] / numTests) * 100;
    }
    
    // Expected percentages (binomial distribution: n=50, p=0.0075)
    const expectedPercentages = {
        0: 69.26,
        1: 26.11,
        2: 4.01,
        3: 0.49,
        4: 0.13,
        5: 0.03 // 4+ combined
    };
    
    // Calculate overall pull rate
    const actualPullRate = (totalKitasanPulled / totalPullsInTest) * 100;
    const expectedPullRate = 0.75;
    
    // Display results
    console.log('\n=== ROLL SIMULATION TEST RESULTS ===');
    console.log(`Total simulations: ${numTests.toLocaleString()}`);
    console.log(`Total pulls: ${totalPullsInTest.toLocaleString()}`);
    console.log(`\nOverall Pull Rate:`);
    console.log(`Expected: ${expectedPullRate}%`);
    console.log(`Actual: ${actualPullRate.toFixed(3)}%`);
    console.log(`Difference: ${(actualPullRate - expectedPullRate).toFixed(3)}%`);
    
    console.log('\nKitasan Blacks per 50-pull roll:');
    console.log('Count | Expected % | Actual % | Difference | Occurrences');
    console.log('------|-----------|----------|-----------|------------');
    
    for (let i = 0; i <= 5; i++) {
        const label = i === 5 ? '5+' : i.toString();
        const diff = actualPercentages[i] - expectedPercentages[i];
        const diffStr = diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
        console.log(`  ${label}   |   ${expectedPercentages[i].toFixed(2)}%   |  ${actualPercentages[i].toFixed(2)}%  |   ${diffStr}%   |   ${results[i].toLocaleString()}`);
    }
    
    // Calculate chi-square test statistic for goodness of fit
    let chiSquare = 0;
    for (let i = 0; i <= 4; i++) { // Don't include 5+ in chi-square as it's a catch-all
        const expected = (expectedPercentages[i] / 100) * numTests;
        const actual = results[i];
        chiSquare += Math.pow(actual - expected, 2) / expected;
    }
    
    console.log(`\nChi-square statistic: ${chiSquare.toFixed(3)}`);
    console.log('(Lower values indicate better fit to expected distribution)');
    
    // Return results for programmatic use
    return {
        numTests,
        actualPercentages,
        expectedPercentages,
        actualPullRate,
        expectedPullRate,
        chiSquare,
        results
    };
}

// Function to run a quick test (can be called from console)
function quickTest() {
    return testRollProbabilities(1000);
}

// Function to run a comprehensive test (can be called from console)
function comprehensiveTest() {
    return testRollProbabilities(50000);
}

// Add test button functionality (for development purposes)
function addTestButton() {
    if (document.getElementById('testButton')) return; // Don't add if already exists
    
    const testButton = document.createElement('button');
    testButton.id = 'testButton';
    testButton.innerHTML = 'Run Probability Test';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px 15px;
        background: #333;
        color: white;
        border: 1px solid #555;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        z-index: 9999;
    `;
    
    testButton.addEventListener('click', () => {
        testButton.textContent = 'Running test...';
        testButton.disabled = true;
        
        setTimeout(() => {
            quickTest();
            testButton.textContent = 'Run Probability Test';
            testButton.disabled = false;
            alert('Test completed! Check the browser console for results.');
        }, 100);
    });
    
    document.body.appendChild(testButton);
}

// Uncomment the line below to add a test button to the page for easy testing
//addTestButton();
