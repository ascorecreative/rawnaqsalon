/**
 * Al Rawnaq Ladies Salon - Client-Side Interactive JavaScript
 * Author: Ascore Creative
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initHeroSlider();
  initTestimonialsSlider();
  initGalleryLightbox();
  initRevealOnScroll();
  initContactForm();
});

/**
 * 1. Sticky Header scroll styling & Active Nav link highlighting
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // 1. Add solid background when scrolled
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // 2. Active Section Highlighting
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // Nav bar offset

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  // Throttle using requestAnimationFrame for performance & Core Web Vitals (INP)
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Initial trigger
  handleScroll();
}

/**
 * 2. Mobile Navigation Toggle Drawer
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('open');
    
    // Prevent background scrolling when mobile navigation drawer is open
    document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : 'auto';
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close drawer when any navigation link is clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Automatically close menu if screen size is resized larger than 992px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/**
 * 3. Hero Section Background Cross-Fade Image Slider
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  const slideInterval = 5000; // Change slide every 5 seconds

  const nextSlide = () => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  };

  setInterval(nextSlide, slideInterval);
}

/**
 * 4. Client Testimonials Slider with Auto-Play & Control Buttons
 */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (slides.length <= 1) return;

  let currentSlide = 0;
  let autoplayTimer;
  const autoplayInterval = 6000;

  const showSlide = (index) => {
    // Wrap index around boundaries
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Reset classes
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update index
    currentSlide = index;

    // Add active classes
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
    resetAutoplay();
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
    resetAutoplay();
  };

  // Button Listeners
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
  }

  // Dots Navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(targetIndex);
      resetAutoplay();
    });
  });

  // Autoplay functionality
  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      showSlide(currentSlide + 1);
    }, autoplayInterval);
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  // Start initial autoplay
  startAutoplay();
}

/**
 * 5. Visual Portfolio Gallery Lightbox with Navigation
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (galleryItems.length === 0 || !lightbox) return;

  let activeIndex = 0;

  // Open Lightbox
  const openLightbox = (index) => {
    activeIndex = index;
    const item = galleryItems[activeIndex];
    const imgSrc = item.querySelector('img').getAttribute('src');
    const imgAlt = item.querySelector('img').getAttribute('alt');
    const titleText = item.querySelector('.gallery-title').textContent;
    const catText = item.querySelector('.gallery-cat').textContent;

    lightboxImg.setAttribute('src', imgSrc);
    lightboxImg.setAttribute('alt', imgAlt);
    lightboxCaption.innerHTML = `<span class="gold-text">${catText}</span> - ${titleText}`;

    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Unlock scrolling
  };

  // Navigate lightbox images
  const navigateLightbox = (direction) => {
    let nextIndex = activeIndex + direction;
    if (nextIndex >= galleryItems.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = galleryItems.length - 1;
    openLightbox(nextIndex);
  };

  // Click on gallery items to trigger
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeLightbox);

  // Prev / Next button listeners
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Click background to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    }
  });
}

/**
 * 6. Reveal-on-Scroll animations using Intersection Observer API
 */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-effect');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px',
      threshold: 0.12 // trigger when 12% is visible
    };

    const revealCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animates once and stops tracking
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers: show elements immediately
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }
}

/**
 * 7. Luxury Booking Inquiry Form Submission
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset feedback states
    feedback.className = 'form-feedback hidden';
    feedback.textContent = '';

    // Show loading submit state
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending Inquiry...';
    if (spinner) spinner.classList.remove('hidden');

    try {
      // Simulate validation / submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const formData = new FormData(form);
      const name = formData.get('name');
      const service = formData.get('service');
      const refNum = `RNQ-${Math.floor(10000 + Math.random() * 90000)}`;

      // Present success feedback
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Thank you, ${name}!</strong><br>
        Your booking inquiry for <em>${service}</em> has been received.<br>
        Booking Reference: <strong>${refNum}</strong>.<br><br>
        👉 To confirm instantly, click our WhatsApp widget below to chat directly with our reservation desk!
      `;

      // Reset form fields
      form.reset();

    } catch (error) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Something went wrong. Please check your connection and try again, or call us directly.';
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Booking Inquiry';
      if (spinner) spinner.classList.add('hidden');
    }
  });
}
