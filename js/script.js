$(document).ready(function () {
    // Smooth scrolling for anchor links using jQuery
    $("a").on("click", function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            var navbarHeight = $(".navbar").outerHeight();
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top - navbarHeight,
                },
                800,
                function () {
                    window.location.hash = hash;
                }
            );
        }
    });

    // Toggle fixed navbar on scroll using jQuery
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        var navbarHeight = $(".navbar").outerHeight();

        if (scroll > navbarHeight) {
            $(".navbar").addClass("fixed");
        } else {
            $(".navbar").removeClass("fixed");
        }
    });

    // Scroll animations for sections using GSAP
    const sectionsToAnimate = document.querySelectorAll(".animate-section");

    window.addEventListener("scroll", function () {
        const scrollPosition = window.scrollY;

        sectionsToAnimate.forEach((section, index) => {
            if (isInViewport(section)) {
                const animationProps = window.innerWidth < 768
                    ? { opacity: 1, y: 0, duration: 1, ease: "power2.inOut", delay: index * 0.3 }
                    : { opacity: 1, y: Math.sin(scrollPosition * 0.01 + index) * 50, duration: 1, ease: "power2.inOut", delay: index * 0.3 };
                
                gsap.to(section, animationProps);
            } else {
                const animationProps = window.innerWidth < 768
                    ? { opacity: 0, y: 0, duration: 0.5, ease: "power2.inOut" }
                    : { opacity: 0, y: 20, duration: 0.5, ease: "power2.inOut" };

                gsap.to(section, animationProps);
            }
        });
    });

    // Helper function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});

// Vanilla JavaScript equivalent for fixed navbar
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        navbar.classList.add("fixed");
    } else {
        navbar.classList.remove("fixed");
    }
});

// Vanilla JavaScript smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Enhanced Carousel Features
document.addEventListener('DOMContentLoaded', function() {
  // Add progress bars to carousels
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    // Skip if we already have a progress bar
    if (carousel.querySelector('.carousel-progress')) return;
    
    // Preload images to avoid loading delays during transitions
    const preloadImages = () => {
      const images = carousel.querySelectorAll('img');
      images.forEach(img => {
        const preloader = new Image();
        preloader.src = img.src;
      });
    };
    
    // Start preloading
    preloadImages();
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'carousel-progress';
    carousel.appendChild(progressBar);
    
    // Get carousel instance with optimized settings for smooth transitions
    const bsCarousel = new bootstrap.Carousel(carousel, {
      interval: 4000, // 4 seconds per slide
      pause: 'hover',  // Pause on hover
      wrap: true,      // Loop continuously 
      keyboard: true,  // Enable keyboard navigation
      ride: 'carousel' // Auto-start
    });
    
    // Fix transition blackout by managing slide events better
    carousel.addEventListener('slide.bs.carousel', function(event) {
      // Reset progress
      progressBar.style.width = '0%';
      
      // Get current and next slide
      const currentSlide = carousel.querySelector('.carousel-item.active');
      const nextSlide = event.relatedTarget;
      
      // Ensure next slide is visible before transition starts
      if (nextSlide) {
        nextSlide.style.display = 'block';
        nextSlide.style.position = 'absolute';
        nextSlide.style.top = '0';
        nextSlide.style.left = '0';
        nextSlide.style.width = '100%';
        
        // Small delay to ensure the browser renders the slide
        setTimeout(() => {
          // Now we can safely start the transition
          currentSlide.style.transition = 'transform 0.8s ease';
          nextSlide.style.transition = 'transform 0.8s ease';
        }, 10);
      }
    });
    
    // Start progress animation
    carousel.addEventListener('slid.bs.carousel', function() {
      // Once slide is complete, fix positions and start progress
      const slides = carousel.querySelectorAll('.carousel-item');
      slides.forEach(slide => {
        if (slide.classList.contains('active')) {
          slide.style.position = 'relative';
          slide.style.display = 'block';
        } else {
          slide.style.position = 'absolute';
          slide.style.display = 'block';
          slide.style.opacity = '0';
        }
      });
      
      // Restart progress bar animation
      progressBar.style.width = '100%';
      progressBar.style.transition = 'width 12s linear'; // Match the interval
    });
    
    // Initialize progress bar for first slide
    progressBar.style.width = '100%';
    progressBar.style.transition = 'width 12s linear';
    
    // Pause carousel on hover but maintain visual state
    carousel.addEventListener('mouseenter', function() {
      bsCarousel.pause();
      progressBar.style.transition = 'none';
    });
    
    // Resume carousel on mouse leave with smooth restart
    carousel.addEventListener('mouseleave', function() {
      progressBar.style.width = '0%';
      
      // Small delay before restarting to prevent visual glitches
      setTimeout(() => {
        bsCarousel.cycle();
        progressBar.style.width = '100%';
        progressBar.style.transition = 'width 12s linear';
      }, 50);
    });
    
    // Enhanced touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        bsCarousel.next();
      }
      if (touchEndX > touchStartX + 50) {
        bsCarousel.prev();
      }
    }
  });
  
  // Add keyboard navigation for carousels
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      carousels.forEach(carousel => {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) bsCarousel.prev();
      });
    }
    else if (e.key === 'ArrowRight') {
      carousels.forEach(carousel => {
        const bsCarousel = bootstrap.Carousel.getInstance(carousel);
        if (bsCarousel) bsCarousel.next();
      });
    }
  });

  // Add Jupyter-style loading to project content
  const projectContainers = document.querySelectorAll('.project-content, .notebook-iframe-container');
  
  projectContainers.forEach(container => {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'jupyter-loading';
    loadingOverlay.innerHTML = `
      <div class="jupyter-loading-inner">
        <div class="jupyter-spinner"></div>
        <div class="jupyter-loading-text">Loading content...</div>
      </div>
    `;
    
    container.appendChild(loadingOverlay);
    
    // Add functionality to hide loader when content is loaded
    setTimeout(() => {
      loadingOverlay.classList.add('loaded');
    }, 1500); // Default timeout - will be replaced by actual load event for iframes
    
    // If container has iframe, add load event listener
    const iframe = container.querySelector('iframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        loadingOverlay.classList.add('loaded');
      });
    }
  });
  
  // Make About Me carousel match content height
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const aboutContent = aboutSection.querySelector('.about-content');
    const carouselContainer = aboutSection.querySelector('.carousel');
    
    if (aboutContent && carouselContainer) {
      // Function to match heights
      function matchHeights() {
        // Get content height
        const contentHeight = aboutContent.offsetHeight;
        
        // If we're on desktop (above 992px)
        if (window.innerWidth >= 992) {
          // Set carousel height to match content
          carouselContainer.style.height = `${contentHeight}px`;
        } else {
          // Reset height on mobile
          carouselContainer.style.height = '';
        }
      }
      
      // Run on load and resize
      matchHeights();
      window.addEventListener('resize', matchHeights);
      
      // Also run after a short delay to account for any dynamic content
      setTimeout(matchHeights, 500);
    }
  }
});

