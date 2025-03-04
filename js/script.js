document.addEventListener('DOMContentLoaded', () => {
    // Theme toggler dengan animasi
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');

    // Theme toggle handler dengan animasi
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Animasi transisi tema
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        document.body.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
    });

    function updateThemeIcon(isDark) {
        themeIcon.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
    }

    // Smooth scrolling dengan offset untuk navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animasi scroll reveal yang lebih halus
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Navbar scroll effect yang lebih halus
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('navbar-scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('navbar-scrolled')) {
            // Scroll down
            navbar.classList.add('navbar-scrolled');
        } else if (currentScroll < lastScroll && navbar.classList.contains('navbar-scrolled')) {
            // Scroll up
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Active navigation link dengan debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section');
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const currentId = section.getAttribute('id');
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100);
    });

    // Form submission handler dengan validasi yang lebih baik
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('input[type="text"]').value.trim();
            const email = contactForm.querySelector('input[type="email"]').value.trim();
            const message = contactForm.querySelector('textarea').value.trim();
            
            // Validasi form
            if (!name || !email || !message) {
                showNotification('Mohon lengkapi semua field', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Email tidak valid', 'error');
                return;
            }
            
            try {
                // Simulasi pengiriman form
                showNotification('Mengirim pesan...', 'info');
                
                // Di sini Anda bisa menambahkan kode untuk mengirim data ke server
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNotification('Pesan Anda telah terkirim!', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
            }
        });
    }

    // Fungsi validasi email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Fungsi notifikasi
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animasi masuk
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Animasi keluar
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Inisialisasi Lottie Animations dengan optimasi
    const lottieElements = document.querySelectorAll('lottie-player');
    const lottieObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });

    lottieElements.forEach(element => {
        lottieObserver.observe(element);
    });

    // Tambahkan class scroll-reveal ke elemen-elemen yang perlu di-animate
    document.querySelectorAll('.skill-card, .portfolio-item, .about-content, .contact-info').forEach(el => {
        el.classList.add('scroll-reveal');
    });
}); 