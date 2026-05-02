// Login page logic — Google Sign-In for session creators

(function () {
  initializeFirebase();

  const errorEl = document.getElementById('error-message');
  const googleBtn = document.getElementById('google-signin-btn');

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
  }

  // Redirect if already signed in (non-anonymous)
  auth.onAuthStateChanged(user => {
    if (user && !user.isAnonymous) {
      window.location.href = 'dashboard.html';
    }
  });

  googleBtn.addEventListener('click', async () => {
    try {
      await signInWithGoogle();
      window.location.href = 'dashboard.html';
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
      showError(err.message);
    }
  });
})();
