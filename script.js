// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality, with defensive error handling
    const initializers = [
        { name: 'Navigation', fn: initializeNavigation },
        { name: 'ScrollAnimations', fn: initializeScrollAnimations },
        { name: 'BackToTop', fn: initializeBackToTop },
        { name: 'ContactForm', fn: initializeContactForm },
        { name: 'SmoothScrolling', fn: initializeSmoothScrolling },
        { name: 'LoadingScreen', fn: initializeLoadingScreen },
        { name: 'ParallaxEffect', fn: initializeParallaxEffect },
        { name: 'TypingAnimation', fn: initializeTypingAnimation },
        { name: 'LanguageSelector', fn: initializeLanguageSelector }
    ];

    initializers.forEach(init => {
        try {
            if (typeof init.fn === 'function') {
                init.fn();
            }
        } catch (err) {
            console.error(`Error initializing ${init.name}:`, err);
        }
    });
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Highlight active navigation link
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .about-text, .about-image, .contact-info, .contact-form');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Special animations for hero elements
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 500);
    });
}

// Back to top button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    // Contact form not present on this page
    if (!contactForm) {
        return;
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : 'Send';
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }, 2000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Loading screen
function initializeLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);

    // Show spinner on load, keep it visible for 1.1s, then fade into site with blur and show language modal
    window.addEventListener('load', () => {
        const minVisibleMs = 1100; // 1.1 seconds as requested
        setTimeout(() => {
            // fade out loading spinner
            loadingScreen.classList.add('hidden');

            // apply a subtle blur to the site while modal appears
            document.body.classList.add('site-blurred');

            // wait a bit for the blur/backdrop to settle, then show language modal
            setTimeout(() => {
                if (typeof showLanguageModal === 'function') {
                    showLanguageModal();
                }

                // remove the loading element after a short delay so transitions complete
                setTimeout(() => {
                    if (loadingScreen && loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 500);
            }, 300);
        }, minVisibleMs);
    });
}

// Parallax effect for hero section
function initializeParallaxEffect() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-element');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        const scrollPercent = scrollTop / heroHeight;

        if (scrollPercent <= 1) {
            floatingElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = scrollTop * speed;
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
}

// Typing animation for hero subtitle
function initializeTypingAnimation() {
    // Disabled: conflicts with dynamic language switching.
    // The typing animation would overwrite translations.
    // If you want typing effect, it should be re-triggered after language selection.
    return;
}

// Skill bars animation
function initializeSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                entry.target.classList.add('animate');
            }
        });
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}

