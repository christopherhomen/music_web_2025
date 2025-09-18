/* ==========================================
   ABOUT PREMIUM JAVASCRIPT - APPLE STYLE
   ========================================== */

// Ejecutar inmediatamente
(function() {
    // console.log('🚀 About Premium JS loaded immediately');
    
    // Esperar un poco y luego ejecutar
    setTimeout(() => {
        initAboutPremium();
        forceStatsAnimation();
    }, 500);
})();

document.addEventListener('DOMContentLoaded', function() {
    // console.log('📄 DOM Content Loaded');
    initAboutPremium();
});

// También ejecutar cuando la ventana esté completamente cargada
window.addEventListener('load', function() {
    // console.log('🔄 Window loaded - Checking stats again...');
    
    // Forzar animación de estadísticas después de un delay
    setTimeout(() => {
        forceStatsAnimation();
    }, 1000);
});

// Función para forzar animación de estadísticas
function forceStatsAnimation() {
    // console.log('🚀 Force animating stats...');
    
    // Buscar todos los elementos con data-target
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    // console.log(`Found ${statNumbers.length} stat numbers with data-target`);
    
    if (statNumbers.length === 0) {
        // console.log('❌ No stat numbers found with data-target attribute');
        return;
    }
    
    statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.getAttribute('data-target'));
        // console.log(`Stat ${index + 1}:`, {
        //     element: stat,
        //     currentValue: stat.textContent,
        //     target: target,
        //     hasAnimated: stat.classList.contains('animated')
        // });
        
        if (target) {
            // Resetear el elemento
            stat.textContent = '0';
            stat.classList.remove('animated');
            
            // Animar inmediatamente
            console.log(`🚀 Animating stat ${index + 1}: 0 -> ${target}`);
            animateCounter(stat, 0, target, 2000);
        }
    });
}

// Función global para debug
window.debugStats = forceStatsAnimation;

function initAboutPremium() {
    console.log('🚀 Initializing About Premium...');
    
    // Initialize video interactions
    initVideoInteractions();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Initialize stats counter animation
    initStatsCounter();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Debug: Check if stat numbers exist
    const statNumbers = document.querySelectorAll('.stat-number');
    console.log(`Found ${statNumbers.length} stat numbers:`, statNumbers);
    
    console.log('✅ About Premium initialized successfully');
    
    // Debug: Verificar elementos después de un delay
    setTimeout(() => {
        console.log('🔍 Debug check after initialization...');
        const allStatNumbers = document.querySelectorAll('.stat-number');
        console.log(`Total stat numbers found: ${allStatNumbers.length}`);
        
        allStatNumbers.forEach((stat, index) => {
            const target = stat.getAttribute('data-target');
            console.log(`Stat ${index + 1}:`, {
                element: stat,
                textContent: stat.textContent,
                dataTarget: target,
                hasAnimated: stat.classList.contains('animated')
            });
        });
    }, 2000);
}

function initVideoInteractions() {
    // Hero video interactions
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', function() {
            this.style.opacity = '1';
        });
        
        // Pause video when not in viewport
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });
        
        heroObserver.observe(heroVideo);
    }
    
    // Mission video interactions
    const missionVideo = document.querySelector('.mission-video-element');
    const missionPlayButton = document.querySelector('.mission-video .play-button');
    
    if (missionVideo && missionPlayButton) {
        missionPlayButton.addEventListener('click', function() {
            if (missionVideo.paused) {
                missionVideo.play();
                this.style.opacity = '0';
            } else {
                missionVideo.pause();
                this.style.opacity = '1';
            }
        });
        
        missionVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
                missionPlayButton.style.opacity = '0';
            } else {
                this.pause();
                missionPlayButton.style.opacity = '1';
            }
        });
        
        missionVideo.addEventListener('play', function() {
            missionPlayButton.style.opacity = '0';
        });
        
        missionVideo.addEventListener('pause', function() {
            missionPlayButton.style.opacity = '1';
        });
    }
    
    // Value cards video interactions
    const valueVideos = document.querySelectorAll('.value-video-element');
    valueVideos.forEach(video => {
        video.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        video.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Innovation video interactions
    const innovationVideo = document.querySelector('.innovation-video-element');
    if (innovationVideo) {
        innovationVideo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        innovationVideo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    console.log('✅ Video interactions initialized');
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate feature items
                if (entry.target.classList.contains('feature-item')) {
                    animateFeatureItem(entry.target);
                }
                
                // Animate innovation features
                if (entry.target.classList.contains('innovation-feature')) {
                    animateInnovationFeature(entry.target);
                }
                
                // Animate value cards
                if (entry.target.classList.contains('value-card')) {
                    animateValueCard(entry.target);
                }
                
                // Animate stats
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCard(entry.target);
                }
                
                // Animate stat numbers directly
                if (entry.target.classList.contains('stat-number')) {
                    animateStatNumber(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.feature-item, .innovation-feature, .value-card, .stat-card, .mission-text, .innovation-text'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
    
    // Also observe stat numbers directly
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    console.log('✅ Intersection observer initialized');
}

function animateFeatureItem(element) {
    const icon = element.querySelector('.feature-icon');
    const content = element.querySelector('.feature-content');
    
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 200);
    }
    
    if (content) {
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';
        }, 100);
    }
}

