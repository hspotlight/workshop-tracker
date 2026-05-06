// Theme toggle — persists to localStorage
// Script is always placed at bottom of <body>, so DOM is ready when this runs.
(function () {
  function applyTheme(mode) {
    document.body.classList.toggle('light-mode', mode === 'light');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = mode === 'light' ? '🌙' : '☀️';
  }

  applyTheme(localStorage.getItem('theme') || 'dark');

  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }
})();