/* filepath: /Users/leon Doungala/Library/CloudStorage/GoogleDrive-doungala.leon@gmail.com/My Drive/PERSONAL/Perso/My Projects/doungala.leon.github.io/js/animations.js */
// Advanced animations for page elements
document.addEventListener('DOMContentLoaded', function() {
  // Initialize ScrollReveal for scroll animations
  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 800,
    delay: 100,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    reset: false
  });
  
  // Apply animations to different sections with custom configurations
  sr.reveal('.header-content', { 
    delay: 200, 
    distance: '50px'
  });
  
  sr.reveal('.section-title', { 
    origin: 'left'
  });
  
  sr.reveal('.education-timeline', {
    delay: 200,
    distance: '70px',
    interval: 200
  });
  
  sr.reveal('.timeline-item', {
    delay: 300,
    interval: 200
  });
  
  sr.reveal('.skill-item', {
    interval: 100,
    delay: 100,
    distance: '20px',
    origin: 'bottom'
  });
  
  sr.reveal('.tech-chip', {
    interval: 50,
    delay: 100,
    origin: 'top'
  });
  
  sr.reveal('.social-icon', {
    interval: 100,
    origin: 'top',
    distance: '20px'
  });
  
  // Parallax effect for header
  const headerElement = document.querySelector('.header');
  if (headerElement) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.pageYOffset;
      headerElement.style.backgroundPosition = `50% ${scrollPosition * 0.05}px`;
    });
  }
  
  // Advanced hover effects for skill items
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach(item => {
    item.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.style.setProperty('--x-pos', `${x}px`);
      this.style.setProperty('--y-pos', `${y}px`);
      this.classList.add('hovering');
    });
    
    item.addEventListener('mouseleave', function() {
      this.classList.remove('hovering');
    });
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Animate typing effect for profession text
  const professionText = document.querySelector('.profession-text');
  if (professionText) {
    const text = professionText.textContent;
    professionText.textContent = '';
    const typeWriter = () => {
      const characters = text.split('');
      let i = 0;
      const interval = setInterval(() => {
        if (i < characters.length) {
          professionText.textContent += characters[i];
          i++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    };
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
  }
  
  // Initialize particles background for programming section
  const programmingSection = document.getElementById('programming');
  if (programmingSection) {
    particlesJS('programming', {
      particles: {
        number: {
          value: 30,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#4285f4'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.1,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.05,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#4285f4',
          opacity: 0.1,
          width: 1
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 0.5
            }
          },
          push: {
            particles_nb: 3
          }
        }
      },
      retina_detect: true
    });
  }
  
  // Section Separator Enhancements
  const separators = document.querySelectorAll('.section-separator');
  
  separators.forEach(separator => {
    // Only start animation when the separator is in view
    ScrollTrigger.create({
      trigger: separator,
      start: "top bottom-=100px",
      onEnter: () => {
        // Add class to trigger animation
        separator.classList.add('animate-separator');
        
        // For triple line separators, animate lines sequentially
        if (separator.classList.contains('separator-triple')) {
          const lines = separator.querySelectorAll('.line');
          gsap.from(lines, {
            width: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power2.out"
          });
          
          gsap.from(separator.querySelector('.dot'), {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            delay: 0.8,
            ease: "back.out(1.7)"
          });
        }
        
        // For dot separators, animate dots sequentially
        if (separator.classList.contains('separator-dots')) {
          const dots = separator.querySelectorAll('.dot');
          gsap.from(dots, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)"
          });
        }
      },
      once: true
    });
  });
});

