document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    const closeMobileMenu = () => {
        if (!hamburger || !navMenu) return;
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Abrir menú');
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('is-open');
            hamburger.classList.toggle('is-active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') closeMobileMenu();
        });
    }

    // Smooth scroll para los links del navbar
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: Math.max(0, targetTop),
                    behavior: 'smooth'
                });
            }
            closeMobileMenu();
        });
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
        });
    }

    // Animación de elementos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar tarjetas de experiencia
    document.querySelectorAll('.exp-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Barrido suave de cada sección al entrar en pantalla
    const sections = document.querySelectorAll('body > section');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('is-visible'));
    } else {
        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        sections.forEach(section => {
            section.classList.add('section-reveal');
            sectionObserver.observe(section);
        });
    }

    // Navbar shadow on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Animación de números en estadísticas
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;

    const countUp = (element) => {
        const target = parseInt(element.textContent);
        const increment = Math.ceil(target / 30);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, 30);
    };

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                stats.forEach(stat => countUp(stat));
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// Funciones del modal CV
function openCVModal() {
    document.getElementById('cvModal').classList.add('show');
}

function closeCVModal() {
    document.getElementById('cvModal').classList.remove('show');
}

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('cvModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
}
