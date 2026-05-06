// Firebase initialization and Firestore helpers
let auth;
let db;

function initializeFirebase() {
  if (!window.firebaseConfig) {
    console.error('Firebase config not found. Run: pnpm serve');
    return;
  }
  firebase.initializeApp(window.firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ── Auth helpers ──

function logout() {
  return auth.signOut();
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}

function signInAnonymously() {
  return auth.signInAnonymously();
}

// ── Session helpers ──

async function createSession(userId, data) {
  const name = data.name?.trim();
  if (!name) throw new Error('Session name is required');
  if (!data.steps || data.steps.length === 0) throw new Error('At least one step is required');

  const steps = data.steps.map((step, index) => ({
    id: 'step-' + index,
    name: step.name.trim(),
    description: step.description?.trim() || '',
  }));

  const sessionId = generateId();
  await db.collection('sessions').doc(sessionId).set({
    creatorId: userId,
    name,
    steps,
    status: 'active',
    createdAt: new Date(),
  });

  return { id: sessionId, name, steps, status: 'active' };
}

async function getSession(sessionId) {
  const doc = await db.collection('sessions').doc(sessionId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getUserSessions(userId) {
  const snapshot = await db.collection('sessions')
    .where('creatorId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateSession(sessionId, data) {
  const name = data.name?.trim();
  if (!name) throw new Error('Session name is required');
  if (!data.steps || data.steps.length === 0) throw new Error('At least one step is required');

  const steps = data.steps.map(step => ({
    id: step.id || 'step-' + generateId(),
    name: step.name.trim(),
    description: step.description?.trim() || '',
  }));

  await db.collection('sessions').doc(sessionId).update({ name, steps });
  return { name, steps };
}

async function closeSession(sessionId) {
  await db.collection('sessions').doc(sessionId).update({ status: 'closed' });
}

async function reopenSession(sessionId) {
  await db.collection('sessions').doc(sessionId).update({ status: 'active' });
}

// ── Participant helpers ──

async function joinSession(sessionId, participantId, displayName) {
  const name = displayName?.trim();
  if (!name) throw new Error('Display name is required');

  const docRef = db.collection('sessions').doc(sessionId)
    .collection('participants').doc(participantId);

  const existing = await docRef.get();
  if (existing.exists) return { id: existing.id, ...existing.data() };

  const participant = {
    displayName: name,
    joinedAt: new Date(),
    progress: {},
  };
  await docRef.set(participant);
  return { id: participantId, ...participant };
}

async function getParticipant(sessionId, participantId) {
  const doc = await db.collection('sessions').doc(sessionId)
    .collection('participants').doc(participantId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function completeStep(sessionId, participantId, stepId) {
  const key = 'progress.' + stepId;
  await db.collection('sessions').doc(sessionId)
    .collection('participants').doc(participantId)
    .update({
      [key]: { completedAt: new Date() },
    });
}

async function resetParticipant(sessionId, participantId) {
  await db.collection('sessions').doc(sessionId)
    .collection('participants').doc(participantId)
    .update({ progress: {} });
}

// ── Real-time listeners ──

function onParticipantsChanged(sessionId, callback) {
  return db.collection('sessions').doc(sessionId)
    .collection('participants')
    .onSnapshot(snapshot => {
      const participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(participants);
    });
}

function onParticipantChanged(sessionId, participantId, callback) {
  return db.collection('sessions').doc(sessionId)
    .collection('participants').doc(participantId)
    .onSnapshot(doc => {
      if (doc.exists) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
}

// ── Validation helpers (exported for tests) ──

function validateSessionData(data) {
  const errors = [];
  if (!data.name?.trim()) errors.push('Session name is required');
  if (!data.steps || data.steps.length === 0) errors.push('At least one step is required');
  if (data.steps) {
    data.steps.forEach((step, i) => {
      const name = typeof step === 'string' ? step : step?.name;
      if (!name?.trim()) errors.push('Step ' + (i + 1) + ' name is required');
    });
  }
  return errors;
}

function validateDisplayName(name) {
  if (!name?.trim()) return 'Display name is required';
  if (name.trim().length > 50) return 'Display name must be 50 characters or less';
  return null;
}

function canCompleteStep(steps, progress, stepId) {
  const stepIndex = steps.findIndex(s => s.id === stepId);
  if (stepIndex < 0) return false;
  if (stepIndex === 0) return !progress[stepId];
  const prevStep = steps[stepIndex - 1];
  return !!progress[prevStep.id] && !progress[stepId];
}

function getCompletedCount(steps, progress) {
  return steps.filter(s => progress[s.id]).length;
}

function isAllComplete(steps, progress) {
  return steps.every(s => progress[s.id]);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHtml,
    generateId,
    validateSessionData,
    validateDisplayName,
    canCompleteStep,
    getCompletedCount,
    isAllComplete,
    updateSession,
  };
}
