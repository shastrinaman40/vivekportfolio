
// Enhanced JavaScript for Vivek Portfolio

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add('scrolled');
    } else if (scrollTop < lastScrollTop) {
        header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Enhanced Intersection Observer with different animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, index * 150);
        }
    });
}, observerOptions);

// Apply animations to different elements
document.querySelectorAll('section').forEach(section => {
    section.classList.add('loading');
    observer.observe(section);
});

document.querySelectorAll('.skill').forEach((skill, index) => {
    skill.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(skill);
});

document.querySelectorAll('.project').forEach((project, index) => {
    project.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(project);
});

// Typing animation for hero text
const heroTitle = document.querySelector('#hero h2');
const originalText = heroTitle.textContent;
let isTyping = false;

function typeWriter(text, i, fnCallback) {
    if (i < text.length && !isTyping) {
        isTyping = true;
        heroTitle.innerHTML = text.substring(0, i+1) + '<span class="cursor">|</span>';

        setTimeout(() => {
            typeWriter(text, i + 1, fnCallback);
        }, 100);
    } else if (i === text.length) {
        heroTitle.innerHTML = text;
        isTyping = false;
        if (typeof fnCallback === 'function') {
            setTimeout(fnCallback, 700);
        }
    }
}

// Start typing animation after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        heroTitle.textContent = '';
        typeWriter(originalText, 0, () => {
            // Animation complete
        });
    }, 500);
});

// Mouse parallax effect for background
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;

        element.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add parallax attributes to elements
document.querySelector('#hero::before').setAttribute('data-parallax', '0.3');
document.querySelector('#about::before').setAttribute('data-parallax', '0.2');
document.querySelector('#contact::before').setAttribute('data-parallax', '0.2');

// Skill progress animation on hover
document.querySelectorAll('.skill li').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(15px) scale(1.05)';
        item.style.color = '#ffeaa7';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0) scale(1)';
        item.style.color = '';
    });
});

// Project hover effects
document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        project.style.transform = 'translateY(-25px) scale(1.05) rotateY(5deg)';
    });

    project.addEventListener('mouseleave', () => {
        project.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
    });
});

// Button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    scrollProgress.style.width = scrollPercent + '%';
});

// Add CSS for scroll progress
const style = document.createElement('style');
style.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.3s ease;
    }

    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .cursor {
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounced scroll handler
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based animations can be added here
}, 16));

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading class styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.8s ease;
    }

    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);