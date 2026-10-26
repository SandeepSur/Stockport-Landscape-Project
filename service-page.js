// =========================================================
// STOCKPORT LANDSCAPE PROJECT - REUSABLE SERVICE PAGE SCRIPT
// Handles Before/After Slider, FAQ Accordion & Scroll Animations
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // 3. Before / After Interactive Slider (CSS clip-path - zero zoom, zero distortion)
    const baContainers = document.querySelectorAll('.ba-slider-container');
    baContainers.forEach(container => {
        const range = container.querySelector('.ba-range');
        let isDragging = false;

        const updatePosition = (percentage) => {
            const clamped = Math.min(Math.max(percentage, 2), 98);
            container.style.setProperty('--slider-pos', `${clamped}%`);
            if (range && parseFloat(range.value) !== clamped) {
                range.value = clamped;
            }
        };

        // Range input event (keyboard arrow keys & accessible controls)
        if (range) {
            range.addEventListener('input', (e) => {
                updatePosition(parseFloat(e.target.value));
            });
        }

        // Pointer & touch drag support
        const onPointerMove = (e) => {
            if (!isDragging) return;
            const rect = container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const offsetX = clientX - rect.left;
            const percentage = (offsetX / rect.width) * 100;
            updatePosition(percentage);
        };

        const onPointerDown = (e) => {
            isDragging = true;
            onPointerMove(e);
        };

        const onPointerUp = () => {
            isDragging = false;
        };

        container.addEventListener('mousedown', onPointerDown);
        container.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('mouseup', onPointerUp);
        window.addEventListener('touchend', onPointerUp);

        // Initial 50% split
        updatePosition(50);
    });

    // 4. FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.srv-faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.srv-faq-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.srv-faq-btn');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 5. Scroll Fade-Up Animations
    const fadeElements = document.querySelectorAll('.srv-fade-up');
    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('srv-in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('srv-in-view'));
    }
});
