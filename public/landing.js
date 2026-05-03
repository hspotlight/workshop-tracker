/* ── Scroll Reveal & Counter Animations ── */

(function () {
  // Apply saved language on load
  applyTranslations(getLang());

  // Scroll reveal using Intersection Observer
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));

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
