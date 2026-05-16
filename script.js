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
let ctx, cw, ch, dpr, entities = [], mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, scrollRatio = 0;
const iconTypes = ['play', 'film', 'wave', 'slider', 'reel'];

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

function createEntity() {
    const size = 14 + Math.random() * 28;
    return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.6,
        size,
        alpha: 0.18 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        type: iconTypes[Math.floor(Math.random() * iconTypes.length)],
        drift: 0.03 + Math.random() * 0.14
    };
}

function initBackgroundAnimation() {
    if (!canvas) return;
    resizeBackgroundCanvas();
    entities = Array.from({ length: 95 }, createEntity);
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
    const isDark = document.body.classList.contains('dark-theme');
    const gradient = ctx.createLinearGradient(0, 0, cw, ch);
    if (isDark) {
        gradient.addColorStop(0, 'rgba(26, 42, 96, 0.95)');
        gradient.addColorStop(0.5, 'rgba(10, 16, 34, 0.95)');
        gradient.addColorStop(1, 'rgba(4, 8, 16, 1)');
    } else {
        gradient.addColorStop(0, 'rgba(240, 248, 255, 0.95)');
        gradient.addColorStop(0.5, 'rgba(221, 231, 247, 0.95)');
        gradient.addColorStop(1, 'rgba(196, 209, 238, 1)');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cw, ch);
    const lineCount = 5;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(63, 103, 173, 0.12)';
    for (let i = 1; i <= lineCount; i++) {
        const y = (ch / (lineCount + 1)) * i;
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(scrollRatio * Math.PI * 3 + i) * 8);
        ctx.lineTo(cw, y + Math.sin(scrollRatio * Math.PI * 3 + i + 1) * 8);
        ctx.stroke();
    }
    ctx.restore();
}

function drawEntity(entity) {
    const hue = 195 + scrollRatio * 40 + Math.sin(entity.phase) * 12;
    const stroke = `hsla(${hue}, 85%, 76%, ${entity.alpha})`;
    const fill = `hsla(${hue}, 75%, 54%, ${Math.max(0.14, entity.alpha - 0.05)})`;
    ctx.save();
    ctx.translate(entity.x, entity.y);
    ctx.rotate(entity.rotation + Math.sin(entity.phase + scrollRatio * Math.PI) * 0.18);
    ctx.lineWidth = Math.max(1, entity.size * 0.1);
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;

    switch (entity.type) {
        case 'play':
            ctx.beginPath();
            ctx.moveTo(-entity.size * 0.3, -entity.size * 0.45);
            ctx.lineTo(entity.size * 0.5, 0);
            ctx.lineTo(-entity.size * 0.3, entity.size * 0.45);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'film':
            ctx.beginPath();
            ctx.rect(-entity.size * 0.45, -entity.size * 0.28, entity.size * 0.9, entity.size * 0.56);
            ctx.fill();
            ctx.stroke();
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.arc(-entity.size * 0.32 + i * (entity.size * 0.16), 0, entity.size * 0.06, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.fill();
            }
            break;
        case 'wave':
            const bars = 5;
            for (let i = 0; i < bars; i++) {
                const barHeight = entity.size * 0.12 + Math.sin(entity.phase + i * 0.7 + scrollRatio * Math.PI * 3) * entity.size * 0.22;
                const x = -entity.size * 0.35 + i * (entity.size * 0.17);
                ctx.beginPath();
                ctx.rect(x, -barHeight / 2, entity.size * 0.12, barHeight);
                ctx.fill();
            }
            break;
        case 'slider':
            ctx.beginPath();
            ctx.moveTo(-entity.size * 0.45, 0);
            ctx.lineTo(entity.size * 0.45, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(entity.size * (Math.sin(entity.phase) * 0.22), 0, entity.size * 0.18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'reel':
            ctx.beginPath();
            ctx.arc(0, 0, entity.size * 0.32, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(Math.cos(i * Math.PI * 2 / 3) * entity.size * 0.17, Math.sin(i * Math.PI * 2 / 3) * entity.size * 0.17, entity.size * 0.08, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.fill();
            }
            break;
    }
    ctx.restore();
}

function animateBackground() {
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    drawBackground();

    const targetX = mouse.x || cw * 0.5;
    const targetY = mouse.y || ch * 0.5;

    entities.forEach(entity => {
        const attraction = 0.0006 + scrollRatio * 0.0008;
        const dx = (targetX - entity.x) * attraction;
        const dy = (targetY - entity.y) * attraction;
        entity.vx += dx * entity.drift;
        entity.vy += dy * entity.drift;
        entity.x += entity.vx + Math.cos(entity.phase + scrollRatio * Math.PI * 2) * 0.4;
        entity.y += entity.vy + Math.sin(entity.phase + scrollRatio * Math.PI * 2) * 0.34;
        entity.vx *= 0.94;
        entity.vy *= 0.94;
        entity.phase += 0.02;

        if (entity.x < -entity.size) entity.x = cw + entity.size;
        if (entity.x > cw + entity.size) entity.x = -entity.size;
        if (entity.y < -entity.size) entity.y = ch + entity.size;
        if (entity.y > ch + entity.size) entity.y = -entity.size;

        drawEntity(entity);
    });
    window.requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', () => {
    resizeBackgroundCanvas();
    entities = Array.from({ length: 95 }, createEntity);
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

    const navContainer = document.querySelector('nav .container');
    if (navContainer) {
        navContainer.appendChild(themeToggleButton);
    } else {
        document.body.appendChild(themeToggleButton);
    }
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
