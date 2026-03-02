/**
 * testimonials.js
 * Handles the interactive testimonial slider
 */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('testimonialSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slider) return;

    let isPlaying = true;
    let autoSlideInterval;
    const slides = slider.children;

    const generateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const slidesCount = slides.length;
        for (let i = 0; i < slidesCount; i++) {
            const dot = document.createElement('div');
            dot.className = `h-2 rounded-full transition-all duration-300 cursor-pointer ${i === 0 ? 'w-8 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-700'}`;
            dot.addEventListener('click', () => {
                const scrollAmount = slides[i].offsetLeft - slider.offsetLeft;
                slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                stopAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        const scrollLeft = slider.scrollLeft;
        const slideWidth = slides[0].offsetWidth + 24; // Width + gap
        const index = Math.round(scrollLeft / slideWidth);
        const dots = dotsContainer.children;

        for (let i = 0; i < dots.length; i++) {
            if (i === index) {
                dots[i].className = 'h-2 w-8 bg-primary rounded-full transition-all duration-300 cursor-pointer';
            } else {
                dots[i].className = 'h-2 w-2 bg-slate-200 dark:bg-slate-700 rounded-full transition-all duration-300 cursor-pointer';
            }
        }
    };

    const startAutoSlide = () => {
        isPlaying = true;
        if (playPauseIcon) playPauseIcon.textContent = 'pause';
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: slides[0].offsetWidth + 24, behavior: 'smooth' });
            }
        }, 4000);
    };

    const stopAutoSlide = () => {
        isPlaying = false;
        if (playPauseIcon) playPauseIcon.textContent = 'play_arrow';
        clearInterval(autoSlideInterval);
    };

    // Event Listeners
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => isPlaying ? stopAutoSlide() : startAutoSlide());
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: slides[0].offsetWidth + 24, behavior: 'smooth' });
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            if (slider.scrollLeft <= 10) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: -(slides[0].offsetWidth + 24), behavior: 'smooth' });
            }
        });
    }

    slider.addEventListener('scroll', updateDots);
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', () => { if (isPlaying) startAutoSlide(); });

    // Initialize
    generateDots();
    startAutoSlide();
});
