document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeMobileMenu();
    initializeStatsCounter();
    initializeAppointmentModal();
    initializeFormValidation();
    initializeCardAnimations();
});

// ===== HERO SLIDER FUNCTIONALITY =====
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Show slide function
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        showSlide(index);
        resetInterval();
    }
    
    // Auto slide
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset interval on user interaction
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    // Pause on hover
    const heroSection = document.getElementById('heroSection');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', startInterval);
    }
    
    // Start the slider
    startInterval();
}

// ===== MOBILE MENU TOGGLE =====
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ===== ANIMATED STATS COUNTER =====
function initializeStatsCounter() {
    const statItems = document.querySelectorAll('.stat-item');
    
    if (!statItems.length) return;
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Animate counter
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    }
    
    // Handle scroll
    let animated = false;
    
    function handleScroll() {
        if (animated) return;
        
        statItems.forEach(item => {
            if (isInViewport(item)) {
                const target = parseInt(item.getAttribute('data-count'));
                const counterElement = item.querySelector('h3');
                
                if (counterElement && !item.classList.contains('animated')) {
                    animateCounter(counterElement, target);
                    item.classList.add('animated');
                }
            }
        });
        
        // Check if all stats have been animated
        if (document.querySelectorAll('.stat-item.animated').length === statItems.length) {
            animated = true;
        }
    }
    
    // Initial check
    handleScroll();
    
    // Listen for scroll
    window.addEventListener('scroll', handleScroll);
}

// ===== APPOINTMENT MODAL =====
function initializeAppointmentModal() {
    const appointmentBtn = document.getElementById('quickAppointment');
    const modal = document.getElementById('appointmentModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!appointmentBtn || !modal) return;
    
    // Open modal
    appointmentBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModalFunc() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('patientName');
            const phone = document.getElementById('patientPhone');
            let isValid = true;
            
            // Name validation
            if (!name.value.trim()) {
                showError(name, 'Please enter your full name');
                isValid = false;
            } else if (name.value.trim().length < 3) {
                showError(name, 'Name must be at least 3 characters');
                isValid = false;
            } else {
                showSuccess(name);
            }
            
            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phone.value.trim()) {
                showError(phone, 'Please enter your phone number');
                isValid = false;
            } else if (!phoneRegex.test(phone.value.trim())) {
                showError(phone, 'Please enter a valid 10-digit phone number');
                isValid = false;
            } else {
                showSuccess(phone);
            }
            
            // Date validation (optional)
            const date = document.getElementById('appointmentDate');
            if (date.value) {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    showError(date, 'Please select a future date');
                    isValid = false;
                } else {
                    showSuccess(date);
                }
            }
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = appointmentForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Appointment request submitted successfully! We will contact you shortly.');
                    appointmentForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Close modal
                    const modal = document.getElementById('appointmentModal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }, 1500);
            }
        });
    }
    
    // Helper functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add error message
        const error = document.createElement('small');
        error.className = 'error-message';
        error.textContent = message;
        formGroup.appendChild(error);
    }
    
    function showSuccess(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        
        // Remove error message if exists
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();
    }
}

// ===== CARD ANIMATIONS =====
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.flex-card');
    
    if (!cards.length) return;
    
    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        observer.observe(card);
    });
    
    // Add hover effect for service cards
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const service = this.getAttribute('data-service');
            const icon = this.querySelector('.card-icon i');
            
            if (service && icon) {
                // Add animation class to icon
                icon.classList.add('pulse');
                setTimeout(() => icon.classList.remove('pulse'), 300);
            }
        });
    });
}
