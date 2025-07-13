// Card Pool Configuration - loaded from cards folder
let cardPool = {
    R: [],
    SR: [],
    SSR: []
};

// Rate-up cards
const RATE_UP_CARDS = ['30028-kitasan-black', '30029-satono-diamond'];

// Good cards list (user-specified good cards)
const GOOD_CARDS = [
    // SSR good cards
    '30028-kitasan-black', '30016-super-creek', '30010-fine-motion', 
    '30015-sakura-bakushin-o', '30018-nishino-flower', '30020-biko-pegasus',
    
    // SR good cards
    '20002-daiwa-scarlet', '20008-manhattan-cafe', '20013-eishin-flash', 
    '20014-narita-taishin', '20015-marvelous-sunday', '20016-matikanefukukitaru', 
    '20020-king-halo', '20023-sweep-tosho'
];

// Inventory to track collected cards
let inventory = {};

// Animation counter for card positioning within a roll
let currentRollAnimationIndex = 0;

// Card loading system
async function loadAllCards() {
    try {
        console.log('Loading cards from cards folder...');
        
        // Reset card pool before loading
        cardPool = {
            R: [],
            SR: [],
            SSR: []
        };
        
        // Get all card folders
        const cardFolders = await getCardFolders();
        console.log('Card folders to load:', cardFolders.length);
        
        let loadedCount = 0;
        let skippedCount = 0;
        
        // Load each card
        for (const folder of cardFolders) {
            try {
                const cardData = await loadCard(folder);
                if (cardData && cardData.rarity && cardPool[cardData.rarity]) {
                    cardPool[cardData.rarity].push(cardData);
                    loadedCount++;
                    console.log(`Loaded ${cardData.rarity} card: ${cardData.name} (${cardData.id})`);
                } else {
                    console.warn(`Skipping invalid card data for ${folder}:`, cardData);
                    skippedCount++;
                }
            } catch (error) {
                console.warn(`Failed to load card ${folder}:`, error);
                skippedCount++;
            }
        }
        
        console.log('Cards loaded successfully:', {
            R: cardPool.R.length,
            SR: cardPool.SR.length,
            SSR: cardPool.SSR.length,
            Total: loadedCount,
            Skipped: skippedCount
        });
        
        // Sort cards by name for consistent display
        Object.keys(cardPool).forEach(rarity => {
            cardPool[rarity].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        });
        
    } catch (error) {
        console.error('Failed to load cards:', error);
    }
}

async function getCardFolders() {
    // Since we can't directly read directory contents in the browser,
    // we'll use a predefined list based on what we saw in the directory listing
    return [
        '10001-special-week', '10002-silence-suzuka', '10003-tokai-teio', '10004-maruzensky',
        '10005-oguri-cap', '10006-gold-ship', '10007-vodka', '10008-taiki-shuttle',
        '10009-grass-wonder', '10010-mejiro-mcqueen', '10011-el-condor-pasa', '10012-tm-opera-o',
        '10013-symboli-rudolf', '10014-seiun-sky', '10015-rice-shower', '10016-winning-ticket',
        '10018-sakura-bakushin-o', '10019-super-creek', '10020-haru-urara', '10022-aoi-kiryuin',
        '10023-daiwa-scarlet', '10024-hishi-amazon', '10025-air-groove', '10026-agnes-digital',
        '10028-fine-motion', '10029-biwa-hayahide', '10031-manhattan-cafe', '10032-mihono-bourbon',
        '10033-mejiro-ryan', '10034-yukino-bijin', '10035-ines-fujin', '10036-agnes-tachyon',
        '10037-air-shakur', '10038-eishin-flash', '10039-smart-falcon', '10041-nishino-flower',
        '10042-biko-pegasus', '10044-matikanefukitaru', '10045-meisho-doto', '10046-mejiro-dober',
        '10047-nice-nature', '10049-fuji-kiseki', '10051-twin-turbo', '10052-daitaku-helios',
        '10053-ikuno-dictus', '10054-mejiro-palmer', '20001-fuji-kiseki', '20002-daiwa-scarlet',
        '20003-hishi-amazon', '20004-air-groove', '20005-agnes-digital', '20006-biwa-hayahide',
        '20008-manhattan-cafe', '20009-mihono-bourbon', '20010-mejiro-ryan', '20011-yukino-bijin',
        '20012-agnes-tachyon', '20013-eishin-flash', '20014-narita-taishin', '20015-marvelous-sunday',
        '20016-matikanefukitaru', '20017-meisho-doto', '20018-mejiro-dober', '20019-nice-nature',
        '20020-king-halo', '20021-aoi-kiryuin', '20023-sweep-tosho', '20024-daitaku-helios',
        '30001-special-week', '30002-silence-suzuka', '30005-vodka', '30006-grass-wonder',
        '30007-el-condor-pasa', '30008-seiun-sky', '30009-tamamo-cross', '30010-fine-motion',
        '30011-ines-fujin', '30012-winning-ticket', '30014-gold-city', '30015-sakura-bakushin-o',
        '30016-super-creek', '30017-smart-falcon', '30018-nishino-flower', 
        '30020-biko-pegasus', '30021-tazuna-hayakawa', '30024-oguri-cap',
        '30026-twin-turbo', '30027-mejiro-palmer', '30028-kitasan-black', '30029-satono-diamond'
    ];
}