// Project card hover effects
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Counter animation for stats
function initializeCounters() {
    const counters = document.querySelectorAll('.stat h4');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : counter.textContent.includes('%') ? '%' : '');
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.textContent = target + (counter.textContent.includes('+') ? '+' : counter.textContent.includes('%') ? '%' : '');
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Timeline animations
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// Dark mode toggle (optional feature)
function initializeDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #333;
        color: white;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateY(-50%);
    `;
    
    document.body.appendChild(darkModeToggle);
    
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Particle animation for background
function initializeParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = '#667eea';
            ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Initialize additional features
setTimeout(() => {
    initializeSkillBars();
    initializeProjectCards();
    initializeCounters();
    initializeTimeline();
    // initializeDarkMode(); // Uncomment to enable dark mode
    // initializeParticles(); // Uncomment to enable particle background
}, 1000);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading for images (when you add real images)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

// Preload critical resources
function preloadResources() {
    const links = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
    ];
    
    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

preloadResources();

// Image Popup Functionality
let currentImageIndex = 0;
let currentProjectImages = [];

// Define project galleries
const projectGalleries = {
    'ecommerce': [
        { src: 'images/sfyf/homepage1.png', title: 'E-Commerce Platform - Homepage' },
        { src: 'images/sfyf/homepage2.png', title: 'E-Commerce Platform - Product Showcase' },
        { src: 'images/sfyf/homepage3.png', title: 'E-Commerce Platform - Featured Products' },
        { src: 'images/sfyf/homepage4.png', title: 'E-Commerce Platform - Categories' },
        { src: 'images/sfyf/homepage5.png', title: 'E-Commerce Platform - Special Offers' },
        { src: 'images/sfyf/homepage6.png', title: 'E-Commerce Platform - Footer' },
        { src: 'images/sfyf/login.png', title: 'E-Commerce Platform - Login Page' },
        { src: 'images/sfyf/profile.png', title: 'E-Commerce Platform - User Profile' },
        { src: 'images/sfyf/vente1.png', title: 'E-Commerce Platform - Product Sales Page' },
        { src: 'images/sfyf/vente2.png', title: 'E-Commerce Platform - Product Details' },
        { src: 'images/sfyf/vente3.png', title: 'E-Commerce Platform - Product Gallery' },
        { src: 'images/sfyf/panier.png', title: 'E-Commerce Platform - Shopping Cart' },
        { src: 'images/sfyf/commande1.png', title: 'E-Commerce Platform - Order Management' },
        { src: 'images/sfyf/payment1.png', title: 'E-Commerce Platform - Payment Step 1' },
        { src: 'images/sfyf/payment2.png', title: 'E-Commerce Platform - Payment Step 2' },
        { src: 'images/sfyf/payment3.png', title: 'E-Commerce Platform - Payment Step 3' },
        { src: 'images/sfyf/payment4.png', title: 'E-Commerce Platform - Payment Confirmation' },
        { src: 'images/sfyf/admin1.png', title: 'E-Commerce Platform - Admin Dashboard' },
        { src: 'images/sfyf/devhome1.png', title: 'E-Commerce Platform - Development View 1' },
        { src: 'images/sfyf/devhome2.png', title: 'E-Commerce Platform - Development View 2' }
    ],
    'task-management': [
        { src: 'images/study/home.png', title: 'Task Management App - Home Dashboard' },
        { src: 'images/study/login.png', title: 'Task Management App - Login Page' },
        { src: 'images/study/sidebar.png', title: 'Task Management App - Navigation Sidebar' },
        { src: 'images/study/students.png', title: 'Task Management App - Students Overview' },
        { src: 'images/study/add student.png', title: 'Task Management App - Add New Student' },
        { src: 'images/study/student info.png', title: 'Task Management App - Student Information' },
        { src: 'images/study/students level.png', title: 'Task Management App - Student Levels' },
        { src: 'images/study/groups.png', title: 'Task Management App - Study Groups' },
        { src: 'images/study/addgroupe.png', title: 'Task Management App - Create New Group' },
        { src: 'images/study/manage  student  group.png', title: 'Task Management App - Manage Student Groups' },
        { src: 'images/study/calendar schedular.png', title: 'Task Management App - Calendar Scheduler' },
        { src: 'images/study/notification center.png', title: 'Task Management App - Notification Center' },
        { src: 'images/study/studentpaymentmanager.png', title: 'Task Management App - Payment Management' }
    ],
    'analytics': [
        { src: 'images/loan/HOME PAGE.png', title: 'Analytics Dashboard - Home Page' },
        { src: 'images/loan/LOGIN.png', title: 'Analytics Dashboard - Login System' },
        { src: 'images/loan/client list .png', title: 'Analytics Dashboard - Client List Overview' },
        { src: 'images/loan/client profile.png', title: 'Analytics Dashboard - Client Profile Details' },
        { src: 'images/loan/create  client  1.png', title: 'Analytics Dashboard - Create Client Step 1' },
        { src: 'images/loan/create client 2.png', title: 'Analytics Dashboard - Create Client Step 2' },
        { src: 'images/loan/loan overview.png', title: 'Analytics Dashboard - Loan Overview' },
        { src: 'images/loan/create  loan.png', title: 'Analytics Dashboard - Create New Loan' },
        { src: 'images/loan/create loan 2.png', title: 'Analytics Dashboard - Loan Creation Step 2' },
        { src: 'images/loan/create loan 3.png', title: 'Analytics Dashboard - Loan Creation Step 3' },
        { src: 'images/loan/loan details.png', title: 'Analytics Dashboard - Loan Details View' },
        { src: 'images/loan/loan overdue.png', title: 'Analytics Dashboard - Overdue Loans Management' }
    ],
    'social-media': [
        { src: 'images/social-media-app.jpg', title: 'Social Media App' }
    ],
    'ai-chatbot': [
        { src: 'images/ai-chatbot.jpg', title: 'AI Chatbot Platform' }
    ],
    'cloud-storage': [
        { src: 'images/cloud-storage.jpg', title: 'Cloud Storage Solution' }
    ]
};

function openImagePopup(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    
    const projectType = element.getAttribute('data-project');
    currentProjectImages = projectGalleries[projectType] || [];
    
    if (currentProjectImages.length === 0) return;
    
    currentImageIndex = 0; // Start with first image
    
    modal.style.display = 'block';
    modal.classList.add('show');
    modalImg.src = currentProjectImages[currentImageIndex].src;
    caption.innerHTML = `${currentProjectImages[currentImageIndex].title} <span class="image-counter">(${currentImageIndex + 1}/${currentProjectImages.length})</span>`;
    
    // Show/hide navigation buttons based on gallery size
    const prevBtn = document.querySelector('.modal-nav-btn.prev');
    const nextBtn = document.querySelector('.modal-nav-btn.next');
    
    if (currentProjectImages.length > 1) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
}

function closeImagePopup() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
    
    // Remove keyboard navigation
    document.removeEventListener('keydown', handleKeyNavigation);
}

function nextImage() {
    if (currentProjectImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
    updateModalImage();
}

function prevImage() {
    if (currentProjectImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    
    if (currentProjectImages.length === 0) return;
    
    const currentImage = currentProjectImages[currentImageIndex];
    modalImg.src = currentImage.src;
    caption.innerHTML = `${currentImage.title} <span class="image-counter">(${currentImageIndex + 1}/${currentProjectImages.length})</span>`;
}

function handleKeyNavigation(e) {
    switch(e.key) {
        case 'Escape':
            closeImagePopup();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
        case 'ArrowRight':
            nextImage();
            break;
    }
}

// Close modal when clicking outside the image
document.addEventListener('click', function(e) {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeImagePopup();
    }
});

// Touch/swipe navigation for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    if (document.getElementById('imageModal').style.display === 'block') {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    if (document.getElementById('imageModal').style.display === 'block') {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextImage(); // Swipe left - next image
        } else {
            prevImage(); // Swipe right - previous image
        }
    }
}

// Language Switching Functionality
const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-skills': 'Skills',
        'nav-projects': 'Projects',
        'nav-experience': 'Experience',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-greeting': "Hi, I'm",
        'hero-title': 'Full Stack Developer',
        'hero-description': 'Passionate developer crafting innovative web solutions with modern technologies. I transform ideas into exceptional digital experiences through clean code and creative design.',
        'hero-btn-work': 'View My Work',
        'hero-btn-contact': 'Get In Touch',
        
        // About Section
        'about-title': 'About Me',
        'about-subtitle': 'Get to know more about who I am and what I do',
        'about-heading': 'Full Stack Developer & Problem Solver',
        'about-text1': "I'm a passionate Full Stack Developer with expertise in both frontend and backend technologies. My journey in software development has equipped me with a comprehensive understanding of the entire web development lifecycle.",
        'about-text2': 'I specialize in creating scalable, efficient, and user-friendly applications using modern technologies. My goal is to bridge the gap between technical functionality and exceptional user experience.',
        'stat-projects': 'Projects Completed',
        'stat-experience': 'Years Experience',
        'stat-satisfaction': 'Client Satisfaction',
        'download-cv': 'Download CV',
        
        // Skills Section
        'skills-title': 'Skills & Technologies',
        'skills-subtitle': 'The tools and technologies I use to bring ideas to life',
        'skills-programming': 'Programming Languages',
        'skills-frontend': 'Frontend',
        'skills-backend': 'Backend',
        'skills-database': 'Database',
        'skills-devops': 'DevOps & Tools',
        
        // Projects Section
        'projects-title': 'Recent Freelance Projects',
        'projects-subtitle': 'A selection of my latest freelance work. Code samples cannot be shared due to client confidentiality and ownership rights.',
        'project1-title': 'SFYF Platform',
        'project1-desc': 'A web-based platform designed to manage student follow-up and academic performance, featuring role-based access for students, teachers, and administrators, with dashboards for tracking attendance, documents, and exam planning.',
        'project2-title': 'Student Management System',
        'project2-desc': 'A comprehensive web platform designed to manage students, courses, payments, and groups efficiently. The system streamlines administrative operations with role-based access, real-time updates, and an intuitive dashboard for both staff and students.',
        'project3-title': 'Loan Management Platform',
        'project3-desc': 'A full-featured web application for managing clients, their loans, payment schedules, and penalties. The system automates loan tracking, calculates due dates and late fees, and provides dashboards for financial reporting and client monitoring.',
        
        // Experience Section
        'experience-title': 'Experience & Education',
        'experience-subtitle': 'My professional journey and educational background',
        
        // Contact Section
        'contact-title': 'Get In Touch',
        'contact-subtitle': "Let's work together to bring your ideas to life",
        'contact-email': 'Email',
        'contact-phone': 'Phone',
        'contact-location': 'Location',
        
        // Footer
        'footer-copyright': '© 2024 Ayoub Gouadria. All rights reserved.',
        
        // Experience Section - Jobs
        'job0-title': 'Back-End Developer',
        'job0-company': 'DEFENDR.GG – Tunis',
        'job0-desc': 'Developed and maintained the backend architecture of the DEFENDR.GG platform using Node.js and Express.',
        'job0-point1': 'Built scalable REST APIs ensuring data integrity and reliable communication between services.',
        'job0-point2': 'Optimized database operations and improved system performance through query optimization and caching strategies.',
        'job0-point3': 'Implemented new features and collaborated with the team to deliver reliable, scalable solutions.',
        
        'job1-title': 'Full Stack Developer Intern',
        'job1-company': 'SFYF Development – Tunis',
        'job1-desc': 'Developed and optimized an e-commerce platform using Spring Boot and Angular, enhancing system speed and scalability.',
        'job1-point1': 'Increased platform load speed by 25%, supporting 1,000+ transactions/month.',
        'job1-point2': 'Implemented JWT authentication and REST APIs across 5 modules.',
        'job1-point3': 'Designed a responsive admin dashboard for daily team operations.',
        'job1-point4': 'Streamlined CI/CD pipelines, reducing deployment time from 15 to 5 minutes.',
        
        'job2-title': 'Full Stack Developer Intern (Final Project)',
        'job2-company': 'INNOVUP – Ariana',
        'job2-desc': 'Built a domestic services web app using the MERN stack, improving user experience and system performance.',
        'job2-point1': 'Connected over 150 users and improved user retention by 30%.',
        'job2-point2': 'Deployed app on cloud server with 99% uptime and 20% faster API responses.',
        'job2-point3': 'Delivered responsive and intuitive UI for better navigation and engagement.',
        
        'job3-title': 'Web Developer Intern',
        'job3-company': 'TOPNET – Tunis',
        'job3-desc': 'Designed and developed a product management system using PHP and MySQL.',
        'job3-point1': 'Automated data validation, reducing manual entry by 40%.',
        'job3-point2': 'Created an admin dashboard managing 500+ product records.',
        
        // Projects in Experience
        'projects-title-exp': 'Key Projects',
        'projects-type': 'Personal & Academic',
        'project-edu': 'Education Management System (Angular | Spring Boot | MySQL) – Managed 200+ students and automated payments and scheduling.',
        'project-loan': 'Loan Management Platform (Angular | Spring Boot | MongoDB) – Built dashboards for 1,000+ loan applications, reducing review time by 35%.',
        'project-chat': 'Real-Time Chat Application (Angular | Node.js | Socket.io) – Delivered sub-100ms message latency with persistent storage and notifications.',
        
        // Education
        'edu1-title': 'Engineering Programme in Computer Science',
        'edu1-school': 'TEK-UP University – Tunis',
        'edu1-focus': 'Focus: Software Engineering, Full-Stack Development, Cloud Computing.',
        'edu2-title': "Bachelor's Degree in Computer Science and Multimedia",
        'edu2-school': 'Higher Institute of Computer Science of Kef',
        'edu2-focus': 'Focus: Web Technologies, Multimedia Systems, Databases.',
        
        // Leadership
        'leadership-title': 'Leadership & Activities',
        'leadership-org': 'Tunivision Club – Higher Institute of Computer Science of Kef',
        'leadership-point1': 'Vice President – Event Management, organized 5+ campus events with 200+ participants.',
        'leadership-point2': 'Coordinated a 10-person organizing team for large-scale events.',
        'leadership-point3': 'Final Year Project Mentor – guided a student in developing a Java + Angular app (graded 18/20).',
        
        // Languages
        'languages-title': 'Languages',
        'languages-subtitle': 'Multilingual Communication',
        'lang-arabic': 'Arabic: Native',
        'lang-french': 'French: C1',
        'lang-english': 'English: C1',
        'lang-german': 'German: B1',
        
        // Design & UX Skills
        'skills-design': 'Design & UX'
    },
    de: {
        // Navigation
        'nav-home': 'Startseite',
        'nav-about': 'Über mich',
        'nav-skills': 'Fähigkeiten',
        'nav-projects': 'Projekte',
        'nav-experience': 'Erfahrung',
        'nav-contact': 'Kontakt',
        
        // Hero Section
        'hero-greeting': 'Hallo, ich bin',
        'hero-title': 'Full Stack Entwickler',
        'hero-description': 'Leidenschaftlicher Entwickler, der innovative Weblösungen mit modernen Technologien entwickelt. Ich verwandle Ideen durch sauberen Code und kreatives Design in außergewöhnliche digitale Erlebnisse.',
        'hero-btn-work': 'Meine Arbeit ansehen',
        'hero-btn-contact': 'Kontakt aufnehmen',
        
        // About Section
        'about-title': 'Über mich',
        'about-subtitle': 'Erfahren Sie mehr darüber, wer ich bin und was ich mache',
        'about-heading': 'Full Stack Entwickler & Problemlöser',
        'about-text1': 'Ich bin ein leidenschaftlicher Full Stack Entwickler mit Expertise in Frontend- und Backend-Technologien. Meine Reise in der Softwareentwicklung hat mir ein umfassendes Verständnis des gesamten Webentwicklungslebenszyklus vermittelt.',
        'about-text2': 'Ich spezialisiere mich auf die Erstellung skalierbarer, effizienter und benutzerfreundlicher Anwendungen mit modernen Technologien. Mein Ziel ist es, die Lücke zwischen technischer Funktionalität und außergewöhnlicher Benutzererfahrung zu schließen.',
        'stat-projects': 'Abgeschlossene Projekte',
        'stat-experience': 'Jahre Erfahrung',
        'stat-satisfaction': 'Kundenzufriedenheit',
        'download-cv': 'Lebenslauf herunterladen',
        
        // Skills Section
        'skills-title': 'Fähigkeiten & Technologien',
        'skills-subtitle': 'Die Tools und Technologien, die ich verwende, um Ideen zum Leben zu erwecken',
        'skills-programming': 'Programmiersprachen',
        'skills-frontend': 'Frontend',
        'skills-backend': 'Backend',
        'skills-database': 'Datenbank',
        'skills-devops': 'DevOps & Tools',
        
        // Projects Section
        'projects-title': 'Aktuelle Freelance-Projekte',
        'projects-subtitle': 'Eine Auswahl meiner neuesten Freelance-Arbeiten. Code-Beispiele können aufgrund der Vertraulichkeit und Eigentumsrechte der Kunden nicht geteilt werden.',
        'project1-title': 'SFYF-Plattform',
        'project1-desc': 'Eine webbasierte Plattform zur Verwaltung der Schülerverfolgung und akademischen Leistung mit rollenbasiertem Zugang für Schüler, Lehrer und Administratoren sowie Dashboards zur Verfolgung von Anwesenheit, Dokumenten und Prüfungsplanung.',
        'project2-title': 'Schülerverwaltungssystem',
        'project2-desc': 'Eine umfassende Webplattform zur effizienten Verwaltung von Schülern, Kursen, Zahlungen und Gruppen. Das System rationalisiert administrative Vorgänge mit rollenbasiertem Zugang, Echtzeit-Updates und einem intuitiven Dashboard für Personal und Schüler.',
        'project3-title': 'Kreditverwaltungsplattform',
        'project3-desc': 'Eine vollständige Webanwendung zur Verwaltung von Kunden, ihren Krediten, Zahlungsplänen und Strafen. Das System automatisiert die Kreditverfolgung, berechnet Fälligkeitsdaten und Verspätungsgebühren und bietet Dashboards für Finanzberichterstattung und Kundenüberwachung.',
        
        // Experience Section
        'experience-title': 'Erfahrung & Bildung',
        'experience-subtitle': 'Mein beruflicher Werdegang und mein Bildungshintergrund',
        
        // Contact Section
        'contact-title': 'Kontakt aufnehmen',
        'contact-subtitle': 'Lassen Sie uns zusammenarbeiten, um Ihre Ideen zum Leben zu erwecken',
        'contact-email': 'E-Mail',
        'contact-phone': 'Telefon',
        'contact-location': 'Standort',
        
        // Footer
        'footer-copyright': '© 2024 Ayoub Gouadria. Alle Rechte vorbehalten.',
        
        // Experience Section - Jobs
        'job0-title': 'Backend-Entwickler',
        'job0-company': 'DEFENDR.GG – Tunis',
        'job0-desc': 'Entwicklung und Wartung der Backend-Architektur der DEFENDR.GG-Plattform mit Node.js und Express.',
        'job0-point1': 'Erstellung skalierbarer REST-APIs, um Datenintegrität und zuverlässige Kommunikation zwischen Services zu gewährleisten.',
        'job0-point2': 'Optimierung von Datenbankoperationen und Verbesserung der Systemleistung durch Query-Optimierung und Caching-Strategien.',
        'job0-point3': 'Implementierung neuer Funktionen und Zusammenarbeit mit dem Team zur Bereitstellung zuverlässiger, skalierbarer Lösungen.',
        
        'job1-title': 'Full Stack Entwickler Praktikant',
        'job1-company': 'SFYF Development – Tunis',
        'job1-desc': 'Entwickelte und optimierte eine E-Commerce-Plattform mit Spring Boot und Angular, wodurch Systemgeschwindigkeit und Skalierbarkeit verbessert wurden.',
        'job1-point1': 'Erhöhte die Plattform-Ladegeschwindigkeit um 25% und unterstützte 1.000+ Transaktionen/Monat.',
        'job1-point2': 'Implementierte JWT-Authentifizierung und REST-APIs in 5 Modulen.',
        'job1-point3': 'Entwarf ein responsives Admin-Dashboard für tägliche Teamoperationen.',
        'job1-point4': 'Optimierte CI/CD-Pipelines und reduzierte die Deployment-Zeit von 15 auf 5 Minuten.',
        
        'job2-title': 'Full Stack Entwickler Praktikant (Abschlussprojekt)',
        'job2-company': 'INNOVUP – Ariana',
        'job2-desc': 'Entwickelte eine Web-App für häusliche Dienstleistungen mit dem MERN-Stack und verbesserte Benutzererfahrung und Systemleistung.',
        'job2-point1': 'Verband über 150 Benutzer und verbesserte die Benutzerbindung um 30%.',
        'job2-point2': 'Stellte die App auf einem Cloud-Server mit 99% Uptime und 20% schnelleren API-Antworten bereit.',
        'job2-point3': 'Lieferte eine responsive und intuitive Benutzeroberfläche für bessere Navigation und Engagement.',
        
        'job3-title': 'Web-Entwickler Praktikant',
        'job3-company': 'TOPNET – Tunis',
        'job3-desc': 'Entwarf und entwickelte ein Produktmanagementsystem mit PHP und MySQL.',
        'job3-point1': 'Automatisierte Datenvalidierung und reduzierte manuelle Eingaben um 40%.',
        'job3-point2': 'Erstellte ein Admin-Dashboard zur Verwaltung von 500+ Produktdatensätzen.',
        
        // Projects in Experience
        'projects-title-exp': 'Hauptprojekte',
        'projects-type': 'Persönlich & Akademisch',
        'project-edu': 'Bildungsmanagementsystem (Angular | Spring Boot | MySQL) – Verwaltete 200+ Studenten und automatisierte Zahlungen und Terminplanung.',
        'project-loan': 'Kreditverwaltungsplattform (Angular | Spring Boot | MongoDB) – Erstellte Dashboards für 1.000+ Kreditanträge und reduzierte die Bearbeitungszeit um 35%.',
        'project-chat': 'Echtzeit-Chat-Anwendung (Angular | Node.js | Socket.io) – Lieferte unter 100ms Nachrichtenlatenz mit persistenter Speicherung und Benachrichtigungen.',
        
        // Education
        'edu1-title': 'Ingenieursprogramm in Informatik',
        'edu1-school': 'TEK-UP Universität – Tunis',
        'edu1-focus': 'Schwerpunkt: Software Engineering, Full-Stack-Entwicklung, Cloud Computing.',
        'edu2-title': 'Bachelor-Abschluss in Informatik und Multimedia',
        'edu2-school': 'Höheres Institut für Informatik von Kef',
        'edu2-focus': 'Schwerpunkt: Web-Technologien, Multimedia-Systeme, Datenbanken.',
        
        // Leadership
        'leadership-title': 'Führung & Aktivitäten',
        'leadership-org': 'Tunivision Club – Höheres Institut für Informatik von Kef',
        'leadership-point1': 'Vizepräsident – Eventmanagement, organisierte 5+ Campus-Events mit 200+ Teilnehmern.',
        'leadership-point2': 'Koordinierte ein 10-köpfiges Organisationsteam für große Veranstaltungen.',
        'leadership-point3': 'Abschlussprojekt-Mentor – betreute einen Studenten bei der Entwicklung einer Java + Angular App (Note 18/20).',
        
        // Languages
        'languages-title': 'Sprachen',
        'languages-subtitle': 'Mehrsprachige Kommunikation',
        'lang-arabic': 'Arabisch: Muttersprache',
        'lang-french': 'Französisch: C1',
        'lang-english': 'Englisch: C1',
        'lang-german': 'Deutsch: B1',
        
        // Design & UX Skills
        'skills-design': 'Design & UX'
    }
};

// Language Selector Functions
function initializeLanguageSelector() {
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Check if elements exist
    if (!langBtn || !langDropdown || langOptions.length === 0) {
        console.error('Language selector elements not found');
        return;
    }
    
    // Load saved language if present
    const savedLang = localStorage.getItem('selectedLanguage');
    // If a language was previously chosen, apply it so the UI shows in that language
    if (savedLang) {
        setLanguage(savedLang);
    }
    // NOTE: Don't show the modal here — it's shown after the loading spinner completes
    // via initializeLoadingScreen() to ensure the spinner -> blur -> modal sequence.
    
    // Note: Navbar language dropdown uses inline onclick handlers in HTML
    // (defined in index.html), so no additional event listeners needed here.
    // This prevents conflicts with modal button handling.
}

// Show/hide helpers and modal wiring for first-visit language choice
function showLanguageModal() {
    const modal = document.getElementById('languageModal');
    // Smoothly show the modal using an rAF to ensure CSS transitions run
    if (!modal) {
        console.error('Language modal element not found in DOM');
        return;
    }

    // If already visible, do nothing
    if (modal.classList.contains('show')) return;

    // Prepare modal and prevent scroll
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Wire buttons once (use event delegation protection via data-attr)
    const enBtn = document.getElementById('choose-en-btn');
    const deBtn = document.getElementById('choose-de-btn');

    function wireButton(btn, lang) {
        if (!btn) return;
        // remove previous listeners by replacing node
        const copy = btn.cloneNode(true);
        btn.parentNode.replaceChild(copy, btn);
        copy.addEventListener('click', () => {
            setLanguage(lang);
            hideLanguageModal();
        });
    }

    wireButton(enBtn, 'en');
    wireButton(deBtn, 'de');

    // Force a reflow then add the class on next animation frame for smooth transition
    // This avoids the modal appearing instantly without animation on some browsers
    // (especially after DOM changes and blur application)
    void modal.offsetWidth; // force reflow
    requestAnimationFrame(() => {
        // tiny delay to ensure transitions will trigger
        setTimeout(() => modal.classList.add('show'), 10);
    });
}

function hideLanguageModal() {
    const modal = document.getElementById('languageModal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    // remove site blur when modal hides
    document.body.classList.remove('site-blurred');
}

// Make setLanguage function globally accessible
window.setLanguage = function(lang) {
    console.log('Setting language to:', lang); // Debug log
    
    // Save language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Update current language display
    const currentLangSpan = document.getElementById('current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang.toUpperCase();
        console.log('Updated language display to:', lang.toUpperCase());
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data-key attributes
    const elements = document.querySelectorAll('[data-key]');
    console.log('Found elements with data-key:', elements.length); // Debug log
    
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            const oldText = element.textContent;
            element.textContent = translations[lang][key];
            console.log('Updated element:', key, 'from:', oldText, 'to:', translations[lang][key]); // Debug log
        } else {
            console.log('No translation found for key:', key, 'in language:', lang);
        }
    });
    
    // Update CV download link based on language
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        const cvLinks = {
            en: 'resume/Ayoub_Gouadria_FullStack_Developer_CV_EN.pdf',
            de: 'resume/Ayoub_Gouadria_FullStack_Entwickler_Lebenslauf_DE.pdf'
        };
        cvBtn.href = cvLinks[lang] || cvLinks.en;
        console.log('Updated CV download link to:', cvLinks[lang] || cvLinks.en);
    }
    
    // Update page title
    const titles = {
        en: 'Ayoub Gouadria - Full Stack Developer',
        de: 'Ayoub Gouadria - Full Stack Entwickler'
    };
    document.title = titles[lang] || titles.en;
    console.log('Language switch completed for:', lang);
}