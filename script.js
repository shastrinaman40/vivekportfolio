// Interactive JavaScript for Vivek Portfolio
const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
const sections = Array.from(document.querySelectorAll('section[id]'));
const header = document.querySelector('header');
const heroTitle = document.querySelector('#hero h2');
const projects = Array.from(document.querySelectorAll('.project'));
let lastScrollTop = 0;
let backToTopButton;
let themeToggleButton;
let hamburgerButton;
let navMenu;
const headlinePhrases = [
    "Hello, I'm Vivek",
    "Crafting bold visual stories",
    "Designing brands that shine"
];
let headlineIndex = 0;
let isTyping = false;

const canvas = document.getElementById('background-canvas');
let ctx, cw, ch, dpr, particles = [], mouse = { x: 0, y: 0 }, scrollRatio = 0;

function resizeBackgroundCanvas() {
    if (!canvas) return;
    cw = window.innerWidth;
    ch = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticle() {
    const size = 3 + Math.random() * 16;
    return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4,
        size,
        alpha: 0.08 + Math.random() * 0.18,
        speed: 0.05 + Math.random() * 0.2,
        shift: Math.random() * Math.PI * 2
    };
}

function initBackgroundAnimation() {
    if (!canvas) return;
    resizeBackgroundCanvas();
    particles = Array.from({ length: 90 }, () => createParticle());
    window.requestAnimationFrame(animateBackground);
}

function updateMousePosition(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
}

function updateScrollRatio() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollRatio = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, cw, ch);
    gradient.addColorStop(0, 'rgba(38, 52, 113, 0.55)');
    gradient.addColorStop(0.6, 'rgba(8, 15, 34, 0.95)');
    gradient.addColorStop(1, 'rgba(5, 9, 18, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cw, ch);
}

function animateBackground() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    drawBackground();

    const centerX = cw * 0.5;
    const centerY = ch * 0.5;
    const targetX = mouse.x || centerX;
    const targetY = mouse.y || centerY;

    particles.forEach(particle => {
        const dx = (targetX - particle.x) * 0.0006;
        const dy = (targetY - particle.y) * 0.0006;
        particle.vx += dx;
        particle.vy += dy;
        particle.x += particle.vx + Math.sin(particle.shift + scrollRatio * Math.PI * 2) * 0.35;
        particle.y += particle.vy + Math.cos(particle.shift + scrollRatio * Math.PI * 2) * 0.32;
        particle.vx *= 0.96;
        particle.vy *= 0.96;

        if (particle.x < -40) particle.x = cw + 40;
        if (particle.x > cw + 40) particle.x = -40;
        if (particle.y < -40) particle.y = ch + 40;
        if (particle.y > ch + 40) particle.y = -40;

        const radius = particle.size + Math.sin(particle.shift + scrollRatio * Math.PI * 4) * 2;
        ctx.beginPath();
        const alpha = Math.min(1, Math.max(0.1, particle.alpha + (scrollRatio - 0.5) * 0.2));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
    });
    window.requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', () => {
    resizeBackgroundCanvas();
    particles = Array.from({ length: 90 }, () => createParticle());
});
window.addEventListener('mousemove', updateMousePosition);
window.addEventListener('scroll', updateScrollRatio);
window.addEventListener('load', initBackgroundAnimation);

function smoothScrollTo(target) {
    const headerOffset = 80;
    const elementPosition = target.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function updateActiveNav() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const id = section.id;
        const link = navLinks.find(nav => nav.getAttribute('href') === `#${id}`);

        if (!link) return;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleHeaderScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (backToTopButton) {
        backToTopButton.classList.toggle('show', scrollTop > 400);
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

function createBackToTopButton() {
    backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.textContent = '↑ Top';
    backToTopButton.title = 'Back to top';
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTopButton);
}

function createThemeToggle() {
    themeToggleButton = document.createElement('button');
    themeToggleButton.className = 'theme-toggle';
    themeToggleButton.textContent = 'Dark mode';
    const storedTheme = localStorage.getItem('portfolio-theme') || 'light';
    document.body.classList.toggle('dark-theme', storedTheme === 'dark');
    themeToggleButton.textContent = storedTheme === 'dark' ? 'Light mode' : 'Dark mode';

    themeToggleButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        themeToggleButton.textContent = isDark ? 'Light mode' : 'Dark mode';
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    });

    document.body.appendChild(themeToggleButton);
}

function setupMobileMenu() {
    hamburgerButton = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerButton.contains(e.target) && !navMenu.contains(e.target)) {
                hamburgerButton.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

function createProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="project-modal-content">
            <button class="project-modal-close" aria-label="Close project details">×</button>
            <div class="project-modal-body"></div>
        </div>
    `;

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.classList.contains('project-modal-close')) {
            modal.classList.remove('show');
        }
    });

    document.body.appendChild(modal);
    return modal;
}

function showProjectModal(project) {
    const modal = document.querySelector('.project-modal');
    const body = modal.querySelector('.project-modal-body');
    const title = project.querySelector('h3').textContent;
    const description = project.querySelector('p').textContent;
    const image = project.querySelector('img');
    const video = project.querySelector('video');

    body.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;

    if (video) {
        const source = video.querySelector('source');
        if (source && source.src) {
            const videoClone = document.createElement('video');
            videoClone.controls = true;
            videoClone.style.width = '100%';
            videoClone.style.maxHeight = '450px';
            videoClone.innerHTML = `<source src="${source.src}" type="${source.type || 'video/mp4'}">`;
            body.prepend(videoClone);
        }
    } else if (image) {
        const clone = image.cloneNode(true);
        clone.alt = title;
        body.prepend(clone);
    }

    modal.classList.add('show');
}

function setupProjectCards() {
    createProjectModal();
    projects.forEach(project => {
        project.style.cursor = 'pointer';
        project.addEventListener('click', () => showProjectModal(project));
    });
}

function setupSectionAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        heroTitle.innerHTML = `${text.substring(0, i + 1)}<span class="cursor">|</span>`;
        setTimeout(() => typeWriter(text, i + 1, fnCallback), 90);
    } else {
        heroTitle.innerHTML = text;
        if (typeof fnCallback === 'function') {
            setTimeout(fnCallback, 1400);
        }
    }
}

function cycleHeadlines() {
    if (isTyping) return;
    isTyping = true;
    const nextHeadline = headlinePhrases[headlineIndex];

    heroTitle.textContent = '';
    typeWriter(nextHeadline, 0, () => {
        isTyping = false;
        headlineIndex = (headlineIndex + 1) % headlinePhrases.length;
        setTimeout(cycleHeadlines, 2800);
    });
}

window.addEventListener('load', () => {
    createBackToTopButton();
    createThemeToggle();
    setupProjectCards();
    setupSectionAnimations();
    setupMobileMenu();
    updateActiveNav();
    handleHeaderScroll();
    cycleHeadlines();
});

window.addEventListener('scroll', () => {
    updateActiveNav();
    handleHeaderScroll();
});

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) smoothScrollTo(target);
    });
});

const customStyle = document.createElement('style');
customStyle.textContent = `
    .cursor { animation: blink 1s infinite; }
    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
`;
document.head.appendChild(customStyle);
