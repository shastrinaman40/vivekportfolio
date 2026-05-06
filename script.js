// Simple JavaScript for Vivek Portfolio

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

// Simple fade-in animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(section);
});

// Simple hover effects
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        skill.style.transform = 'translateY(-10px)';
    });

    skill.addEventListener('mouseleave', () => {
        skill.style.transform = 'translateY(0)';
    });
});

document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('mouseenter', () => {
        project.style.transform = 'translateY(-10px)';
    });

    project.addEventListener('mouseleave', () => {
        project.style.transform = 'translateY(0)';
    });
});

// Typing animation for hero text
const heroTitle = document.querySelector('#hero h2');
const originalText = heroTitle.textContent;

function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        heroTitle.innerHTML = text.substring(0, i+1) + '<span class="cursor">|</span>';

        setTimeout(() => {
            typeWriter(text, i + 1, fnCallback);
        }, 100);
    } else {
        heroTitle.innerHTML = text;
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

// Add cursor blink animation
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);