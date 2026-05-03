/* ── Scroll Reveal & Counter Animations ── */

(function () {
  // Scroll reveal using Intersection Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Trigger counters if inside stats section
          if (entry.target.closest('.stats-section')) {
            animateCounters();
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));

  // Counter animation
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Parallax effect on hero glow
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const glow = document.querySelector('.hero-glow');
    if (glow && scrollY < window.innerHeight) {
      glow.style.transform = `translateX(-50%) translateY(${scrollY * 0.3}px)`;
    }
  });
})();
