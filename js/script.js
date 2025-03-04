document.addEventListener('DOMContentLoaded', () => {
    // Loading screen with timeout
    const loading = document.querySelector('.loading');
    const loadingTimeout = setTimeout(() => {
        loading.classList.add('hide');
        setTimeout(() => loading.remove(), 500);
    }, 2000); // Maksimum loading time

    window.addEventListener('load', () => {
        clearTimeout(loadingTimeout);
        loading.classList.add('hide');
        setTimeout(() => loading.remove(), 500);
    });

    // Theme Toggle dengan improved performance
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeLabel = document.getElementById('themeLabel');
    const html = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const navbar = document.querySelector('.navbar');
    
    function setTheme(isDark) {
        // Batch DOM updates
        requestAnimationFrame(() => {
            html.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
            
            // Update meta theme-color
            metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
            
            // Update navbar background dengan alpha untuk better readability
            navbar.style.backgroundColor = isDark 
                ? 'rgba(15, 23, 42, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
        });
        
        // Save theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Check system theme dengan cache
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function getSystemTheme() {
        return mediaQuery.matches ? 'dark' : 'light';
    }

    // Initialize theme dengan priority order
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = getSystemTheme();
    setTheme(savedTheme ? savedTheme === 'dark' : systemTheme === 'dark');

    // Theme toggle dengan debounce
    let themeToggleTimeout;
    themeToggle.addEventListener('click', () => {
        clearTimeout(themeToggleTimeout);
        themeToggleTimeout = setTimeout(() => {
            const isDark = html.getAttribute('data-bs-theme') === 'dark';
            setTheme(!isDark);
        }, 150);
    });

    // System theme change listener dengan debounce
    let systemThemeTimeout;
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            clearTimeout(systemThemeTimeout);
            systemThemeTimeout = setTimeout(() => {
                setTheme(e.matches);
            }, 150);
        }
    });

    // Smooth scrolling dengan improved performance
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL tanpa reload
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });

    // Scroll Reveal Animation dengan optimized Intersection Observer
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('active');
                });
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Navbar scroll effect dengan optimized throttling
    let lastScroll = 0;
    let ticking = false;
    const navbarScrollHandler = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                const isDark = html.getAttribute('data-bs-theme') === 'dark';
                
                if (currentScroll <= 0) {
                    navbar.classList.remove('navbar-scrolled');
                    navbar.style.backgroundColor = isDark 
                        ? 'rgba(15, 23, 42, 0.98)' 
                        : 'rgba(255, 255, 255, 0.98)';
                } else {
                    navbar.classList.add('navbar-scrolled');
                    navbar.style.backgroundColor = isDark 
                        ? '#0f172a' 
                        : '#ffffff';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', navbarScrollHandler, { passive: true });

    // Active navigation dengan optimized Intersection Observer
    const navSections = document.querySelectorAll('section');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                requestAnimationFrame(() => {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-50% 0px -50% 0px'
    });

    navSections.forEach(section => {
        navObserver.observe(section);
    });

    // Contact Form dengan improved validation dan feedback
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formInputs = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            message: document.getElementById('message')
        };

        const submitButton = contactForm.querySelector('button[type="submit"]');
        let formSubmitting = false;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (formSubmitting) return;
            formSubmitting = true;
            submitButton.disabled = true;

            // Reset error states
            Object.values(formInputs).forEach(input => {
                input.classList.remove('is-invalid');
            });

            // Validation
            const validationErrors = [];
            
            if (!formInputs.name.value.trim()) {
                formInputs.name.classList.add('is-invalid');
                validationErrors.push('Please enter your name');
            }
            
            if (!formInputs.email.value.trim() || !isValidEmail(formInputs.email.value)) {
                formInputs.email.classList.add('is-invalid');
                validationErrors.push('Please enter a valid email address');
            }
            
            if (!formInputs.message.value.trim()) {
                formInputs.message.classList.add('is-invalid');
                validationErrors.push('Please enter your message');
            }

            if (validationErrors.length > 0) {
                alert(validationErrors.join('\n'));
                formSubmitting = false;
                submitButton.disabled = false;
                return;
            }

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                alert(`Thank you ${formInputs.name.value}! Your message has been received. We will contact you at ${formInputs.email.value} soon.`);
                contactForm.reset();
            } catch (error) {
                alert('An error occurred. Please try again later.');
            } finally {
                formSubmitting = false;
                submitButton.disabled = false;
            }
        });

        // Real-time validation
        Object.entries(formInputs).forEach(([key, input]) => {
            let validationTimeout;
            input.addEventListener('input', () => {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    input.classList.remove('is-invalid');
                    
                    if (key === 'email' && input.value && !isValidEmail(input.value)) {
                        input.classList.add('is-invalid');
                    }
                }, 500);
            });
        });
    }

    // Email validation helper dengan improved regex
    function isValidEmail(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    // Add scroll-reveal class dengan batch processing
    const elementsToAnimate = document.querySelectorAll('.skill-card, .portfolio-item, .about-content, .contact-info');
    requestAnimationFrame(() => {
        elementsToAnimate.forEach(el => {
            if (!el.classList.contains('scroll-reveal')) {
                el.classList.add('scroll-reveal');
            }
        });
    });
});