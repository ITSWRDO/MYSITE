// ========== LENIS SMOOTH SCROLL ========== //
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// ========== NAVBAR LOGIC ========== //
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars', !navLinks.classList.contains('active'));
            icon.classList.toggle('fa-times', navLinks.classList.contains('active'));
        }
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
if (sections.length && navLinksItems.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ========== SCROLL REVEAL (IntersectionObserver) ========== //
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-right, .fade-left, .fade-in, .project-card, .service-card').forEach(el => {
    revealObserver.observe(el);
});

// ========== NUMBER COUNTER ANIMATION ========== //
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.counter').forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    let count = 0;
                    const update = () => {
                        count += target / 40;
                        if (count < target) {
                            const val = Math.ceil(count);
                            counter.innerHTML = (target === 10 || target === 8)
                                ? val + '<span class="plus">+</span>'
                                : val;
                            setTimeout(update, 30);
                        } else {
                            counter.innerHTML = (target === 6 || target === 8)
                                ? target + '<span class="plus">+</span>'
                                : target;
                        }
                    };
                    update();
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    statsObserver.observe(statsGrid);
}

// ========== SKILL NOTE MODAL ========== //
const skillData = {
    'html-css-note': {
        title: 'HTML & CSS',
        desc: 'I build websites from scratch using semantic HTML5 elements like <main>, <section>, <article>, and <nav> for clean structure and better SEO. On the CSS side, I work with Flexbox and CSS Grid for responsive layouts, CSS custom properties (variables) for theming, keyframe animations and transitions for micro-interactions, and media queries for fully responsive designs across all devices. I also implement dark mode themes, glassmorphism effects, and modern typography using Google Fonts. Every project I build is mobile-first and optimized for performance.'
    },
    'js-note': {
        title: 'JavaScript',
        desc: 'I write modern ES6+ JavaScript including arrow functions, destructuring, template literals, and modules. I\'m experienced with DOM manipulation (querySelector, event listeners, classList), asynchronous programming using async/await and the Fetch API for working with REST APIs, and the Intersection Observer API for scroll-based animations. I also use localStorage for client-side data persistence, build interactive UI components like modals, carousels, and form validation from scratch, and integrate third-party libraries like Lenis for smooth scrolling. All my projects use vanilla JS — no frameworks needed.'
    },
    'arduino-note': {
        title: 'Arduino & Microcontrollers',
        desc: 'I have extensive experience with C++ for embedded systems, specifically working with AVR and ESP32 architectures. I can design and implement complex control logic for robotics, integrate various sensors (IMUs, Ultrasonic, LiDAR), and handle real-time communication protocols like I2C, SPI, and UART. My work includes building custom motor drivers, PWM-based ESC controllers, and PID-stabilized flight systems. I focus on writing memory-efficient code and optimizing hardware-level performance.'
    },
    'pi-note': {
        title: 'Raspberry Pi',
        desc: 'I use the Raspberry Pi as a versatile hub for both robotics and server infrastructure. I\'m experienced in headless setup, OS optimization (Ubuntu Server/Raspberry Pi OS), and utilizing GPIO pins for hardware interfacing. I\'ve built various projects including a custom NAS, private cloud storage, and automated robotics controllers. I manage these systems long-term, ensuring reliability through monitoring and automated backups.'
    },
    'linux-note': {
        title: 'Linux Systems',
        desc: 'Linux is my primary environment for development and hosting. I am proficient in the Bash command line, managing file systems, and handling strict permission settings (chmod/chown). I have a deep understanding of systemd for managing background services, package management via APT, and network configuration. I prefer the terminal for its speed and power, managing everything from remote SSH access to complex shell scripting for automation.'
    },
    'nginx-note': {
        title: 'Nginx Web Server',
        desc: 'I use Nginx as a high-performance web server and reverse proxy. My experience includes writing custom server blocks, setting up SSL/TLS encryption via Certbot/Let\'s Encrypt, and managing static assets efficiently. I configure reverse proxies to route traffic securely to internal services, implement Gzip compression for faster load times, and handle subdomains for organized self-hosting infrastructure.'
    },
    'cloudflare-note': {
        title: 'Cloudflare & Security',
        desc: 'I leverage Cloudflare for robust DNS management and enhanced security. I specifically use Cloudflare Tunnels (cloudflared) to expose my self-hosted services to the web securely without opening any ports on my local router. This provides an additional layer of protection through Cloudflare\'s WAF and DDoS protection. I also manage SSL/TLS certificates and leverage Cloudflare\'s CDN capabilities to ensure global availability and security for my projects.'
    }
};

const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('skillModalTitle');
const modalDesc = document.getElementById('skillModalDesc');
const modalClose = document.querySelector('.skill-modal-close');

document.querySelectorAll('.skill-note-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const noteId = toggle.getAttribute('data-note');
        const data = skillData[noteId];
        if (!data || !modal) return;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modal.classList.add('active');
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.remove('active');
    });
}

// ========== CARD HOVER EFFECTS ========== //
document.querySelectorAll('.project-card, .skill-category, .service-card, .showcase-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
