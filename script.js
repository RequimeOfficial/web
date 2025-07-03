// JavaScript interaktif dengan GSAP, Three.js, dan validasi tingkat lanjut

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan GSAP dan ScrollTrigger sudah dimuat
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP atau ScrollTrigger tidak dimuat!");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // --- INISIALISASI ---
    initThemeToggle();
    initMobileMenu();
    initStickyNavbar();
    initWebGLBackground();
    initScrollAnimations();
    init3DProductCards();
    initContactFormValidation();
    initScrollToTop();
    initMisc();

    // --- THEME TOGGLE (DARK/LIGHT MODE) ---
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const lightIcon = document.getElementById('theme-toggle-light-icon');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                darkIcon.classList.remove('hidden');
                lightIcon.classList.add('hidden');
            } else {
                document.documentElement.classList.remove('dark');
                darkIcon.classList.add('hidden');
                lightIcon.classList.remove('hidden');
            }
        };

        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            gsap.to(document.body, { 
                opacity: 0, 
                duration: 0.3,
                onComplete: () => {
                    applyTheme(theme);
                    gsap.to(document.body, { opacity: 1, duration: 0.3 });
                }
            });
        });
    }

    // --- RESPONSIVE NAVIGATION ---
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        const menuTimeline = gsap.timeline({ paused: true });
        menuTimeline.to(mobileMenu, { x: '0%', duration: 0.5, ease: 'power2.inOut' });

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            menuTimeline.reversed() ? menuTimeline.play() : menuTimeline.reverse();
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                 hamburger.classList.remove('is-active');
                 menuTimeline.reverse();
            });
        });
    }

    // --- STICKY NAVIGATION BAR ---
    function initStickyNavbar() {
        const navbar = document.getElementById('navbar');
        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }
    
    // --- WEBGL PARTICLE BACKGROUND ---
    function initWebGLBackground() {
        if (typeof THREE === 'undefined') {
            console.error("Three.js tidak dimuat!");
            return;
        }

        const canvas = document.getElementById('webgl-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.015,
            color: '#00f2fe',
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        camera.position.z = 3;

        const mouse = { x: 0, y: 0 };
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const clock = new THREE.Clock();
        function animate() {
            const elapsedTime = clock.getElapsedTime();
            
            particles.rotation.y = elapsedTime * 0.05;
            particles.rotation.x = mouse.y * 0.2;
            particles.rotation.y += mouse.x * 0.2;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    // --- SCROLL-TRIGGERED ANIMATIONS ---
    function initScrollAnimations() {
        gsap.utils.toArray('.reveal-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 50, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: parseFloat(elem.style.getPropertyValue('--delay')) || 0
                }
            );
        });

        // Hero title stagger animation
        gsap.from(".hero-title-word", {
            y: 100,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            delay: 0.5
        });
    }

    // --- 3D INTERACTIVE PRODUCT CARDS ---
    function init3DProductCards() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = -1 * (y / rect.height - 0.5) * 20; // max 10deg rotation
                const rotateY = (x / rect.width - 0.5) * 20; // max 10deg rotation
                
                gsap.to(cardInner, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(cardInner, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: 'elastic.out(1, 0.5)',
                    duration: 1.2
                });
            });
        });
    }

    // --- REAL-TIME CONTACT FORM VALIDATION ---
    function initContactFormValidation() {
        const form = document.getElementById('contact-form');
        const feedbackEl = document.getElementById('form-feedback');
        if (!form) return;

        const inputs = form.querySelectorAll('input[required], textarea[required]');

        const validateField = (field) => {
            const errorEl = field.closest('.form-group').querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';

            if (field.value.trim() === '') {
                isValid = false;
                errorMessage = 'Kolom ini tidak boleh kosong.';
            } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                isValid = false;
                errorMessage = 'Format email tidak valid.';
            }

            if (!isValid) {
                field.classList.add('has-error');
                errorEl.textContent = errorMessage;
                gsap.fromTo(errorEl, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
                gsap.fromTo(field, { x: -5 }, { x: 5, duration: 0.05, repeat: 3, yoyo: true, clearProps: 'x' });
            } else {
                field.classList.remove('has-error');
                errorEl.textContent = '';
            }
            return isValid;
        };
        
        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                feedbackEl.textContent = 'Terima kasih! Pesan Anda telah terkirim.';
                feedbackEl.className = 'mt-8 text-center text-green-400';
                form.reset();
                setTimeout(() => {
                    feedbackEl.textContent = '';
                }, 5000);
            } else {
                 feedbackEl.textContent = 'Mohon perbaiki kolom yang ditandai.';
                 feedbackEl.className = 'mt-8 text-center text-pink-500';
            }
        });
    }
    
    // --- SCROLL TO TOP BUTTON ---
    function initScrollToTop() {
        const btn = document.getElementById('scroll-to-top');
        ScrollTrigger.create({
            start: "top -30%",
            onUpdate: self => {
                if (self.isActive) {
                     gsap.to(btn, { opacity: 1, y: 0, duration: 0.3 });
                } else {
                     gsap.to(btn, { opacity: 0, y: 10, duration: 0.3 });
                }
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- MISCELLANEOUS ---
    function initMisc() {
        // Set current year in footer
        document.getElementById('current-year').textContent = new Date().getFullYear();

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
});