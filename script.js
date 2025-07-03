// JavaScript interaktif dengan GSAP, Three.js (WebGL), dan validasi tingkat lanjut

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initial setup ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Setel tahun footer saat ini
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        gsap.to(preloader, { 
            opacity: 0, 
            duration: 1, 
            onComplete: () => preloader.style.display = 'none' 
        });
        
        // Mulai animasi utama setelah preloader hilang
        startMainAnimations();
    });

    // --- Mode Gelap/Terang ---
    const themeToggle = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    // Cek tema tersimpan atau preferensi sistem
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Fungsi untuk memperbarui ikon toggle
    const updateIcons = () => {
        if (document.documentElement.classList.contains('dark')) {
            gsap.to(darkIcon, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.3 });
            gsap.to(lightIcon, { autoAlpha: 0, scale: 0, rotate: -360, duration: 0.3 });
        } else {
            gsap.to(darkIcon, { autoAlpha: 0, scale: 0, rotate: 360, duration: 0.3 });
            gsap.to(lightIcon, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.3 });
        }
    };
    updateIcons(); // Panggil saat memuat halaman

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        updateIcons();
    });


    // --- Latar Belakang Partikel WebGL (Three.js) ---
    const webglContainer = document.getElementById('webgl-bg');
    if (webglContainer && typeof THREE !== 'undefined') {
        let scene, camera, renderer, particles;
        const particleCount = 5000;
        let mouseX = 0, mouseY = 0;

        // Inisialisasi
        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 300;
            
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            webglContainer.appendChild(renderer.domElement);
            
            // Buat partikel
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            
            for(let i = 0; i < particleCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 1000;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                size: 1.5,
                color: 0x00f2fe, // Warna neon cyan
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending
            });
            
            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            document.addEventListener('mousemove', onMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);
        };
        
        // Animasi loop
        const animate = () => {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.0001;
            particles.rotation.x = time * 0.25;
            particles.rotation.y = time * 0.5;
            
            // Interaksi mouse
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        };
        
        // Event listeners
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onMouseMove = (event) => {
             mouseX = (event.clientX - window.innerWidth / 2);
             mouseY = (event.clientY - window.innerHeight / 2);
        };
        
        init();
        animate();
    }
    

    // --- Menu Navigasi Responsif ---
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const menuTimeline = gsap.timeline({ paused: true });
    menuTimeline.to(mobileMenu, { x: 0, duration: 0.5, ease: 'power3.inOut' });
    
    mobileMenuButton.addEventListener('click', () => menuTimeline.play());
    closeMenuButton.addEventListener('click', () => menuTimeline.reverse());
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => menuTimeline.reverse());
    });
    
    // Header transparan saat di atas
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'header-scrolled', target: '#main-header' }
    });

    // --- Gulir Halus (Smooth Scroll) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: targetId, offsetY: 70 },
                ease: 'power2.inOut'
            });
        });
    });

    // --- Animasi Saat Gulir (Scroll-Triggered Animations) ---
    const startMainAnimations = () => {
        // Animasi Hero Section
        gsap.from(".hero-text-reveal", {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out',
            delay: 0.5
        });

        gsap.from(".hero-fade-in", {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            delay: 1.2,
            stagger: 0.3
        });
        
        // Animasi Judul Section
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Animasi Galeri Proyek (Masonry)
        gsap.from('.masonry-item', {
            opacity: 0,
            y: 80,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#project-gallery',
                start: 'top 80%'
            }
        });
        
        // Animasi Section "About"
        gsap.from('.about-image-container', {
            opacity: 0, x: -100, duration: 1, scrollTrigger: { trigger: '#about', start: 'top 70%'}
        });
        gsap.from('.about-content', {
            opacity: 0, x: 100, duration: 1, scrollTrigger: { trigger: '#about', start: 'top 70%'}
        });
        
        // Animasi parallax gambar 'about'
        gsap.to('.about-image-container img', {
           y: -50,
           scrollTrigger: {
               trigger: '#about',
               start: 'top bottom',
               end: 'bottom top',
               scrub: true
           }
        });
    };

    // --- Kartu Produk 3D Interaktif ---
    const projectCards = document.querySelectorAll('.project-card-3d');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateY = -1 * ((x - rect.width / 2) / (rect.width / 2)) * 10; // -10 to 10 deg
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 10; // -10 to 10 deg
            
            gsap.to(card, {
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
                duration: 1,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // --- Validasi Formulir Kontak Real-time ---
    const contactForm = document.getElementById('contact-form');
    const inputs = contactForm.querySelectorAll('input, textarea');

    const validateInput = (input) => {
        const errorMsg = input.nextElementSibling;
        let isValid = true;
        
        if (input.required && input.value.trim() === '') {
            isValid = false;
        }
        
        if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            isValid = false;
        }

        if (!isValid) {
            input.classList.add('is-invalid');
            gsap.to(errorMsg, { autoAlpha: 1, y: 0, duration: 0.3 });
        } else {
            input.classList.remove('is-invalid');
            gsap.to(errorMsg, { autoAlpha: 0, y: -10, duration: 0.3 });
        }
        return isValid;
    };
    
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
    });
    
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Animasi berhasil
            const successMsg = document.getElementById('form-success-message');
            gsap.to(contactForm, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    gsap.fromTo(successMsg, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
                }
            });
        } else {
            // Animasi goyang untuk form jika ada error
            gsap.fromTo(contactForm, 
                { x: -10 }, 
                { x: 10, clearProps: "x", repeat: 5, duration: 0.05, ease: 'power1.inOut' }
            );
        }
    });

    // --- Tombol Scroll ke Atas ---
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    gsap.to(scrollToTopBtn, {
        autoAlpha: 1,
        scrollTrigger: {
            trigger: 'body',
            start: '20% top',
            end: 'bottom bottom',
            toggleActions: 'play none none reverse'
        }
    });
});