async function loadCard(cardId) {
    try {
        const response = await fetch(`cards/${cardId}/card.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const cardData = await response.json();
        
        // Extract the numeric ID from the cardId (e.g., "10001" from "10001-special-week")
        const numericId = cardId.split('-')[0];
        
        // Enhanced card object with additional properties
        return {
            id: cardId,
            name: cardData.name || cardId,
            rarity: cardData.rarity,
            type: cardData.type,
            releaseDate: cardData.release_date,
            image: `cards/${cardId}/support_card_s_${numericId}.png`, // Use correct image filename
            isRateUp: RATE_UP_CARDS.includes(cardId)
        };
    } catch (error) {
        console.warn(`Failed to load card ${cardId}:`, error);
        return null;
    }
}



// Load saved data from localStorage
// Enhanced data loading and validation
function loadSavedData() {
    try {
        // Clean up old card pool data from localStorage (no longer needed)
        localStorage.removeItem('umamusume_cardpool');
        
        // Load inventory and validate each card
        const savedInventory = localStorage.getItem('umamusume_inventory');
        if (savedInventory) {
            const parsedInventory = JSON.parse(savedInventory);
            // Validate and clean inventory
            inventory = validateAndCleanInventory(parsedInventory);
            localStorage.setItem('umamusume_inventory', JSON.stringify(inventory));
        }
        
        // Don't load saved card pool - we want to use the fresh loaded cards
        // The saved card pool might be incomplete or outdated
        // const savedCardPool = localStorage.getItem('umamusume_cardpool');
        // if (savedCardPool) {
        //     cardPool = JSON.parse(savedCardPool);
        // }
        
        const savedStats = localStorage.getItem('umamusume_stats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            // Don't load any stats - start fresh each session including Carats
            totalCaratsSpent = 0;
            totalKitasanCount = 0;
            totalPulls = 0;
            // Also reset SSR and good card counts for each session
            totalRCards = 0;
            totalSRCards = 0;
            totalSSRCards = 0;
            totalGoodCards = 0;
            rollHistory = [];
        } else {
            // Initialize if no saved stats
            totalCaratsSpent = 0;
        }
        
        console.log('Saved data loaded and validated successfully');
    } catch (error) {
        console.error('Error loading saved data:', error);
        resetAllData();
    }
}

// Enhanced inventory validation
function validateAndCleanInventory(inventoryData) {
    if (!Array.isArray(inventoryData)) {
        console.warn('Invalid inventory data format, resetting');
        return [];
    }
    
    const validInventory = inventoryData.filter(card => {
        // Check if card has required properties
        if (!card || typeof card !== 'object') {
            console.warn('Removing invalid card object:', card);
            return false;
        }
        
        if (!card.rarity || !['R', 'SR', 'SSR'].includes(card.rarity)) {
            console.warn('Removing card with invalid rarity:', card);
            return false;
        }
        
        if (!card.id || !card.name) {
            console.warn('Removing card with missing id/name:', card);
            return false;
        }
        
        return true;
    });
    
    if (validInventory.length !== inventoryData.length) {
        console.log(`Cleaned inventory: removed ${inventoryData.length - validInventory.length} invalid cards`);
    }
    
    return validInventory;
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('umamusume_inventory', JSON.stringify(inventory));
        // Don't save card pool - it should be loaded fresh from files each time
        // localStorage.setItem('umamusume_cardpool', JSON.stringify(cardPool));
        localStorage.setItem('umamusume_stats', JSON.stringify({
            // Don't save any roll statistics or Carats - start completely fresh each session
        }));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Get total weight for a rarity (simplified since we're using equal weights)
function getTotalWeight(rarity) {
    return cardPool[rarity].length;
}

// Select a random card from a rarity pool with rate-up consideration
function selectRandomCard(rarity) {
    const cards = cardPool[rarity];
    if (!cards || cards.length === 0) {
        console.error('No cards found for rarity:', rarity);
        return null;
    }
    
    // Special handling for SSR rate-up
    if (rarity === 'SSR') {
        // 50% chance for rate-up cards, 50% chance for other SSRs
        const useRateUp = Math.random() < 0.5;
        
        if (useRateUp) {
            // Pick from rate-up cards only
            const rateUpCards = cards.filter(card => card.isRateUp);
            if (rateUpCards.length > 0) {
                const selectedCard = rateUpCards[Math.floor(Math.random() * rateUpCards.length)];
                console.log('Selected rate-up SSR card:', selectedCard);
                return selectedCard;
            }
        }
        
        // Pick from non-rate-up cards or fallback to all cards
        const nonRateUpCards = cards.filter(card => !card.isRateUp);
        const poolToUse = nonRateUpCards.length > 0 ? nonRateUpCards : cards;
        const selectedCard = poolToUse[Math.floor(Math.random() * poolToUse.length)];
        console.log('Selected regular SSR card:', selectedCard);
        return selectedCard;
    }
    
    // For R and SR, just pick randomly
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    console.log(`Selected ${rarity} card:`, selectedCard);
    return selectedCard;
}

// Add card to inventory
function addCardToInventory(card, showAnimation = true, pullCount = 50, ssrCardsInRoll = 0) {
    if (!card || !card.id) {
        console.warn('Attempted to add invalid card to inventory:', card);
        return;
    }
    
    console.log('Adding card to inventory:', card);
    
    // Check if this should trigger a flying animation
    let shouldAnimate = false;
    
    if (!inventory[card.id]) {
        // First time getting this card
        inventory[card.id] = {
            id: card.id,
            name: card.name || card.id,
            rarity: card.rarity || 'R',
            type: card.type || null,
            image: card.image || '',
            isRateUp: card.isRateUp || false,
            count: 0
        };
        
        // Animate if it's the first SSR card, any rate-up card, or SR under special conditions
        if (showAnimation && (card.rarity === 'SSR' || card.isRateUp)) {
            shouldAnimate = true;
        } else if (showAnimation && card.rarity === 'SR' && pullCount <= 20) {
            // Show SR animations only for small pulls (20 or less)
            shouldAnimate = true;
        }
    } else {
        // Not the first time, but animate if it's a rate-up card or SR under special conditions
        if (showAnimation && card.isRateUp) {
            shouldAnimate = true;
        } else if (showAnimation && card.rarity === 'SR' && pullCount <= 20) {
            // Show SR animations only for small pulls (20 or less)
            shouldAnimate = true;
        }
    }
    
    inventory[card.id].count++;
    console.log('Updated inventory:', inventory);
    saveData();
    updateInventoryCount();
    
    // Trigger animation if qualifying card
    if (shouldAnimate) {
        // Use the current roll animation counter for positioning
        const cardIndex = currentRollAnimationIndex;
        currentRollAnimationIndex++; // Increment for next card in this roll
        
        const baseDelay = 300 + (cardIndex * 400); // 400ms between each card
        setTimeout(() => {
            createFlyingCardAnimation(card, cardIndex);
        }, baseDelay);
    }
}

// Update inventory count in the UI
function updateInventoryCount() {
    const inventoryCountElement = document.getElementById('inventoryCount');
    if (inventoryCountElement) {
        // Display total Carats spent with thousands separator
        inventoryCountElement.textContent = totalCaratsSpent.toLocaleString();
    }
}

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

// Enhanced initialization
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
//         { transform: 'translateY(0px)', opacity: 1 },
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
//         { transform: 'translate(0px, 0px) scale(0) rotate(0deg)', opacity: 1, filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))' },
            { transform: `translate(${x}px, ${y}px) scale(1.5) rotate(180deg)`, opacity: 0, filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 1))' }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

// Roll simulator variables
let totalKitasanCount = 0;
let totalPulls = 0;
let totalRCards = 0;
let totalSRCards = 0;
let totalSSRCards = 0;
let totalGoodCards = 0;
let totalCaratsSpent = 0;
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
    totalRCards = 0;
    totalSRCards = 0;
    totalSSRCards = 0;
    totalGoodCards = 0;
    totalCaratsSpent = 0;
    rollHistory = [];
    inventory = {}; // Clear inventory
    
    // Update display
    updateStats();
    updateLuckMeter();
    updateInventoryCount();
    
    // Save cleared data
    saveData();
    
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
        // Reset animation counter for this roll
        currentRollAnimationIndex = 0;
        
        let kitasanPulled = 0;
        let rCardsThisRoll = 0;
        let srCardsThisRoll = 0;
        let ssrCardsThisRoll = 0;
        let goodCardsThisRoll = 0;
        
        // Perform pulls with 3-stage gacha system
        for (let i = 0; i < pullCount; i++) {
            totalPulls++;
            totalCaratsSpent += 150; // Each pull costs 150 Carats
            const pullNumber = totalPulls;
            
            // Stage 1: Determine rarity based on pull number
            let rarity;
            const random = Math.random();
            
            if (pullNumber % 10 === 0) {
                // Multiple of 10: 97% SR, 3% SSR
                if (random < 0.97) {
                    rarity = 'SR';
                } else {
                    rarity = 'SSR';
                }
            } else {
                // Not multiple of 10: 79% R, 18% SR, 3% SSR
                if (random < 0.79) {
                    rarity = 'R';
                } else if (random < 0.97) { // 0.79 + 0.18 = 0.97
                    rarity = 'SR';
                } else {
                    rarity = 'SSR';
                }
            }
            
            // Stage 2: Update counters based on rarity and select specific card
            if (rarity === 'R') {
                totalRCards++;
                rCardsThisRoll++;
                
                // Select and add R card to inventory
                const selectedCard = selectRandomCard('R');
                if (selectedCard) {
                    addCardToInventory(selectedCard, true, pullCount, ssrCardsThisRoll);
                    // Check if it's a good card
                    if (GOOD_CARDS.includes(selectedCard.id)) {
                        goodCardsThisRoll++;
                        totalGoodCards++;
                    }
                }
            } else if (rarity === 'SR') {
                totalSRCards++;
                srCardsThisRoll++;
                
                // Select and add SR card to inventory
                const selectedCard = selectRandomCard('SR');
                if (selectedCard) {
                    addCardToInventory(selectedCard, true, pullCount, ssrCardsThisRoll);
                    // Check if it's a good card
                    if (GOOD_CARDS.includes(selectedCard.id)) {
                        goodCardsThisRoll++;
                        totalGoodCards++;
                    }
                }
            } else if (rarity === 'SSR') {
                totalSSRCards++;
                ssrCardsThisRoll++;
                
                // Stage 3: Select specific SSR card with rate-up consideration
                const selectedCard = selectRandomCard('SSR');
                if (selectedCard) {
                    addCardToInventory(selectedCard, true, pullCount, ssrCardsThisRoll);
                    
                    // Check if it's Kitasan Black specifically
                    if (selectedCard.id === '30028-kitasan-black') {
                        kitasanPulled++;
                        totalKitasanCount++;
                    }
                    
                    // Check if it's a good card (all SSRs are considered good)
                    if (GOOD_CARDS.includes(selectedCard.id)) {
                        goodCardsThisRoll++;
                        totalGoodCards++;
                    }
                }
            }
        }
        
        // Store this roll result
        rollHistory.push({
            rollNumber: rollHistory.length + 1,
            kitasanCount: kitasanPulled,
            rCards: rCardsThisRoll,
            srCards: srCardsThisRoll,
            ssrCards: ssrCardsThisRoll,
            goodCards: goodCardsThisRoll,
            pullCount: pullCount
        });
        
        // Update display
        updateStats();
        showRollResult(kitasanPulled, rCardsThisRoll, srCardsThisRoll, ssrCardsThisRoll, pullCount);
        updateLuckMeter();
        
        // Re-enable button
        button.disabled = false;
        updateButtonText();
    }, 1500);
}

function updateStats() {
    document.getElementById('kitasanCount').textContent = totalKitasanCount;
    document.getElementById('totalPulls').textContent = totalPulls;
    
    // Update additional stats if elements exist
    const rCardElement = document.getElementById('rCardCount');
    const srCardElement = document.getElementById('srCardCount');
    const ssrCardElement = document.getElementById('ssrCardCount');
    const goodCardElement = document.getElementById('goodCardCount');
    
    if (rCardElement) rCardElement.textContent = totalRCards;
    if (srCardElement) srCardElement.textContent = totalSRCards;
    if (ssrCardElement) ssrCardElement.textContent = totalSSRCards;
    if (goodCardElement) goodCardElement.textContent = totalGoodCards;
    
    // Save data after updating stats
    saveData();
}

function showRollResult(kitasanPulled, rCards, srCards, ssrCards, pullCount = 50) {
    const resultsDiv = document.getElementById('rollResults');
    const resultText = document.getElementById('resultText');
    const percentileText = document.getElementById('percentileText');
    
    let message = '';
    let percentile = '';
    
    // Calculate percentile based on Kitasan Black pulls (SSR rate * 25% chance)
    percentile = calculatePercentile(kitasanPulled, pullCount);
    
    // Extract the percentile rank for determining message tone
    const percentileMatch = percentile.match(/([\d.]+)(?:st|nd|rd|th) percentile/);
    let percentileValue = 50; // Default to median
    
    if (percentileMatch) {
        percentileValue = parseFloat(percentileMatch[1]);
    }
    
    // Generate message based on results
    if (kitasanPulled === 0) {
        if (ssrCards === 0) {
            if (pullCount <= 20 && srCards > 0) {
                message = `💔 No SSRs this time... but got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
            } else {
                message = `💔 No SSRs this time...`;
            }
        } else {
            message = `😐 ${ssrCards} SSR${ssrCards > 1 ? 's' : ''} but no Kitasan Black...`;
            // Show SR info only for small pulls (20 or less)
            if (pullCount <= 20 && srCards > 0) {
                message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
            }
        }
        
        // Show nokitasan.gif for especially painful rolls (100+ pulls with 0 results)
        if (pullCount >= 100) {
            showNoKitasanGif();
        }
    } else if (percentileValue <= 25) {
        // Bad luck (bottom 25%)
        if (kitasanPulled === 1) {
            message = `😐 Got 1 Kitasan Black!`;
        } else {
            message = `😐 Got ${kitasanPulled} Kitasan Blacks!`;
        }
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
    } else if (percentileValue <= 75) {
        // Average luck (25th-75th percentile)
        if (kitasanPulled === 1) {
            message = `🙂 Got 1 Kitasan Black!`;
        } else {
            message = `🙂 Got ${kitasanPulled} Kitasan Blacks!`;
        }
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
    } else if (percentileValue <= 90) {
        // Good luck (75th-90th percentile)
        if (kitasanPulled === 1) {
            message = `😊 Got 1 Kitasan Black! Good luck!`;
        } else {
            message = `🎉 Got ${kitasanPulled} Kitasan Blacks! Good luck!`;
        }
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
    } else if (percentileValue <= 99) {
        // Very lucky (90th-99th percentile)
        if (kitasanPulled === 1) {
            message = `🌟 Got 1 Kitasan Black! Very lucky!`;
        } else {
            message = `🌟 Amazing! ${kitasanPulled} Kitasan Blacks!`;
        }
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
    } else if (percentileValue <= 99.9) {
        // Extremely lucky (99th-99.9th percentile)
        message = `✨ INCREDIBLE! ${kitasanPulled} Kitasan Black${kitasanPulled > 1 ? 's' : ''}!`;
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
    } else {
        // Legendary luck (99.9th+ percentile)
        message = `🎆 LEGENDARY! ${kitasanPulled} Kitasan Black${kitasanPulled > 1 ? 's' : ''}!`;
        // Show SR info only for small pulls (20 or less)
        if (pullCount <= 20 && srCards > 0) {
            message += ` Also got ${srCards} SR${srCards > 1 ? 's' : ''}!`;
        }
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
    
    // Effective Kitasan Black rate: 3% SSR * 25% Kitasan = 0.75%
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

// Calculate percentiles for all three factors
function calculateMultiFactorPercentiles(kitasanCount, ssrCount, goodCount, pullCount = 50) {
    function binomialProbability(n, k, p) {
        if (k > n) return 0;
        if (k === 0) return Math.pow(1 - p, n);
        if (k === n) return Math.pow(p, n);
        
        // Use log space for numerical stability with large numbers
        function logBinomialCoeff(n, k) {
            if (k > n - k) k = n - k; // Take advantage of symmetry
            let result = 0;
            for (let i = 0; i < k; i++) {
                result += Math.log(n - i) - Math.log(i + 1);
            }
            return result;
        }
        
        const logProb = logBinomialCoeff(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
        return Math.exp(logProb);
    }
    
    function calculateCumulativePercentile(count, probability) {
        // For large numbers of pulls, use normal approximation to avoid overflow
        if (pullCount > 1000) {
            // Normal approximation with continuity correction
            const mean = pullCount * probability;
            const variance = pullCount * probability * (1 - probability);
            const stdDev = Math.sqrt(variance);
            
            // Z-score with continuity correction
            const z = (count + 0.5 - mean) / stdDev;
            
            // Cumulative standard normal distribution approximation
            const erf = (x) => {
                // Abramowitz and Stegun approximation
                const a1 =  0.254829592;
                const a2 = -0.284496736;
                const a3 =  1.421413741;
                const a4 = -1.453152027;
                const a5 =  1.061405429;
                const p  =  0.3275911;
                
                const sign = x >= 0 ? 1 : -1;
                x = Math.abs(x);
                
                const t = 1.0 / (1.0 + p * x);
                const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
                
                return sign * y;
            };
            
            const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));
            return Math.min(Math.max(cdf * 100, 0), 100);
        }
        
        // For smaller numbers, use exact binomial calculation
        let cumulativeProbability = 0;
        for (let i = 0; i <= count; i++) {
            cumulativeProbability += binomialProbability(pullCount, i, probability);
        }
        return cumulativeProbability * 100;
    }
    
    // Probability rates
    const kitasanRate = 0.0075; // 0.75% (3% SSR * 25% Kitasan)
    const ssrRate = 0.03; // 3% SSR rate
    const goodCardRate = 0.0954; // 7.8% good card rate (adjusted based on percentile distribution analysis)
    
    // Calculate percentiles
    const kitasanPercentile = calculateCumulativePercentile(kitasanCount, kitasanRate);
    const ssrPercentile = calculateCumulativePercentile(ssrCount, ssrRate);
    const goodCardPercentile = calculateCumulativePercentile(goodCount, goodCardRate);
    
    return {
        kitasan: Math.min(kitasanPercentile, 100),
        ssr: Math.min(ssrPercentile, 100),
        goodCards: Math.min(goodCardPercentile, 100)
    };
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
    
    // Update multi-factor percentile bars
    updatePercentileBars();
    
    if (totalKitasanCount === 0 && totalPulls > 0) {
        // Show minimal red bar for no success
        luckFill.style.clipPath = 'inset(0 85% 0 0)';
        luckFill.style.background = '#ff4444';
        luckText.textContent = 'Keep trying!';
    } else if (totalPulls === 0) {
        // Show minimal gray bar for no attempts
        luckFill.style.clipPath = 'inset(0 95% 0 0)';
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
        
        // Use clip-path to show only the portion of the gradient up to the percentile
        const clipPercentage = Math.max(percentileValue, 5); // Minimum 5% for visibility
        const rightClip = 100 - clipPercentage;
        luckFill.style.clipPath = `inset(0 ${rightClip}% 0 0)`;
        
        // Always use the full gradient - clip-path will mask it appropriately
        luckFill.style.background = 'linear-gradient(90deg, #ff6600, #ffaa00, #ffd700, #00ff88, #ff69b4)';
        
        // Set text based on percentile thresholds
        if (percentileValue >= 99.9) {
            luckText.textContent = 'Legendary luck!';
        } else if (percentileValue >= 99) {
            luckText.textContent = 'Extremely lucky!';
        } else if (percentileValue >= 95) {
            luckText.textContent = 'Very lucky!';
        } else if (percentileValue >= 80) {
            luckText.textContent = 'Incredible luck!';
        } else if (percentileValue >= 60) {
            luckText.textContent = 'Good luck!';
        } else if (percentileValue >= 40) {
            luckText.textContent = 'Average luck';
        } else if (percentileValue >= 20) {
            luckText.textContent = 'Below average luck';
        } else {
            luckText.textContent = 'Bad luck streak';
        }
    } else {
        // Fallback for insufficient data (less than 50 pulls)
        // Use simple ratio-based calculation
        const actualRate = (totalKitasanCount / totalPulls) * 100;
        const expectedRate = 0.75;
        const luckRatio = actualRate / expectedRate;
        
        // Set clip-path based on how many Kitasan Blacks obtained relative to total pulls
        const clipPercentage = Math.min(Math.max((totalKitasanCount / (totalPulls / 50)) * 20 + 20, 15), 100);
        const rightClip = 100 - clipPercentage;
        luckFill.style.clipPath = `inset(0 ${rightClip}% 0 0)`;
        
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

// New function to update the percentile bar graphs
function updatePercentileBars() {
    if (totalPulls < 10) return; // Need some data to show meaningful percentiles
    
    const percentiles = calculateMultiFactorPercentiles(totalKitasanCount, totalSSRCards, totalGoodCards, totalPulls);
    
    // Update Kitasan percentile bar
    updatePercentileBar('kitasan', percentiles.kitasan, totalKitasanCount, '#ff69b4');
    
    // Update SSR percentile bar  
    updatePercentileBar('ssr', percentiles.ssr, totalSSRCards, '#ffd700');
    
    // Update Good Cards percentile bar
    updatePercentileBar('goodCards', percentiles.goodCards, totalGoodCards, '#00ff88');
}

function updatePercentileBar(category, percentile, count, color) {
    const barContainer = document.getElementById(`${category}PercentileBar`);
    const barFill = document.getElementById(`${category}BarFill`);
    const barText = document.getElementById(`${category}BarText`);
    const barValue = document.getElementById(`${category}BarValue`);
    
    if (!barContainer) {
        // Create the bar if it doesn't exist
        createPercentileBar(category, color);
        return updatePercentileBar(category, percentile, count, color);
    }
    
    // Update the bar fill
    const fillPercentage = Math.max(percentile, 2); // Minimum 2% for visibility
    barFill.style.width = `${fillPercentage}%`;
    barFill.style.background = color;
    
    // Update text
    const categoryNames = {
        kitasan: 'Kitasan Black',
        ssr: 'SSR Cards', 
        goodCards: 'Good Cards'
    };
    
    barText.textContent = categoryNames[category];
    barValue.textContent = `${count} (${percentile.toFixed(1)}%)`;
}

function createPercentileBar(category, color) {
    // Find or create the percentile bars container
    let barsContainer = document.getElementById('percentileBarsContainer');
    if (!barsContainer) {
        barsContainer = document.createElement('div');
        barsContainer.id = 'percentileBarsContainer';
        barsContainer.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Insert after the luck meter
        const luckMeter = document.querySelector('.luck-meter');
        if (luckMeter) {
            luckMeter.parentNode.insertBefore(barsContainer, luckMeter.nextSibling);
        }
    }
    
    // Create the individual bar
    const barContainer = document.createElement('div');
    barContainer.id = `${category}PercentileBar`;
    barContainer.style.cssText = `
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;
    
    const barWrapper = document.createElement('div');
    barWrapper.style.cssText = `
        flex: 1;
        height: 25px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        margin: 0 10px;
        position: relative;
        overflow: hidden;
    `;
    
    const barFill = document.createElement('div');
    barFill.id = `${category}BarFill`;
    barFill.style.cssText = `
        height: 100%;
        width: 0%;
        background: ${color};
        border-radius: 12px;
        transition: width 0.5s ease;
    `;
    
    const barText = document.createElement('span');
    barText.id = `${category}BarText`;
    barText.style.cssText = `
        color: white;
        font-weight: bold;
        min-width: 100px;
        text-align: left;
    `;
    
    const barValue = document.createElement('span');
    barValue.id = `${category}BarValue`;
    barValue.style.cssText = `
        color: white;
        font-weight: bold;
        min-width: 100px;
        text-align: right;
    `;
    
    barWrapper.appendChild(barFill);
    barContainer.appendChild(barText);
    barContainer.appendChild(barWrapper);
    barContainer.appendChild(barValue);
    barsContainer.appendChild(barContainer);
}

function showNoKitasanGif() {
    // Find the roll simulator container
    const rollSimulator = document.querySelector('.roll-simulator');
    if (!rollSimulator) return;
    
    // Create the scrolling GIF element
    const gif = document.createElement('img');
    gif.src = 'images/nokitasan.gif';
    gif.alt = 'No Kitasan';
    gif.style.cssText = `
        position: absolute;
        width: 120px;
        height: auto;
        right: -150px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        opacity: 1;
        pointer-events: none;
        border-radius: 8px;
        filter: drop-shadow(0 0 10px rgba(255, 68, 68, 0.6));
        transition: right 0.5s ease-out;
    `;
    
    // Make sure roll simulator has relative positioning
    const originalPosition = rollSimulator.style.position;
    rollSimulator.style.position = 'relative';
    rollSimulator.appendChild(gif);
    
    // Phase 1: Slide onto screen
    requestAnimationFrame(() => {
        gif.style.right = '20px'; // Slide to visible position
    });
    
    // Phase 2: Wait a moment, then slide off
    setTimeout(() => {
        gif.style.transition = 'right 0.8s ease-in, opacity 0.3s ease';
        gif.style.right = 'calc(100% + 30px)'; // Slide off left side
        gif.style.opacity = '0';
    }, 1500); // Wait 1.5 seconds before sliding off
    
    // Phase 3: Remove the element after animation completes
    setTimeout(() => {
        if (rollSimulator.contains(gif)) {
            rollSimulator.removeChild(gif);
            // Restore original position if it was empty
            if (!originalPosition) {
                rollSimulator.style.position = '';
            }
        }
    }, 2500); // Total duration: 1.5s pause + 0.8s slide off + 0.2s buffer
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
    
    // Add good card test button
    const goodCardTestButton = document.createElement('button');
    goodCardTestButton.id = 'goodCardTestButton';
    goodCardTestButton.innerHTML = 'Test Good Cards (7.8%)';
    goodCardTestButton.style.cssText = `
        position: fixed;
        top: 60px;
        right: 10px;
        padding: 10px 15px;
        background: #006600;
        color: white;
        border: 1px solid #008800;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        z-index: 9999;
    `;
    
    goodCardTestButton.addEventListener('click', () => {
        goodCardTestButton.textContent = 'Running test...';
        goodCardTestButton.disabled = true;
        
        setTimeout(() => {
            debugGoodCardPercentiles();
            testGoodCards();
            goodCardTestButton.textContent = 'Test Good Cards (7.8%)';
            goodCardTestButton.disabled = false;
            alert('Good card test completed! Check the browser console for detailed results.');
        }, 100);
    });
    
    document.body.appendChild(testButton);
    document.body.appendChild(goodCardTestButton);
}

// Inventory Modal Management
function initInventoryModal() {
    const inventoryButton = document.getElementById('inventoryButton');
    const inventoryModal = document.getElementById('inventoryModal');
    const closeInventory = document.getElementById('closeInventory');
    const clearInventoryBtn = document.getElementById('clearInventoryBtn');
    
    // Open inventory modal
    if (inventoryButton) {
        inventoryButton.addEventListener('click', () => {
            openInventoryModal();
        });
    }
    
    // Close modal handlers
    if (closeInventory) {
        closeInventory.addEventListener('click', () => {
            inventoryModal.style.display = 'none';
        });
    }
    
    // Clear inventory button
    if (clearInventoryBtn) {
        clearInventoryBtn.addEventListener('click', () => {
            clearInventory();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === inventoryModal) {
            inventoryModal.style.display = 'none';
        }
    });
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Card pool management
    initCardPoolManagement();
}

function openInventoryModal() {
    const inventoryModal = document.getElementById('inventoryModal');
    inventoryModal.style.display = 'block';
    renderCollection();
    renderCardPool();
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Refresh content based on active tab
    if (tabName === 'collection') {
        renderCollection();
    } else if (tabName === 'cardpool') {
        renderCardPool();
    }
}

function renderCollection() {
    const cardCollection = document.getElementById('cardCollection');
    const ssrCount = document.getElementById('ssrCollectionCount');
    const srCount = document.getElementById('srCollectionCount');
    const totalCount = document.getElementById('totalCollectionCount');
    const caratsSpentElement = document.getElementById('totalCaratsSpent');
    const usdValueElement = document.getElementById('totalUSDValue');
    
    // Update summary stats - filter out invalid cards
    const inventoryCards = Object.values(inventory).filter(card => card && card.rarity);
    const ssrCards = inventoryCards.filter(card => card.rarity === 'SSR');
    const srCards = inventoryCards.filter(card => card.rarity === 'SR');
    const rCards = inventoryCards.filter(card => card.rarity === 'R');
    
    ssrCount.textContent = ssrCards.length;
    srCount.textContent = srCards.length;
    totalCount.textContent = inventoryCards.length;
    
    // Update Carats spent and USD value
    if (caratsSpentElement) {
        caratsSpentElement.textContent = totalCaratsSpent.toLocaleString();
    }
    if (usdValueElement) {
        // Calculate USD value: $70 for 5000 Carats
        const usdValue = (totalCaratsSpent / 5000) * 70;
        usdValueElement.textContent = `$${usdValue.toFixed(2)}`;
    }
    
    // Clean up invalid cards from inventory
    const invalidCards = Object.keys(inventory).filter(id => {
        const card = inventory[id];
        return !card || !card.rarity || !card.name;
    });
    
    if (invalidCards.length > 0) {
        console.warn(`Removing ${invalidCards.length} invalid cards from inventory:`, invalidCards);
        invalidCards.forEach(id => delete inventory[id]);
        saveData();
    }
    
    // Render cards
    if (inventoryCards.length === 0) {
        cardCollection.innerHTML = `
            <div class="empty-collection">
                <p>No cards collected yet!</p>
                <p>Start rolling to build your collection.</p>
            </div>
        `;
        return;
    }
    
    // Sort cards by rarity (SSR first), then by rate-up status, then by name
    inventoryCards.sort((a, b) => {
        const rarityOrder = { 'SSR': 3, 'SR': 2, 'R': 1 };
        const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity];
        if (rarityDiff !== 0) return rarityDiff;
        
        // Within same rarity, rate-up cards come first
        const rateUpDiff = (b.isRateUp ? 1 : 0) - (a.isRateUp ? 1 : 0);
        if (rateUpDiff !== 0) return rateUpDiff;
        
        return (a.name || '').localeCompare(b.name || '');
    });
    
    cardCollection.innerHTML = inventoryCards.map(card => {
        const rarityClass = (card.rarity || 'R').toLowerCase();
        const isRateUp = card.isRateUp ? ' 🔥' : '';
        const cardName = card.name || card.id || 'Unknown Card';
        const typeIcon = getTypeIcon(card.type);
        
        return `
            <div class="collection-card ${rarityClass}">
                <div class="collection-card-image" style="position: relative;">
                    ${card.image ? `<img src="${card.image}" alt="${cardName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 24px;">🎴</div>` : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎴</div>'}
                    ${typeIcon ? `<div class="type-icon-overlay" style="position: absolute; top: 0; right: 0; z-index: 10;"><img src="${typeIcon}" alt="${card.type}" class="type-icon-img" style="width: 20px; height: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));"></div>` : ''}
                </div>
                <div class="collection-card-name" title="${cardName}">${cardName}${isRateUp}</div>
                <div class="collection-card-count">×${card.count || 1}</div>
            </div>
        `;
    }).join('');
}

function renderCardPool() {
    // Display loaded card pool information
    renderCardPoolRarity('R');
    renderCardPoolRarity('SR');
    renderCardPoolRarity('SSR');
}

function renderCardPoolRarity(rarity) {
    const container = document.getElementById(`${rarity.toLowerCase()}CardPool`);
    if (!container) return;
    
    const cards = cardPool[rarity] || [];
    
    if (rarity === 'SSR') {
        // Special handling for SSR cards - prioritize rate-up cards first
        const rateUpCards = cards.filter(card => card.isRateUp);
        const nonRateUpCards = cards.filter(card => !card.isRateUp);
        
        // Sort rate-up cards by name, then non-rate-up cards by name
        rateUpCards.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        nonRateUpCards.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        const allCards = [...rateUpCards, ...nonRateUpCards];
        
        container.innerHTML = `
            <div class="pool-info">
                <h4>${rarity} Cards (${cards.length} total)</h4>
                <div class="card-pool-stats">
                    <div class="rate-up-info">
                        <p><strong>Rate-up Cards (50% of SSR pulls):</strong></p>
                        <ul>
                            ${cards.filter(card => card.isRateUp).map(card => `<li>${card.name}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="scrollable-card-grid">
                        ${allCards.map(card => createCardDisplay(card)).join('')}
                    </div>
                </div>
            </div>
        `;
    } else {
        // Standard display for R and SR cards - prioritize rate-up cards first
        const rateUpCards = cards.filter(card => card.isRateUp);
        const nonRateUpCards = cards.filter(card => !card.isRateUp);
        
        // Sort both groups by name
        rateUpCards.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        nonRateUpCards.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        const sortedCards = [...rateUpCards, ...nonRateUpCards];
        
        container.innerHTML = `
            <div class="pool-info">
                <h4>${rarity} Cards (${cards.length} total)</h4>
                <div class="card-pool-stats">
                    <div class="scrollable-card-grid">
                        ${sortedCards.map(card => createCardDisplay(card)).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

function createCardDisplay(card) {
    const typeIcon = getTypeIcon(card.type);
    const isRateUp = card.isRateUp ? ' rate-up' : '';
    
    return `

        <div class="pool-card${isRateUp}">
            <div class="card-image-container${isRateUp}">
                <img src="${card.image}" alt="${card.name}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIzMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🎴</3RleHQ+PC9zdmc+'">
                ${typeIcon ? `<div class="type-icon-overlay"><img src="${typeIcon}" alt="${card.type}" class="type-icon-img"></div>` : ''}
            </div>
            <div class="card-name">${card.name}</div>
        </div>
    `;
}

function getTypeIcon(type) {
    const typeIcons = {
        'Speed': 'images/speed.png',
        'Stamina': 'images/stamina.png', 
        'Power': 'images/power.png',
        'Guts': 'images/guts.png',
        'Wit': 'images/wit.png',
        'Friend': 'images/friend.png',
        'Group': 'images/group.png',
    };
    
    // Check if type exists and flag error if not found
    if (type && !typeIcons[type]) {
        console.error(`Unknown card type "${type}" - no matching type icon found. Available types:`, Object.keys(typeIcons));
    }
    
    return typeIcons[type] || null;
}

// Card Pool Management
function initCardPoolManagement() {
    // Card pool management functionality removed
    // No import/export buttons needed for card pool tab
}

function clearInventory() {
    inventory = {};
    saveData();
    updateInventoryCount();
    renderCollection();
}

// Animation for cards flying to inventory
function createFlyingCardAnimation(card, cardIndex = 0) {
    // Get the inventory button position
    const inventoryButton = document.getElementById('inventoryButton');
    if (!inventoryButton) return;
    
    const inventoryRect = inventoryButton.getBoundingClientRect();
    const targetX = inventoryRect.left + inventoryRect.width / 2;
    const targetY = inventoryRect.top + inventoryRect.height / 2;
    
    // Calculate starting position with spread for multiple cards
    const baseX = window.innerWidth / 2;
    const baseY = window.innerHeight / 2;
    const spreadX = (cardIndex % 3 - 1) * 150; // Spread horizontally: -150, 0, 150
    const spreadY = Math.floor(cardIndex / 3) * 80 - 40; // Spread vertically for rows
    
    // Create the flying card element
    const flyingCard = document.createElement('div');
    flyingCard.style.cssText = `
        position: fixed;
        width: 120px;
        height: 160px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border: 2px solid ${card.rarity === 'SSR' ? '#ffd700' : card.isRateUp ? '#ff6b35' : '#4a90e2'};
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        pointer-events: none;
        box-shadow: 0 8px 25px rgba(0,0,0,0.5);
        left: ${baseX + spreadX}px;
        top: ${baseY + spreadY}px;
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
    `;
    
    // Add card content
    flyingCard.innerHTML = `
        <div style="width: 90%; height: 70%; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
            <img src="${card.image}" alt="${card.name}" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIzMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+🎴</3RleHQ+PC9zdmc+'">
        </div>
        <div style="font-size: 10px; font-weight: bold; color: white; text-align: center; padding: 0 4px;">
            ${card.name}
        </div>
        <div style="font-size: 8px; color: ${card.rarity === 'SSR' ? '#ffd700' : card.rarity === 'SR' ? '#9b59b6' : '#95a5a6'}; font-weight: bold;">
            ${card.rarity}${card.isRateUp ? ' ⭐' : ''}
        </div>
    `;
    
    // Add special effects for rate-up cards
    if (card.isRateUp) {
        flyingCard.style.boxShadow = '0 8px 25px rgba(255,107,53,0.6), 0 0 20px rgba(255,107,53,0.4)';
    }
    
    // Add special effects for SSR cards
    if (card.rarity === 'SSR') {
        flyingCard.style.boxShadow = '0 8px 25px rgba(255,215,0,0.6), 0 0 20px rgba(255,215,0,0.4)';
    }
    
    document.body.appendChild(flyingCard);
    
    // Animation sequence
    // Phase 1: Fade in and scale up
    setTimeout(() => {
        flyingCard.style.transition = 'all 0.3s ease-out';
        flyingCard.style.transform = 'translate(-50%, -50%) scale(1)';
        flyingCard.style.opacity = '1';
    }, 50);
    
    // Phase 2: Stay visible for longer to see the card
    setTimeout(() => {
        flyingCard.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        flyingCard.style.left = targetX + 'px';
        flyingCard.style.top = targetY + 'px';
        flyingCard.style.transform = 'translate(-50%, -50%) scale(0.1)';
        flyingCard.style.opacity = '0.8';
    }, 1500); // Stay on screen for 1.5 seconds
    
    // Phase 3: Remove the element after animation
    setTimeout(() => {
        if (document.body.contains(flyingCard)) {
            document.body.removeChild(flyingCard);
        }
        
        // Add a small pulse effect to the inventory button
        if (inventoryButton) {
            inventoryButton.style.transform = 'scale(1.1)';
            inventoryButton.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                inventoryButton.style.transform = '';
            }, 200);
        }
    }, 3200); // Total duration: 50ms + 1500ms display + 1500ms fly + 150ms buffer
    
    // Create trailing particles
    createCardTrailParticles(card, baseX + spreadX, baseY + spreadY);
}

function createCardTrailParticles(card, startX = window.innerWidth / 2, startY = window.innerHeight / 2) {
    const particleCount = card.rarity === 'SSR' ? 8 : card.isRateUp ? 6 : 4;
    const particleColor = card.rarity === 'SSR' ? '#ffd700' : card.isRateUp ? '#ff6b35' : '#4a90e2';
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${particleColor};
                border-radius: 50%;
                left: ${startX}px;
                top: ${startY}px;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 2999;
                opacity: 1;
                box-shadow: 0 0 10px ${particleColor};
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle following the card path
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'ease-out'
            }).onfinish = () => {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            };
        }, i * 100);
    }
}

// Enhanced initialization
async function initializeApp() {
    // Load cards first
    await loadAllCards();
    
    // Load saved data after cards are loaded
    loadSavedData();
    
    // Initialize existing systems
    init(); // Original countdown initialization
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
    
    // Initialize new inventory system
    initInventoryModal();
    updateInventoryCount();
    updateStats();
    updateLuckMeter();
    
    console.log('Umamusume Roll Simulator initialized with dynamic card pool!');
}

// Replace the old initialization
document.addEventListener('DOMContentLoaded', initializeApp);

// Test function for flying card animation (for development purposes)
function testFlyingCardAnimation() {
    const testCard = {
        id: '30028-kitasan-black',
        name: 'Kitasan Black',
        rarity: 'SSR',
        type: 'Speed',
        image: 'cards/30028-kitasan-black/support_card_s_30028.png',
        isRateUp: true
    };
    
    console.log('Testing flying card animation with:', testCard);
    createFlyingCardAnimation(testCard, 0);
}

// Function to test good card percentile distribution
function testGoodCardPercentiles(numTests = 10000, pullCount = 50) {
    console.log(`Running ${numTests} roll simulations to test good card percentile distribution...`);
    
    const percentileBuckets = {
        '0-10': 0,
        '10-20': 0,
        '20-30': 0,
        '30-40': 0,
        '40-50': 0,
        '50-60': 0,
        '60-70': 0,
        '70-80': 0,
        '80-90': 0,
        '90-95': 0,
        '95-99': 0,
        '99-100': 0
    };
    
    const goodCardCounts = {};
    let totalGoodCardsInTest = 0;
    let totalPullsInTest = 0;
    
    // Run the simulation many times
    for (let test = 0; test < numTests; test++) {
        let goodCardsInThisRoll = 0;
        
        // Simulate pulls with same logic as actual roll function
        for (let i = 0; i < pullCount; i++) {
            totalPullsInTest++;
            const pullNumber = totalPullsInTest;
            
            // Determine rarity based on pull number (same as actual logic)
            let rarity;
            const random = Math.random();
            
            if (pullNumber % 10 === 0) {
                // Multiple of 10: 97% SR, 3% SSR
                if (random < 0.97) {
                    rarity = 'SR';
                } else {
                    rarity = 'SSR';
                }
            } else {
                // Not multiple of 10: 79% R, 18% SR, 3% SSR
                if (random < 0.79) {
                    rarity = 'R';
                } else if (random < 0.97) {
                    rarity = 'SR';
                } else {
                    rarity = 'SSR';
                }
            }
            
            // Check if it would be a good card
            if (rarity === 'SSR') {
                // 6 good SSRs out of ~15 total SSRs
                if (Math.random() < (6/15)) {
                    goodCardsInThisRoll++;
                    totalGoodCardsInTest++;
                }
            } else if (rarity === 'SR') {
                // 8 good SRs out of ~25 total SRs
                if (Math.random() < (8/25)) {
                    goodCardsInThisRoll++;
                    totalGoodCardsInTest++;
                }
            }
            // R cards never good cards
        }
        
        // Track good card count distribution
        if (!goodCardCounts[goodCardsInThisRoll]) {
            goodCardCounts[goodCardsInThisRoll] = 0;
        }
        goodCardCounts[goodCardsInThisRoll]++;
        
        // Calculate percentile for this roll using current good card rate
        const percentiles = calculateMultiFactorPercentiles(0, 0, goodCardsInThisRoll, pullCount);
        const goodCardPercentile = percentiles.goodCards;
        
        // Bucket the percentile
        if (goodCardPercentile < 10) {
            percentileBuckets['0-10']++;
        } else if (goodCardPercentile < 20) {
            percentileBuckets['10-20']++;
        } else if (goodCardPercentile < 30) {
            percentileBuckets['20-30']++;
        } else if (goodCardPercentile < 40) {
            percentileBuckets['30-40']++;
        } else if (goodCardPercentile < 50) {
            percentileBuckets['40-50']++;
        } else if (goodCardPercentile < 60) {
            percentileBuckets['50-60']++;
        } else if (goodCardPercentile < 70) {
            percentileBuckets['60-70']++;
        } else if (goodCardPercentile < 80) {
            percentileBuckets['70-80']++;
        } else if (goodCardPercentile < 90) {
            percentileBuckets['80-90']++;
        } else if (goodCardPercentile < 95) {
            percentileBuckets['90-95']++;
        } else if (goodCardPercentile < 99) {
            percentileBuckets['95-99']++;
        } else {
            percentileBuckets['99-100']++;
        }
    }
    
    // Calculate actual good card rate
    const actualGoodCardRate = (totalGoodCardsInTest / totalPullsInTest) * 100;
    
    // Display results
    console.log('\n=== GOOD CARD PERCENTILE DISTRIBUTION TEST ===');
    console.log(`Total simulations: ${numTests.toLocaleString()}`);
    console.log(`Total pulls: ${totalPullsInTest.toLocaleString()}`);
    console.log(`Total good cards: ${totalGoodCardsInTest.toLocaleString()}`);
    console.log(`Actual good card rate: ${actualGoodCardRate.toFixed(3)}%`);
    console.log(`Current calculation rate: 7.8%`);
    console.log('\nNOTE: Empty percentile ranges are normal for discrete distributions.');
    console.log('With 50 pulls, only specific percentile values are mathematically possible.');
    
    console.log('\nGood Card Count Distribution:');
    const maxCount = Math.max(...Object.keys(goodCardCounts).map(k => parseInt(k)));
    for (let i = 0; i <= Math.min(maxCount, 10); i++) {
        const count = goodCardCounts[i] || 0;
        const percentage = (count / numTests * 100).toFixed(1);
        console.log(`${i} good cards: ${count} rolls (${percentage}%)`);
    }
    
    console.log('\nPercentile Distribution:');
    console.log('Range | Count | Percentage | Status');
    console.log('------|-------|------------|-------');
    
    // For discrete distributions, we expect some ranges to be empty
    // This is mathematically correct behavior
    for (const [range, count] of Object.entries(percentileBuckets)) {
        const percentage = (count / numTests * 100).toFixed(1);
        let status = '✓ OK';
        
        // Only flag as problematic if we have major concentration issues
        if (range === '99-100' && parseFloat(percentage) > 5) {
            status = '⚠️ HIGH';
        } else if ((range === '90-95' || range === '95-99') && parseFloat(percentage) > 15) {
            status = '⚠️ HIGH';
        } else if (parseFloat(percentage) === 0) {
            status = '- EMPTY (normal for discrete distributions)';
        }
        
        console.log(`${range.padEnd(5)} | ${count.toString().padStart(5)} | ${percentage.padStart(9)}% | ${status}`);
    }
    
    // Calculate how many rolls are above 90th percentile (should be ~10%)
    const above90th = percentileBuckets['90-95'] + percentileBuckets['95-99'] + percentileBuckets['99-100'];
    const above90thPercent = (above90th / numTests * 100).toFixed(1);
    
    console.log(`\nRolls above 90th percentile: ${above90th} (${above90thPercent}%) - Expected: ~10%`);
    
    // Check if distribution is too skewed toward high percentiles
    const above70th = percentileBuckets['70-80'] + percentileBuckets['80-90'] + above90th;
    const above70thPercent = (above70th / numTests * 100).toFixed(1);
    
    console.log(`Rolls above 70th percentile: ${above70th} (${above70thPercent}%) - Expected: ~30%`);
    
    if (parseFloat(above90thPercent) > 12) {  // More lenient threshold for discrete distributions
        console.log('\n⚠️  WARNING: Too many rolls are in high percentiles!');
        console.log('💡 SUGGESTION: Reduce goodCardRate from 0.078 to a lower value');
        
        // Suggest a better rate based on actual simulation
        const suggestedRate = actualGoodCardRate / 100;
        console.log(`📊 Suggested rate based on simulation: ${suggestedRate.toFixed(4)} (${actualGoodCardRate.toFixed(2)}%)`);
    } else if (parseFloat(above90thPercent) < 7) {  // More lenient lower threshold
        console.log('\n📈 INFO: Too few rolls are in high percentiles!');
        console.log('💡 SUGGESTION: Increase goodCardRate from 0.078 to a higher value');
        
        // Suggest a better rate based on actual simulation
        const suggestedRate = actualGoodCardRate / 100;
        console.log(`📊 Suggested rate based on simulation: ${suggestedRate.toFixed(4)} (${actualGoodCardRate.toFixed(2)}%)`);
    } else {
        console.log('\n✅ GOOD: Percentile distribution looks reasonable for discrete data!');
        console.log(`📊 Current rate (${(actualGoodCardRate/100).toFixed(4)}) appears well-calibrated.`);
        console.log('💡 The empty percentile ranges are mathematically correct for this distribution.');
    }
    
    return {
        numTests,
        percentileBuckets,
        goodCardCounts,
        actualGoodCardRate,
        above90thPercent: parseFloat(above90thPercent),
        above70thPercent: parseFloat(above70thPercent)
    };
}

// Debug function to see percentile mapping
function debugGoodCardPercentiles() {
    console.log('=== GOOD CARD PERCENTILE MAPPING ===');
    console.log('Count | Percentile');
    console.log('------|----------');
    
    for (let count = 0; count <= 10; count++) {
        const percentiles = calculateMultiFactorPercentiles(0, 0, count, 50);
        console.log(`${count.toString().padStart(5)} | ${percentiles.goodCards.toFixed(1)}%`);
    }
}
