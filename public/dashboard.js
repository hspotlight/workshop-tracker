// Dashboard page — session list + create session for authenticated creators

(function () {
  initializeFirebase();

  const userEmailEl = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');
  const createSessionBtn = document.getElementById('create-session-btn');
  const createModal = document.getElementById('create-modal');
  const createForm = document.getElementById('create-form');
  const cancelCreateBtn = document.getElementById('cancel-create-btn');
  const addStepBtn = document.getElementById('add-step-btn');
  const stepsContainer = document.getElementById('steps-container');
  const sessionsListEl = document.getElementById('sessions-list');
  const errorEl = document.getElementById('error-message');

  let currentUser = null;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
  }

  // Auth gate
  auth.onAuthStateChanged(user => {
    if (!user || user.isAnonymous) {
      window.location.href = 'login.html';
      return;
    }
    currentUser = user;
    userEmailEl.textContent = user.email;
    loadSessions();
  });

  logoutBtn.addEventListener('click', async () => {
    await logout();
    window.location.href = 'login.html';
  });

  // ── Create session modal ──

  createSessionBtn.addEventListener('click', () => {
    createModal.style.display = 'flex';
  });

  cancelCreateBtn.addEventListener('click', () => {
    createModal.style.display = 'none';
    createForm.reset();
    resetStepInputs();
  });

  addStepBtn.addEventListener('click', () => {
    const count = stepsContainer.querySelectorAll('.step-input-row').length;
    const row = document.createElement('div');
    row.className = 'step-input-row';
    row.innerHTML =
      '<input type="text" class="step-input" placeholder="Step ' + (count + 1) + ' name" required />' +
      '<button type="button" class="btn btn-small btn-remove-step">x</button>';
    stepsContainer.appendChild(row);

    row.querySelector('.btn-remove-step').addEventListener('click', () => {
      row.remove();
      renumberSteps();
    });
  });

  function resetStepInputs() {
    stepsContainer.innerHTML =
      '<div class="step-input-row">' +
      '<input type="text" class="step-input" placeholder="Step 1 name" required />' +
      '</div>';
  }

  function renumberSteps() {
    stepsContainer.querySelectorAll('.step-input').forEach((input, i) => {
      input.placeholder = 'Step ' + (i + 1) + ' name';
    });
  }

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('session-name').value;
    const stepInputs = stepsContainer.querySelectorAll('.step-input');
    const steps = Array.from(stepInputs).map(input => input.value);

    const errors = validateSessionData({ name, steps });
    if (errors.length > 0) {
      showError(errors.join(', '));
      return;
    }

    try {
      await createSession(currentUser.uid, { name, steps });
      createModal.style.display = 'none';
      createForm.reset();
      resetStepInputs();
      loadSessions();
    } catch (err) {
      showError(err.message);
    }
  });

  // ── Load sessions ──

  async function loadSessions() {
    try {
      const sessions = await getUserSessions(currentUser.uid);
      renderSessions(sessions);
    } catch (err) {
      showError('Failed to load sessions: ' + err.message);
    }
  }

  function renderSessions(sessions) {
    if (sessions.length === 0) {
      sessionsListEl.innerHTML = '<p class="empty-state">No sessions yet. Create your first one!</p>';
      return;
    }

    sessionsListEl.innerHTML = sessions.map(session => {
      const statusClass = session.status === 'active' ? 'status-active' : 'status-closed';
      const statusLabel = session.status === 'active' ? 'Active' : 'Closed';
      const sessionUrl = window.location.origin + '/session.html?id=' + session.id;

      return '<div class="session-card">' +
        '<div class="session-card-header">' +
          '<h3>' + escapeHtml(session.name) + '</h3>' +
          '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>' +
        '</div>' +
        '<p class="session-steps-count">' + session.steps.length + ' steps</p>' +
        '<div class="session-card-actions">' +
          '<a href="session.html?id=' + session.id + '" class="btn btn-small btn-primary">Open</a>' +
          '<button class="btn btn-small btn-copy" data-url="' + escapeHtml(sessionUrl) + '">Copy Link</button>' +
        '</div>' +
      '</div>';
    }).join('');

    sessionsListEl.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.url);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
      });
    });
  }
})();
