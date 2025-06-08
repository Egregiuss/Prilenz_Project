// Interactive features for Prilenz Photography

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.gallery-filter button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Add fade-in animation
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 50);
                } else {
                    item.classList.remove('visible');
                    item.style.display = 'none';
                }
            });
            
            // Re-initialize masonry layout
            initMasonry();
        });
    });

    // Initialize masonry layout
    function initMasonry() {
        const grid = document.querySelector('.gallery-grid');
        imagesLoaded(grid, function() {
            new Masonry(grid, {
                itemSelector: '.gallery-item',
                percentPosition: true
            });
        });
    }
    
    // Initialize masonry on page load
    initMasonry();

    // Lightbox functionality
    const galleryItemImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxDescription = document.querySelector('.lightbox-description');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');
    
    galleryItemImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            const item = this.closest('.gallery-item');
            const visibleItemsArray = visibleItems();
            currentImageIndex = visibleItemsArray.indexOf(item);
            
            const title = item.querySelector('.gallery-item-hover h3').textContent;
            const description = item.getAttribute('data-description');
            
            lightboxImage.src = this.src.replace('w=800', 'w=1200');
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            updateLightboxNavigation();
        });
    });
    
    function updateLightboxNavigation() {
        const visibleItemsArray = visibleItems();
        
        if (currentImageIndex <= 0) {
            lightboxPrev.classList.add('disabled');
        } else {
            lightboxPrev.classList.remove('disabled');
        }
        
        if (currentImageIndex >= visibleItemsArray.length - 1) {
            lightboxNext.classList.add('disabled');
        } else {
            lightboxNext.classList.remove('disabled');
        }
    }
    
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    lightboxPrev.addEventListener('click', function() {
        const visibleItemsArray = visibleItems();
        if (currentImageIndex > 0) {
            currentImageIndex--;
            const prevItem = visibleItemsArray[currentImageIndex];
            const img = prevItem.querySelector('img');
            const title = prevItem.querySelector('.gallery-item-hover h3').textContent;
            const description = prevItem.getAttribute('data-description');
            
            lightboxImage.src = img.src.replace('w=800', 'w=1200');
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            updateLightboxNavigation();
        }
    });
    
    lightboxNext.addEventListener('click', function() {
        const visibleItemsArray = visibleItems();
        if (currentImageIndex < visibleItemsArray.length - 1) {
            currentImageIndex++;
            const nextItem = visibleItemsArray[currentImageIndex];
            const img = nextItem.querySelector('img');
            const title = nextItem.querySelector('.gallery-item-hover h3').textContent;
            const description = nextItem.getAttribute('data-description');
            
            lightboxImage.src = img.src.replace('w=800', 'w=1200');
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            updateLightboxNavigation();
        }
    });
    
    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    });

    // Form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            // Reset previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
                showError(emailInput, 'Email is invalid');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            }
            
            if (isValid) {
                // Simulate form submission
                const submitButton = contactForm.querySelector('.btn');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    const formContainer = document.querySelector('.contact-form-container');
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <h3>Thank you!</h3>
                            <p>Your message has been sent successfully.</p>
                        </div>
                    `;
                }, 1500);
            }
        });
    }
    
    function showError(input, message) {
        input.classList.add('error');
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        input.parentNode.appendChild(errorMessage);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on page load
});