function animateInnovationFeature(element) {
    const number = element.querySelector('.feature-number');
    const text = element.querySelector('.feature-text');
    
    if (number) {
        setTimeout(() => {
            number.style.transform = 'scale(1.1)';
            setTimeout(() => {
                number.style.transform = 'scale(1)';
            }, 300);
        }, 200);
    }
    
    if (text) {
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.transform = 'translateX(0)';
        }, 100);
    }
}

function animateValueCard(element) {
    const overlay = element.querySelector('.value-overlay');
    const icon = element.querySelector('.value-icon');
    
    if (overlay) {
        setTimeout(() => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 400);
    }
}

function animateStatCard(element) {
    const icon = element.querySelector('.stat-icon');
    const number = element.querySelector('.stat-number');
    
    if (icon) {
        setTimeout(() => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 200);
    }
    
    if (number) {
        const target = parseInt(number.getAttribute('data-target'));
        if (target) {
            animateCounter(number, 0, target, 2000);
        }
    }
}

function animateStatNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    console.log(`animateStatNumber called for element:`, element, `target: ${target}`);
    
    if (target && !element.classList.contains('animated')) {
        element.classList.add('animated');
        console.log(`Starting animation: 0 -> ${target}`);
        animateCounter(element, 0, target, 2000);
    } else if (!target) {
        console.log(`No data-target found for element:`, element);
    } else {
        console.log(`Element already animated:`, element);
    }
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target) {
            // Initialize with 0
            stat.textContent = '0';
            // console.log(`Initialized stat: ${stat.textContent} -> target: ${target}`);
        } else {
            // console.log(`Stat number without data-target:`, stat);
        }
    });
    
    // console.log(`✅ Stats counter initialized - Found ${statNumbers.length} stat numbers`);
}

function animateCounter(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.classList.add('animated');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initSmoothScrolling() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Smooth scrolling initialized');
}

function initParallaxEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.about-hero');
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroSection && heroVideo && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroVideo.style.transform = `translateY(${rate}px)`;
            heroContent.style.transform = `translateY(${rate * 0.3}px)`;
        });
    }
    
    // Parallax effect for mission video
    const missionVideo = document.querySelector('.mission-video-element');
    if (missionVideo) {
        window.addEventListener('scroll', () => {
            const rect = missionVideo.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const rate = (scrolled - rect.top) * 0.3;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                missionVideo.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    console.log('✅ Parallax effects initialized');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fade-in-up 0.8s ease-out;
    }
    
    @keyframes fade-in-up {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-content {
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.6s ease-out;
    }
    
    .innovation-feature .feature-text {
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.6s ease-out;
    }
    
    .value-overlay {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease-out;
    }
    
    .hero-video {
        opacity: 0;
        transition: opacity 1s ease-out;
    }
    
    .mission-video-element,
    .innovation-video-element,
    .value-video-element {
        transition: transform 0.6s ease-out;
    }
    
    .feature-icon,
    .innovation-feature .feature-number,
    .value-icon,
    .stat-icon {
        transition: transform 0.3s ease-out;
    }
    
    .stat-number {
        transition: all 0.3s ease-out;
    }
    
    .stat-number.animated {
        animation: stat-glow 0.5s ease-out;
    }
    
    @keyframes stat-glow {
        0% {
            text-shadow: 0 0 0 rgba(0, 122, 255, 0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 122, 255, 0.8);
        }
        100% {
            text-shadow: 0 0 0 rgba(0, 122, 255, 0.5);
        }
    }
    
    /* Video hover effects */
    .video-container:hover .mission-video-element,
    .video-container:hover .innovation-video-element {
        transform: scale(1.02);
    }
    
    .value-card:hover .value-video-element {
        transform: scale(1.05);
    }
    
    /* Play button animation */
    .play-button {
        transition: all 0.3s ease-out;
    }
    
    .play-button:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
    }
    
    /* Innovation badge animation */
    .innovation-badge {
        animation: badge-pulse 2s ease-in-out infinite;
    }
    
    @keyframes badge-pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Add performance optimization
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

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations here if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Add video preloading
function preloadVideos() {
    const videoSources = [
        'assets/video/video1.mp4',
        'assets/video/video2.mp4',
        'assets/video/video3.mp4',
        'assets/video/video4.mp4',
        'assets/video/video5.mp4',
        'assets/video/video6.mp4'
    ];
    
    videoSources.forEach(src => {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'metadata';
    });
}

// Preload videos after page load
window.addEventListener('load', preloadVideos);

// Initialize stats when page is fully loaded
window.addEventListener('load', function() {
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log(`Page loaded - Found ${statNumbers.length} stat numbers`);
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            console.log(`Stat ${index + 1}: target=${target}, current=${stat.textContent}`);
            
            if (target && !stat.classList.contains('animated')) {
                console.log(`Auto-animating stat: ${stat.textContent} -> ${target}`);
                animateStatNumber(stat);
            }
        });
    }, 1000); // Wait 1 second after page load
});

// Also try to animate stats immediately when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log(`DOM ready - Found ${statNumbers.length} stat numbers`);
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (target && !stat.classList.contains('animated')) {
                console.log(`DOM ready - Animating stat ${index + 1}: ${stat.textContent} -> ${target}`);
                animateStatNumber(stat);
            }
        });
    }, 2000); // Wait 2 seconds after DOM ready
});

console.log('🎨 About Premium styles and interactions loaded');
