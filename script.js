// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    // Smooth scrolling for navigation links (only for anchor links, not page navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for internal anchor links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href;
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For page navigation (.html files), let the default behavior happen
        });
    });

    // Active navigation link highlighting (updated for multi-page navigation)
    function updateActiveNavLink() {
        // For multi-page websites, we don't need to update active links based on scroll
        // The active class should be set in the HTML based on the current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // Check if the link matches the current page
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        updateNavbarBackground();
        animateOnScroll();
    });

    // Call updateActiveNavLink once on page load to set the correct active state
    updateActiveNavLink();

    // Scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll('.activity-card, .timeline-item, .about-text, .about-image');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Initialize typing effect
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.innerHTML;
    
    // Start typing effect after a short delay
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 50);
    }, 500);

    // Stats counter animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat h3');
        
        stats.forEach(stat => {
            const target = parseInt(stat.innerText);
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.innerText = target + (stat.innerText.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.innerText = Math.floor(current) + (stat.innerText.includes('+') ? '+' : '');
                }
            }, 30);
        });
    }

    // Trigger stats animation when about section comes into view
    const aboutSection = document.querySelector('.about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(aboutSection);

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Contact form functionality (if you add a form later)
    function handleContactForm() {
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add your form submission logic here
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
            });
        }
    }

    handleContactForm();

    // Add loading animation
    function showPageContent() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    showPageContent();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Press 'h' to go to home
        if (e.key === 'h' || e.key === 'H') {
            document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'a' to go to about
        if (e.key === 'a' || e.key === 'A') {
            document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        }
        // Press 'c' to go to contact
        if (e.key === 'c' || e.key === 'C') {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Easter egg - Konami code
    let konamiCode = [];
    const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > correctCode.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.toString() === correctCode.toString()) {
            // Easter egg activated!
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
                alert('🎉 Konami Code activated! You found the secret!');
            }, 2000);
        }
    });

    // Add rainbow animation for easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Initialize all animations
    setTimeout(() => {
        animateOnScroll();
    }, 300);
});

// Utility functions
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

// Performance optimization for scroll events
const debouncedScroll = debounce(() => {
    updateNavbarBackground();
    animateOnScroll();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Theme toggle (for future enhancement)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Call loadTheme when page loads
document.addEventListener('DOMContentLoaded', loadTheme);
