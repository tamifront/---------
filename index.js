const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;

// cursor glow (desktop only)
let glow = null;
if (!prefersReduced && finePointer) {
    glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let glowVisible = false;
    window.addEventListener('pointermove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        if (!glowVisible) {
            glowVisible = true;
            glow.style.opacity = '1';
        }
    });

    window.addEventListener('pointerleave', () => {
        glow.style.opacity = '0';
        glowVisible = false;
    });
}

// scroll reveal (subtle)
const revealEls = document.querySelectorAll(
    '.reveal, .portfolio-card, .process-card, .about-inner, .cta-section, .metric-card'
);
if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16 }
    );

    revealEls.forEach((el) => {
        el.classList.add('reveal');
        io.observe(el);
    });
} else {
    revealEls.forEach((el) => el.classList.add('reveal-visible'));
}

// card tilt (very restrained, desktop only)
if (!prefersReduced && finePointer) {
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach((card) => {
        const strength = 6;

        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * strength;
            const rotateX = ((y / rect.height) - 0.5) * -strength;

            card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('pointerleave', () => {
            card.style.transform = '';
        });
    });
}

// slight magnetic hover for buttons
if (!prefersReduced && finePointer) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((btn) => {
        btn.addEventListener('pointermove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        });

        btn.addEventListener('pointerleave', () => {
            btn.style.transform = '';
        });
    });
}

// subtle parallax for header
const header = document.querySelector('header');
if (header && !prefersReduced) {
    window.addEventListener(
        'scroll',
        () => {
            const offset = window.scrollY * 0.12;
            header.style.transform = `translateY(${offset * -0.6}px)`;
        },
        { passive: true }
    );
}