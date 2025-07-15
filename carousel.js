/**
 * Hero Carousel Component
 * Handles the hero image carousel functionality
 */

class HeroCarousel {
    constructor() {
        this.carousel = null;
        this.slides = [];
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 seconds
        this.storageKey = 'hero-carousel-position';
        
        // Image modal properties
        this.imageModal = null;
        this.modalImg = null;
        this.modalCurrentIndex = 0;
        
        this.init();
    }

    init() {
        this.carousel = document.querySelector('.hero-carousel');
        if (!this.carousel) return;

        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.setupCarousel();
        this.bindEvents();
        this.setupImageModal();
    }

    setupCarousel() {
        if (this.slides.length === 0) return;

        // Load saved position from localStorage
        this.loadSavedPosition();
        
        // Show correct slide and set up previews
        this.updateSlideClasses();
        
        // Create indicators
        this.createIndicators();
        
        // Set up navigation
        this.setupNavigation();
    }

    createIndicators() {
        const indicatorsContainer = this.carousel.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;

        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('data-slide', index);
            if (index === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
    }

    setupNavigation() {
        const prevBtn = this.carousel.querySelector('.carousel-prev');
        const nextBtn = this.carousel.querySelector('.carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
    }

    bindEvents() {
        // Click on slides for navigation
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                e.preventDefault();
                if (slide.classList.contains('prev')) {
                    this.previousSlide();
                } else if (slide.classList.contains('next')) {
                    this.nextSlide();
                } else if (slide.classList.contains('active')) {
                    // Open image modal when clicking on active slide
                    this.openImageModal(index);
                } else {
                    this.goToSlide(index);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.carousel.matches(':hover')) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Touch/swipe support
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        let startTime = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            isDragging = true;
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });

        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const deltaX = startX - currentX;
            const deltaY = Math.abs(startY - currentY);
            const deltaTime = Date.now() - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Only trigger swipe if horizontal movement is greater than vertical
            // and either distance is significant OR velocity is high (for quick swipes)
            if (Math.abs(deltaX) > deltaY && (Math.abs(deltaX) > 30 || velocity > 0.5)) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            isDragging = false;
        }, { passive: true });

        // Mouse drag support for desktop
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseStartY = 0;

        this.carousel.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            
            const deltaX = mouseStartX - e.clientX;
            const deltaY = Math.abs(mouseStartY - e.clientY);
            
            // Visual feedback during drag
            if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > deltaY) {
                this.carousel.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (!mouseDown) return;
            
            const deltaX = mouseStartX - e.clientX;
            const deltaY = Math.abs(mouseStartY - e.clientY);
            
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            mouseDown = false;
            this.carousel.style.cursor = '';
        });
    }

    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        if (slideIndex < 0 || slideIndex >= this.slides.length) return;

        this.isTransitioning = true;

        // Update current slide index
        this.currentSlide = slideIndex;
        
        // Save position to localStorage
        this.savePosition();
        
        // Update slide classes and indicators
        this.updateSlideClasses();
        this.updateIndicators();

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500); // Match CSS transition duration
    }

    updateSlideClasses() {
        if (this.slides.length === 0) return;

        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index === this.getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === this.getNextIndex()) {
                slide.classList.add('next');
            }
        });
    }

    updateIndicators() {
        const indicators = this.carousel.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    getPrevIndex() {
        return (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    }

    getNextIndex() {
        return (this.currentSlide + 1) % this.slides.length;
    }

    setupImageModal() {
        this.imageModal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('imageModalImg');
        
        if (!this.imageModal || !this.modalImg) return;

        // Close modal events
        const closeBtn = document.getElementById('imageModalClose');
        const overlay = this.imageModal.querySelector('.image-modal-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeImageModal());
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeImageModal();
                }
            });
        }

        // Navigation events
        const prevBtn = document.getElementById('imageModalPrev');
        const nextBtn = document.getElementById('imageModalNext');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.modalPreviousImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.modalNextImage());
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.imageModal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                this.closeImageModal();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.modalPreviousImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.modalNextImage();
            }
        });

        // Touch/swipe events for modal
        this.setupModalTouchEvents();
    }

    openImageModal(slideIndex) {
        if (!this.imageModal || !this.modalImg) return;
        
        this.modalCurrentIndex = slideIndex;
        this.updateModalImage();
        
        // Show modal
        document.body.style.overflow = 'hidden';
        this.imageModal.classList.add('active');
    }

    closeImageModal() {
        if (!this.imageModal) return;
        
        // Hide modal
        this.imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModalImage() {
        if (!this.modalImg || this.modalCurrentIndex >= this.slides.length) return;
        
        const currentSlide = this.slides[this.modalCurrentIndex];
        const img = currentSlide.querySelector('.carousel-image');
        
        if (img) {
            // Reset loading state
            this.modalImg.parentElement.classList.remove('image-loaded');
            this.modalImg.parentElement.classList.add('image-loading');
            
            this.modalImg.src = img.src;
            this.modalImg.alt = img.alt;
        }
    }

    modalPreviousImage() {
        this.modalCurrentIndex = (this.modalCurrentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateModalImage();
    }

    modalNextImage() {
        this.modalCurrentIndex = (this.modalCurrentIndex + 1) % this.slides.length;
        this.updateModalImage();
    }

    setupModalTouchEvents() {
        if (!this.imageModal) return;
        
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        this.imageModal.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        this.imageModal.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });

        this.imageModal.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = startX - endX;
            const deltaY = Math.abs(startY - endY);
            
            // Only trigger swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
                if (deltaX > 0) {
                    this.modalNextImage();
                } else {
                    this.modalPreviousImage();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }

    nextSlide() {
        const nextIndex = this.getNextIndex();
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = this.getPrevIndex();
        this.goToSlide(prevIndex);
    }

    loadSavedPosition() {
        try {
            const savedPosition = localStorage.getItem(this.storageKey);
            if (savedPosition !== null) {
                const position = parseInt(savedPosition, 10);
                // Validate the saved position is within bounds
                if (position >= 0 && position < this.slides.length) {
                    this.currentSlide = position;
                } else {
                    // If saved position is invalid, default to first slide
                    this.currentSlide = 0;
                    this.savePosition();
                }
            } else {
                // No saved position, default to first slide
                this.currentSlide = 0;
                this.savePosition();
            }
        } catch (error) {
            // If localStorage is not available or there's an error, default to first slide
            console.warn('Could not load carousel position from localStorage:', error);
            this.currentSlide = 0;
        }
    }

    savePosition() {
        try {
            localStorage.setItem(this.storageKey, this.currentSlide.toString());
        } catch (error) {
            // If localStorage is not available, silently fail
            console.warn('Could not save carousel position to localStorage:', error);
        }
    }

    destroy() {
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroCarousel = new HeroCarousel();
});
