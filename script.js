// JavaScript interaktif dengan GSAP untuk animasi canggih dan validasi form.

document.addEventListener('DOMContentLoaded', () => {

    // --- Inisialisasi GSAP & Plugin ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Konfigurasi Tailwind CSS untuk Font Kustom ---
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    heading: ['Poppins', 'sans-serif'],
                    body: ['Inter', 'sans-serif'],
                },
                colors: {
                    'primary-dark': '#0A0A10',
                    'primary-light': '#111118',
                    'accent': '#00F2FE',
                    'text-light': '#E0E0E0',
                    'text-dark': '#A0A0A0',
                    'error': '#FF4747',
                }
            }
        }
    }
    
    // --- Navigasi & Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // --- Menu Hamburger Mobile ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('-translate-y-full');
        hamburgerBtn.querySelector('i').classList.toggle('fa-bars');
        hamburgerBtn.querySelector('i').classList.toggle('fa-times');
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('-translate-y-full');
            hamburgerBtn.querySelector('i').classList.remove('fa-times');
            hamburgerBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- Animasi Hero Section Saat Load ---
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
        .from('#hero-title', { opacity: 0, y: 50, duration: 1 })
        .from('#hero-tagline', { opacity: 0, y: 30, duration: 0.8 }, "-=0.6")
        .from('#hero-cta', { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.5");

    // --- Animasi Scroll-Triggered untuk Elemen ---
    const animateOnScroll = (selector, animProps, stagger = 0) => {
        gsap.utils.toArray(selector).forEach(elem => {
            gsap.from(elem, {
                ...animProps,
                stagger,
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none none',
                },
            });
        });
    };
    
    animateOnScroll('.section-heading', { opacity: 0, y: 50, duration: 0.8, ease: 'power3.out' });
    animateOnScroll('#about img', { opacity: 0, x: -50, duration: 1, ease: 'power3.out' });
    animateOnScroll('#about p', { opacity: 0, x: 50, duration: 1, ease: 'power3.out' }, 0.2);
    animateOnScroll('.skill-card', { opacity: 0, y: 40, scale: 0.9, duration: 0.5, ease: 'back.out(1.7)' }, 0.1);
    animateOnScroll('.project-card', { opacity: 0, y: 50, duration: 0.7, ease: 'power3.out' }, 0.2);
    
    // --- Tombol Scroll to Top ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    gsap.to(scrollToTopBtn, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: 'body',
            start: '300px top',
            end: 'bottom bottom',
            scrub: false,
            toggleActions: 'play none none reverse',
        }
    });

    // --- Validasi Form Kontak ---
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Reset state
        this.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('form-input-error');
            input.nextElementSibling.style.display = 'none';
        });
        formFeedback.classList.add('hidden');
        
        const name = this.querySelector('#name');
        const email = this.querySelector('#email');
        const message = this.querySelector('#message');

        if (name.value.trim() === '') {
            showError(name);
            isValid = false;
        }
        if (!validateEmail(email.value)) {
            showError(email);
            isValid = false;
        }
        if (message.value.trim() === '') {
            showError(message);
            isValid = false;
        }
        
        if (isValid) {
            // Tampilkan pesan sukses
            formFeedback.textContent = 'Terima kasih! Pesan Anda telah terkirim.';
            formFeedback.className = 'form-feedback-success mb-6 p-4 rounded-md text-center';
            formFeedback.classList.remove('hidden');
            contactForm.reset();
        } else {
             // Tampilkan pesan error
            formFeedback.textContent = 'Harap perbaiki error sebelum mengirim.';
            formFeedback.className = 'form-feedback-error mb-6 p-4 rounded-md text-center';
            formFeedback.classList.remove('hidden');
        }
    });

    function showError(input) {
        input.classList.add('form-input-error');
        input.nextElementSibling.style.display = 'block';
        gsap.fromTo(input, { x: 0 }, { x: -10, duration: 0.1, repeat: 5, yoyo: true, ease: 'power2.inOut' });
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // --- Footer Year ---
    document.getElementById('year').textContent = new Date().getFullYear();
});