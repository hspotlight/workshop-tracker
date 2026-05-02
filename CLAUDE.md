# Workshop Tracker

Real-time workshop progress tracking app. Creators define sessions with custom steps, share a link, and watch participants complete steps on a live dashboard.

## Commands

```bash
pnpm install          # Install deps
pnpm serve            # Copy config + serve on localhost:3000
pnpm test             # Run Jest tests
pnpm test:watch       # Watch mode
pnpm deploy           # Firebase deploy
```

## Architecture

```
workshop-tracker/
├── public/
│   ├── index.html             # Landing page
│   ├── login.html             # Google Sign-In for creators
│   ├── dashboard.html         # Creator's session list + create session
│   ├── session.html           # Dual-purpose: creator grid / participant steps
│   ├── style.css              # Structural CSS (frontend-design for polish)
│   ├── utils.js               # Firebase init + all Firestore helpers + validation
│   ├── login.js               # Google auth logic
│   ├── dashboard.js           # Session CRUD, modal, session list
│   ├── session.js             # Real-time grid (creator) / step completion (participant)
│   ├── firebase-config.js     # Active config (gitignored, copied from config/)
│   └── config/
│       └── firebase-config.js # Placeholder config (committed)
├── __tests__/
│   ├── setup.js               # Global Firebase mock
│   └── utils.test.js          # Validation + pure function tests
└── .github/workflows/
    └── deploy.yml             # Deploy on push/PR to main
```

## Auth Flow

- **Creators**: Google Sign-In → can create/manage sessions
- **Participants**: Anonymous Auth (automatic) → just enter display name to join

## Firestore Data Model

```
sessions/{sessionId}
  ├── creatorId: string        # Google auth uid
  ├── name: string             # "AWS Workshop June 2026"
  ├── steps: [{id, name}]      # Ordered array of steps
  ├── status: 'active'|'closed'
  └── createdAt: timestamp

sessions/{sessionId}/participants/{participantId}
  ├── displayName: string
  ├── joinedAt: timestamp
  └── progress: {              # Map of step ID → completion
        "step-0": { completedAt: timestamp },
        "step-1": { completedAt: timestamp }
      }
```

## Security Rules

- Sessions: anyone can read, only authenticated non-anonymous users can create, only creator can update/delete
- Participants: creator can read all + reset, participant can read/write own doc
- Default deny everything else

## Key Principles

- Steps unlock sequentially — step N+1 only after step N is completed
- Progress is one-way — once completed, cannot be unchecked (creator can reset)
- Timestamps recorded per step completion for analysis
- Same URL for creator and participant — authorization determines the view
- `escapeHtml()` used for all user-generated content (XSS prevention)
- Tests target pure functions only — no Firebase SDK in tests

## Testing Patterns

- Validation logic (session data, display names)
- Step completion logic (sequential unlock, boundary cases)
- Data structure helpers (completed count, all complete check)
- XSS prevention (escapeHtml)
