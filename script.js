// =========================================================
// STOCKPORT LANDSCAPE PROJECT - INTERACTIVE HERO SCRIPT
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('heroVideo');
    const header = document.getElementById('siteHeader');
    const togglePlayBtn = document.getElementById('togglePlayBtn');
    const toggleMuteBtn = document.getElementById('toggleMuteBtn');
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    const muteIcon = document.getElementById('muteIcon');
    const unmuteIcon = document.getElementById('unmuteIcon');
    const statusBanner = document.getElementById('videoStatusBanner');
    const statusText = document.getElementById('videoStatusText');
    const statusIndicator = document.getElementById('statusIndicator');
    const closeStatusBtn = document.getElementById('closeStatusBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    // 0. Premium Smooth Momentum Scroll (Lenis Engine)
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth luxury inertia
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.05,
            touchMultiplier: 1.8,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        window.lenis = lenis;

        // Smooth Anchor Navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    lenis.scrollTo(targetElement, {
                        offset: -50,
                        duration: 1.4,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                    if (navLinks && navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                    }
                }
            });
        });
    } else {
        // Native fallback smooth anchor navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (navLinks && navLinks.classList.contains('open')) {
                        navLinks.classList.remove('open');
                    }
                }
            });
        });
    }

    // 1. Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Video Playback & Status Handling
    if (video) {
        // Attempt autoplay
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (statusIndicator && statusText) {
                    statusIndicator.classList.add('active');
                    statusText.innerHTML = 'Live Video Active • <code>Stockport Landscape</code>';
                }
            }).catch(() => {
                // Autoplay was prevented or video source not found yet (poster image active)
                if (playIcon && pauseIcon) {
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
                if (statusText) {
                    statusText.innerHTML = 'Poster image loaded • Add <code>hero-video.mp4</code> to <code>assets/</code>';
                }
            });
        }

        // Toggle Play / Pause
        if (togglePlayBtn) {
            togglePlayBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                } else {
                    video.pause();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                }
            });
        }

        // Toggle Mute / Unmute
        if (toggleMuteBtn) {
            toggleMuteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                if (video.muted) {
                    muteIcon.style.display = 'block';
                    unmuteIcon.style.display = 'none';
                } else {
                    muteIcon.style.display = 'none';
                    unmuteIcon.style.display = 'block';
                }
            });
        }

        video.addEventListener('playing', () => {
            if (statusIndicator) statusIndicator.classList.add('active');
            if (playIcon && pauseIcon) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
            if (statusText) {
                statusText.innerHTML = 'Live Video Active • <code>hero-banner-video.mp4</code>';
            }
        });

        video.addEventListener('error', () => {
            if (statusIndicator) statusIndicator.classList.remove('active');
            if (statusText) {
                statusText.innerHTML = 'Add your video as <code>hero-video.mp4</code> in <code>assets/</code>';
            }
        });
    }

    // 3. Dismiss Notification banner
    if (closeStatusBtn && statusBanner) {
        closeStatusBtn.addEventListener('click', () => {
            statusBanner.style.opacity = '0';
            statusBanner.style.transform = 'translateY(10px)';
            setTimeout(() => {
                statusBanner.style.display = 'none';
            }, 300);
        });
    }

    // 4. Mobile Menu Toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // 5. Drag & Drop Instant Video Previewer (Handy developer feature!)
    window.addEventListener('dragover', (e) => {
        e.preventDefault();
        document.body.classList.add('drag-over');
    });

    ['dragleave', 'dragend'].forEach(eventName => {
        window.addEventListener(eventName, () => {
            document.body.classList.remove('drag-over');
        });
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        document.body.classList.remove('drag-over');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                const videoURL = URL.createObjectURL(file);
                video.src = videoURL;
                video.play();
                if (statusIndicator) statusIndicator.classList.add('active');
                if (statusText) {
                    statusText.innerHTML = `Previewing: <b>${file.name}</b> (Copy this file to <code>assets/hero-video.mp4</code>)`;
                }
            }
        }
    });

    // 6. Premium Bottom Frosted Blur Effect
    const bottomBlurOverlay = document.getElementById('bottomBlurOverlay');
    const checkBottomBlur = () => {
        if (!bottomBlurOverlay) return;
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Trigger blur when user reaches the bottom (within 100px threshold)
        if (scrollPosition >= documentHeight - 100) {
            bottomBlurOverlay.classList.add('active');
        } else {
            bottomBlurOverlay.classList.remove('active');
        }
    };
    window.addEventListener('scroll', checkBottomBlur, { passive: true });
    window.addEventListener('resize', checkBottomBlur);
    checkBottomBlur();

    // 7. Universal Sitewide Scroll Animation Engine (Mandatory Fade-Up Across All Sections)
    const fadeElements = document.querySelectorAll('.fade-up, .srv-fade-up, .service-card');

    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view', 'srv-in-view');
                } else if (entry.boundingClientRect.top > window.innerHeight + 60) {
                    // Re-arm when scrolled back up above the element so scrolling down re-reveals smoothly
                    entry.target.classList.remove('in-view', 'srv-in-view');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('in-view', 'srv-in-view'));
    }

    // 8. Stats Number Counter Animation with dynamic count & pop effect
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const animateStats = () => {
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 1800 + (index * 150);
            let startTime = null;

            // Add dynamic scale-in pop
            stat.style.transform = 'scale(0.85)';
            stat.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease';

            const updateCount = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // easeOutExpo
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = Math.floor(easeOut * target);

                stat.textContent = currentVal.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                    stat.style.transform = 'scale(1)';
                }
            };

            setTimeout(() => {
                requestAnimationFrame(updateCount);
            }, index * 80);
        });
    };

    const statsSection = document.getElementById('stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    animateStats();
                } else if (!entry.isIntersecting && entry.boundingClientRect.top > window.innerHeight) {
                    // Re-arm when scrolled far back up
                    hasAnimatedStats = false;
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // 9. FAQ Accordion Interactive Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question-btn');
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
});
