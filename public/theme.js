// Theme toggle — persists to localStorage
(function () {
  function applyTheme(mode) {
    document.body.classList.toggle('light-mode', mode === 'light');
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.textContent = mode === 'light' ? '🌙' : '☀️';
  }

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'dark');
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  });
})();
