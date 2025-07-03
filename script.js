// JavaScript interaktif dengan GSAP, Three.js (WebGL), dan validasi tingkat lanjut

document.addEventListener('DOMContentLoaded', () => {
    // Registrasi plugin GSAP
    gsap.registerPlugin(ScrollTrigger);

    // =========================================================================
    // Konfigurasi Umum & Inisialisasi
    // =========================================================================
    const isMobile = window.innerWidth < 768;

    // Set tahun saat ini di footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // =========================================================================
    // WebGL Particle Background (Three.js)
    // =========================================================================
    if (THREE && !isMobile) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const container = document.getElementById('webgl-bg');

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);

        const particlesCount = 5000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        
        const color1 = new THREE.Color("#00f2fe"); // Cyan
        const color2 = new THREE.Color("#ff007a"); // Pink

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i] = mixedColor.r;
            colors[i + 1] = mixedColor.g;
            colors[i + 2] = mixedColor.b;
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const animateParticles = () => {
            requestAnimationFrame(animateParticles);
            particleSystem.rotation.y += 0.0005;
            particleSystem.rotation.x += 0.0005;

            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animateParticles();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }


    // =========================================================================
    // Mode Gelap/Terang (Dark/Light Mode)
    // =========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Memeriksa tema tersimpan di localStorage atau preferensi sistem
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    htmlEl.classList.add(currentTheme);

    const toggleTheme = () => {
        const isDark = htmlEl.classList.contains('dark');
        const sunIcon = themeToggle.querySelector('.theme-icon-sun');
        const moonIcon = themeToggle.querySelector('.theme-icon-moon');
        
        gsap.timeline()
            .to(isDark ? moonIcon : sunIcon, { rotate: 90, scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' })
            .call(() => {
                htmlEl.classList.toggle('dark');
                htmlEl.classList.toggle('light');
                localStorage.setItem('theme', isDark ? 'light' : 'dark');
            })
            .fromTo(isDark ? sunIcon : moonIcon, { rotate: -90, scale: 0, opacity: 0 }, { rotate: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    };

    if (currentTheme === 'light') {
         htmlEl.classList.remove('dark');
         htmlEl.classList.add('light');
    }

    themeToggle.addEventListener('click', toggleTheme);


    // =========================================================================
    // Navigasi & Header
    // =========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');

    // Animasi menu mobile slide-in
    const menuTl = gsap.timeline({ paused: true, reversed: true });
    menuTl.to(mobileMenu, { 
        display: 'flex', 
        opacity: 1, 
        clipPath: 'circle(150% at 100% 0)', 
        duration: 0.5, 
        ease: 'power3.inOut' 
    });
    menuTl.from('.mobile-nav-link', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.3
    }, "-=0.2");

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        menuTl.reversed() ? menuTl.play() : menuTl.reverse();
    });

    document.querySelectorAll('.mobile-nav-link, a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn.classList.contains('open')) {
                menuBtn.classList.remove('open');
                menuTl.reverse();
            }
        });
    });

    // Efek header saat scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Smooth scroll untuk semua link internal
    gsap.utils.toArray('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 70 }, ease: "power2.inOut" });
            }
        });
    });

    // =========================================================================
    // Animasi Scroll (GSAP ScrollTrigger)
    // =========================================================================
    // Hero Section Animation
    gsap.from(".hero-char", {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
    });
    gsap.from(".hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });
    gsap.from(".btn-primary", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 1.2 });
    
    // Animasi Parallax Hero
    gsap.to('#hero', {
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        },
        yPercent: 30,
        ease: 'none'
    });


    // Animasi Reveal saat scroll untuk elemen umum
    gsap.utils.toArray('.reveal-text').forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    gsap.utils.toArray('.reveal-card').forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });


    // =========================================================================
    // Kartu Servis 3D Interaktif
    // =========================================================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;  // Max 10 deg

            gsap.to(card, {
                duration: 0.5,
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 1,
                transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
                ease: "elastic.out(1, 0.3)"
            });
        });
    });


    // =========================================================================
    // Formulir Kontak dengan Validasi Real-time
    // =========================================================================
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-input');
    const feedbackEl = document.getElementById('form-feedback');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateInput = (input) => {
        const group = input.parentElement;
        let isValid = true;
        if (input.required && input.value.trim() === '') {
            isValid = false;
        }
        if (input.type === 'email' && !emailRegex.test(input.value)) {
            isValid = false;
        }
        
        if (isValid) {
            group.classList.remove('has-error');
        } else {
            group.classList.add('has-error');
        }
        return isValid;
    };

    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            // Hilangkan error saat pengguna mulai mengetik lagi
             if (input.parentElement.classList.contains('has-error')) {
                validateInput(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            feedbackEl.textContent = 'Sending...';
            feedbackEl.className = 'form-feedback-sending';
            // Simulasi pengiriman form
            setTimeout(() => {
                feedbackEl.textContent = 'Message sent successfully! We will get back to you soon.';
                feedbackEl.className = 'form-feedback-success';
                form.reset();
                inputs.forEach(input => input.parentElement.classList.remove('has-error'));
            }, 1500);
        } else {
            feedbackEl.textContent = 'Please correct the errors before submitting.';
            feedbackEl.className = 'form-feedback-error';
            gsap.fromTo(form, { x: 0 }, { x: -10, duration: 0.05, repeat: 5, yoyo: true, clearProps: "x" });
        }
    });

    // =========================================================================
    // Tombol Scroll to Top
    // =========================================================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    gsap.to(scrollToTopBtn, {
        scrollTrigger: {
            trigger: 'body',
            start: '20% top',
            end: 'bottom bottom',
            toggleClass: { targets: scrollToTopBtn, className: 'is-visible' }
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
         gsap.to(window, { duration: 1, scrollTo: 0, ease: "power2.inOut" });
    });

});