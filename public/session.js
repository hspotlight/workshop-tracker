// Session page — dual-purpose: creator sees grid, participant sees their steps

(function () {
  initializeFirebase();

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('id');

  const errorEl = document.getElementById('error-message');
  const loadingEl = document.getElementById('loading');
  const joinView = document.getElementById('join-view');
  const participantView = document.getElementById('participant-view');
  const creatorView = document.getElementById('creator-view');
  const backBtn = document.getElementById('back-btn');
  const userInfoEl = document.getElementById('user-info');

  let sessionData = null;
  let unsubscribe = null;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
  }

  if (!sessionId) {
    loadingEl.textContent = 'No session ID provided.';
    return;
  }

  // Wait for auth state, then load session
  auth.onAuthStateChanged(async (user) => {
    try {
      sessionData = await getSession(sessionId);
      if (!sessionData) {
        loadingEl.textContent = 'Session not found.';
        return;
      }
      loadingEl.style.display = 'none';

      // Determine role: creator or participant
      if (user && !user.isAnonymous && user.uid === sessionData.creatorId) {
        showCreatorView(user);
      } else {
        await handleParticipant(user);
      }
    } catch (err) {
      loadingEl.textContent = 'Failed to load session.';
      showError(err.message);
    }
  });

  // ── Creator View ──

  function showCreatorView(user) {
    creatorView.style.display = 'block';
    backBtn.style.display = 'inline-block';
    userInfoEl.textContent = user.email;

    backBtn.addEventListener('click', () => {
      window.location.href = 'dashboard.html';
    });

    document.getElementById('creator-session-name').textContent = sessionData.name;
    updateSessionStatus();

    // Toggle session open/close
    document.getElementById('toggle-session-btn').addEventListener('click', async () => {
      try {
        if (sessionData.status === 'active') {
          await closeSession(sessionId);
          sessionData.status = 'closed';
        } else {
          await reopenSession(sessionId);
          sessionData.status = 'active';
        }
        updateSessionStatus();
      } catch (err) {
        showError(err.message);
      }
    });

    // Copy link
    document.getElementById('copy-link-btn').addEventListener('click', () => {
      const url = window.location.origin + '/session.html?id=' + sessionId;
      navigator.clipboard.writeText(url);
      const btn = document.getElementById('copy-link-btn');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
    });

    // Real-time participants grid
    unsubscribe = onParticipantsChanged(sessionId, renderGrid);
  }

  function updateSessionStatus() {
    const statusEl = document.getElementById('creator-session-status');
    const toggleBtn = document.getElementById('toggle-session-btn');

    if (sessionData.status === 'active') {
      statusEl.textContent = 'Active';
      statusEl.className = 'status-badge status-active';
      toggleBtn.textContent = 'Close Session';
    } else {
      statusEl.textContent = 'Closed';
      statusEl.className = 'status-badge status-closed';
      toggleBtn.textContent = 'Reopen Session';
    }
  }

  function renderGrid(participants) {
    const gridEl = document.getElementById('participants-grid');
    const noParticipantsEl = document.getElementById('no-participants');

    if (participants.length === 0) {
      noParticipantsEl.style.display = 'block';
      gridEl.innerHTML = '';
      return;
    }
    noParticipantsEl.style.display = 'none';

    const steps = sessionData.steps;

    // Build table header
    let html = '<table class="grid-table">';
    html += '<thead><tr><th>Participant</th>';
    steps.forEach(step => {
      html += '<th>' + escapeHtml(step.name) + '</th>';
    });
    html += '<th>Actions</th></tr></thead>';

    // Build rows
    html += '<tbody>';
    participants.forEach(p => {
      const progress = p.progress || {};
      const completed = getCompletedCount(steps, progress);
      const allDone = isAllComplete(steps, progress);
      const rowClass = allDone ? 'row-complete' : '';

      html += '<tr class="' + rowClass + '">';
      html += '<td class="participant-name">' + escapeHtml(p.displayName) + ' <span class="progress-count">(' + completed + '/' + steps.length + ')</span></td>';
      steps.forEach(step => {
        const done = progress[step.id];
        if (done) {
          html += '<td class="step-done">&#10003;</td>';
        } else {
          html += '<td class="step-pending"></td>';
        }
      });
      html += '<td><button class="btn btn-small btn-reset" data-participant-id="' + p.id + '">Reset</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table>';

    gridEl.innerHTML = html;

    // Attach reset handlers
    gridEl.querySelectorAll('.btn-reset').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pid = btn.dataset.participantId;
        try {
          await resetParticipant(sessionId, pid);
        } catch (err) {
          showError(err.message);
        }
      });
    });
  }

  // ── Participant View ──

  async function handleParticipant(user) {
    // If session is closed, show message
    if (sessionData.status === 'closed') {
      loadingEl.style.display = 'block';
      loadingEl.textContent = 'This session is closed.';
      return;
    }

    // Sign in anonymously if not signed in
    if (!user) {
      await signInAnonymously();
      return; // onAuthStateChanged will fire again
    }

    // Check if participant already joined
    const existing = await getParticipant(sessionId, user.uid);
    if (existing) {
      showParticipantSteps(user.uid, existing);
    } else {
      showJoinForm(user.uid);
    }
  }

  function showJoinForm(uid) {
    joinView.style.display = 'block';
    document.getElementById('join-session-name').textContent = sessionData.name;

    const joinForm = document.getElementById('join-form');
    joinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const displayName = document.getElementById('display-name').value;

      const nameError = validateDisplayName(displayName);
      if (nameError) {
        showError(nameError);
        return;
      }

      try {
        const participant = await joinSession(sessionId, uid, displayName);
        joinView.style.display = 'none';
        showParticipantSteps(uid, participant);
      } catch (err) {
        showError(err.message);
      }
    });
  }

  function showParticipantSteps(uid, participant) {
    participantView.style.display = 'block';
    document.getElementById('participant-session-name').textContent = sessionData.name;
    userInfoEl.textContent = participant.displayName;

    // Listen for real-time changes to own progress
    unsubscribe = onParticipantChanged(sessionId, uid, (updatedParticipant) => {
      renderSteps(uid, updatedParticipant);
    });

    // Initial render
    renderSteps(uid, participant);
  }

  function renderSteps(uid, participant) {
    const stepsListEl = document.getElementById('steps-list');
    const steps = sessionData.steps;
    const progress = participant.progress || {};

    const completed = getCompletedCount(steps, progress);
    document.getElementById('participant-progress-summary').textContent =
      completed + ' of ' + steps.length + ' steps completed';

    stepsListEl.innerHTML = steps.map((step, index) => {
      const done = progress[step.id];
      const canComplete = canCompleteStep(steps, progress, step.id);
      const locked = !done && !canComplete;

      let statusClass = 'step-item';
      let buttonHtml = '';

      if (done) {
        statusClass += ' step-completed';
        buttonHtml = '<span class="step-check">&#10003; Completed</span>';
      } else if (canComplete) {
        statusClass += ' step-available';
        buttonHtml = '<button class="btn btn-primary btn-complete" data-step-id="' + step.id + '">Complete</button>';
      } else {
        statusClass += ' step-locked';
        buttonHtml = '<span class="step-lock">Locked</span>';
      }

      return '<div class="' + statusClass + '">' +
        '<div class="step-info">' +
          '<span class="step-number">' + (index + 1) + '</span>' +
          '<span class="step-name">' + escapeHtml(step.name) + '</span>' +
        '</div>' +
        buttonHtml +
      '</div>';
    }).join('');

    // Attach complete handlers
    stepsListEl.querySelectorAll('.btn-complete').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          btn.disabled = true;
          btn.textContent = 'Completing...';
          await completeStep(sessionId, uid, btn.dataset.stepId);
        } catch (err) {
          showError(err.message);
          btn.disabled = false;
          btn.textContent = 'Complete';
        }
      });
    });
  }
})();
