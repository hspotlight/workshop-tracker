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
  const confirmDeleteModal = document.getElementById('confirm-delete-modal');
  const confirmDeleteNameEl = document.getElementById('confirm-delete-name');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  let pendingDeleteId = null;

  cancelDeleteBtn.addEventListener('click', () => {
    confirmDeleteModal.style.display = 'none';
    pendingDeleteId = null;
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteSession(pendingDeleteId);
      confirmDeleteModal.style.display = 'none';
      pendingDeleteId = null;
      loadSessions();
    } catch (err) {
      showError(err.message);
    }
  });

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
    const row = makeStepRow('Step ' + (count + 1) + ' name', true);
    stepsContainer.appendChild(row);
    row.querySelector('.btn-remove-step').addEventListener('click', () => {
      row.remove();
      renumberSteps();
    });
  });

  function makeStepRow(placeholder, withRemove) {
    const row = document.createElement('div');
    row.className = 'step-input-row';
    row.innerHTML =
      '<span class="drag-handle" draggable="true">&#8942;</span>' +
      '<input type="text" class="step-input" placeholder="' + placeholder + '" required />' +
      '<textarea class="step-desc-input" placeholder="Step description (optional)" rows="2"></textarea>' +
      (withRemove ? '<button type="button" class="btn btn-small btn-remove-step">x</button>' : '');
    return row;
  }

  function resetStepInputs() {
    stepsContainer.innerHTML = '';
    stepsContainer.appendChild(makeStepRow('Step 1 name', false));
  }

  // Enable drag-to-reorder on a steps container
  function makeDraggable(container) {
    let dragSrc = null;

    container.addEventListener('dragstart', (e) => {
      if (!e.target.classList.contains('drag-handle')) return;
      dragSrc = e.target.closest('.step-input-row');
      if (!dragSrc) return;
      e.dataTransfer.effectAllowed = 'move';
      dragSrc.classList.add('dragging');
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const row = e.target.closest('.step-input-row');
      if (!row || row === dragSrc) return;
      e.dataTransfer.dropEffect = 'move';
      container.querySelectorAll('.step-input-row').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });

    container.addEventListener('dragleave', (e) => {
      const row = e.target.closest('.step-input-row');
      if (row) row.classList.remove('drag-over');
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const target = e.target.closest('.step-input-row');
      if (!target || !dragSrc || target === dragSrc) return;
      container.querySelectorAll('.step-input-row').forEach(r => r.classList.remove('drag-over'));
      dragSrc.classList.remove('dragging');
      const rows = [...container.querySelectorAll('.step-input-row')];
      if (rows.indexOf(dragSrc) < rows.indexOf(target)) {
        target.after(dragSrc);
      } else {
        target.before(dragSrc);
      }
      renumberSteps();
    });

    container.addEventListener('dragend', () => {
      if (dragSrc) dragSrc.classList.remove('dragging');
      container.querySelectorAll('.step-input-row').forEach(r => r.classList.remove('drag-over'));
      dragSrc = null;
    });
  }

  makeDraggable(stepsContainer);

  function renumberSteps() {
    stepsContainer.querySelectorAll('.step-input').forEach((input, i) => {
      input.placeholder = 'Step ' + (i + 1) + ' name';
    });
  }

  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('session-name').value;
    const rows = stepsContainer.querySelectorAll('.step-input-row');
    const steps = Array.from(rows).map(row => ({
      name: row.querySelector('.step-input').value,
      description: row.querySelector('.step-desc-input').value,
    }));

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
      console.error('Failed to load sessions:', err);
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
          '<button class="btn btn-small btn-danger btn-delete" data-session-id="' + session.id + '" data-session-name="' + escapeHtml(session.name) + '">Delete</button>' +
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

    sessionsListEl.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDeleteId = btn.dataset.sessionId;
        confirmDeleteNameEl.textContent = btn.dataset.sessionName;
        confirmDeleteModal.style.display = 'flex';
      });
    });
  }
})();
