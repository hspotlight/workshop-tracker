global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
    signInWithPopup: jest.fn(),
    signInAnonymously: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(),
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            onSnapshot: jest.fn(),
          })),
          get: jest.fn(),
          onSnapshot: jest.fn(),
        })),
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    })),
  })),
};

global.firebase.auth.GoogleAuthProvider = jest.fn();