/* filepath: /Users/leon Doungala/Library/CloudStorage/GoogleDrive-doungala.leon@gmail.com/My Drive/PERSONAL/Perso/My Projects/doungala.leon.github.io/js/cursor-effect.js */
// Cursor effect that adds a subtle glow following the mouse
document.addEventListener('DOMContentLoaded', function() {
  // Create cursor elements
  const cursorOuter = document.createElement('div');
  const cursorInner = document.createElement('div');
  
  cursorOuter.classList.add('cursor-outer');
  cursorInner.classList.add('cursor-inner');
  
  document.body.appendChild(cursorOuter);
  document.body.appendChild(cursorInner);
  
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  
  // Update tracked mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Animate cursor position with smooth lerping
  let innerX = 0;
  let innerY = 0;
  let outerX = 0;
  let outerY = 0;
  
  function animate() {
    // Calculate distance with lerping for smooth movement
    innerX += (mouseX - innerX) * 0.2;
    innerY += (mouseY - innerY) * 0.2;
    
    outerX += (mouseX - outerX) * 0.1;
    outerY += (mouseY - outerY) * 0.1;
    
    // Apply positions
    cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;
    cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
    
    // Continue animation loop
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Special effects for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .social-icon, .tech-chip, .skill-item');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOuter.classList.add('cursor-hover');
      cursorInner.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOuter.classList.remove('cursor-hover');
      cursorInner.classList.remove('cursor-hover');
    });
  });
});

/* filepath: /Users/leon Doungala/Library/CloudStorage/GoogleDrive-doungala.leon@gmail.com/My Drive/PERSONAL/Perso/My Projects/doungala.leon.github.io/js/portfolio-carousel.js */
// Portfolio Carousel Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Portfolio Carousel Progress Bar
    const portfolioCarousel = document.getElementById('portfolioCarousel');
    const portfolioProgress = document.querySelector('.portfolio-progress');
    
    if (portfolioCarousel && portfolioProgress) {
        // Set the initial interval (match with data-bs-interval in HTML)
        const interval = 6000;
        let carouselTime = 0;
        let progressInterval;
        
        // Initialize progress bar animation
        function startProgressAnimation() {
            carouselTime = 0;
            clearInterval(progressInterval);
            
            progressInterval = setInterval(function() {
                carouselTime += 10;
                const progressPercent = (carouselTime / interval) * 100;
                portfolioProgress.style.width = `${progressPercent}%`;
                
                if (carouselTime >= interval) {
                    carouselTime = 0;
                }
            }, 10);
        }
        
        // Reset progress when slide changes
        portfolioCarousel.addEventListener('slide.bs.carousel', function() {
            portfolioProgress.style.width = '0%';
            startProgressAnimation();
        });
        
        // Start progress animation when page loads
        startProgressAnimation();
        
        // Pause animation when mouse enters carousel
        portfolioCarousel.addEventListener('mouseenter', function() {
            clearInterval(progressInterval);
        });
        
        // Resume animation when mouse leaves carousel
        portfolioCarousel.addEventListener('mouseleave', function() {
            startProgressAnimation();
        });
    }
    
    // Parallax effect on carousel images
    const carouselItems = document.querySelectorAll('.portfolio-carousel .carousel-item');
    
    carouselItems.forEach(item => {
        const img = item.querySelector('img');
        
        if (img) {
            item.addEventListener('mousemove', function(e) {
                const boundingRect = item.getBoundingClientRect();
                const mouseX = e.clientX - boundingRect.left;
                const mouseY = e.clientY - boundingRect.top;
                
                const centerX = boundingRect.width / 2;
                const centerY = boundingRect.height / 2;
                
                const moveX = (mouseX - centerX) / 30;
                const moveY = (mouseY - centerY) / 30;
                
                img.style.transform = `scale(1.05) translate(${-moveX}px, ${-moveY}px)`;
            });
            
            item.addEventListener('mouseleave', function() {
                img.style.transform = 'scale(1)';
            });
        }
    });
});
