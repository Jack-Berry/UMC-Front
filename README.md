# UMC - Useless Men Community

A skill-matching and community platform that connects men based on complementary strengths. Users complete a series of skill assessments, get a visual breakdown of where they stand, and are matched with nearby people who can help them improve, or who they can help in turn.

This is phase 1 of an ongoing project. The current build covers the core platform: auth, assessments, matching, messaging, friends, events, and a news feed. Later phases will expand on discovery, mobile experience, and community features.

Live at [uselessmen.org](https://uselessmen.org)

---

## What it does

Users sign up, verify their email, and work through a set of assessments covering DIY, technology, communication, self-care, and community. Answers are scored on a 1-5 scale and aggregated into per-category and per-skill-tag scores. Those scores drive the match feed, which surfaces users nearby who are strong where you are weak and vice versa.

From there, users can send friend requests, start encrypted conversations, and register for local events. There is also an admin area for managing assessment content, events, and a news feed.

---

## Tech stack

**Frontend**

- React 19, Vite 7, React Router 7
- Redux Toolkit for state management
- TailwindCSS for styling
- Framer Motion for animations
- Socket.io client for real-time presence and messaging
- Recharts for skill score visualisations
- dnd-kit for drag-and-drop in the admin panel
- Supabase JS for file storage (avatars, news images)
- Google Maps Extended Component Library for location picking

**Backend** (separate repo)

- Node.js with Express 5
- PostgreSQL with raw SQL via the pg driver
- Socket.io for real-time communication
- JWT auth with short-lived access tokens and refresh token rotation
- AES-256-GCM message encryption with HKDF key derivation
- Multer and Sharp for file upload handling
- Nodemailer for transactional email

---

## Key features

**Skill assessments** six assessment types, 158+ questions, with hierarchical follow-ups that deepen based on initial answers. Scores are aggregated server-side using a PostgreSQL CTE and stored as JSONB on the user profile.

**Skill visualisations** users can view their scores as a radar chart, bar chart, or colour-coded heatmap. Clicking a category drills down into per-tag scores within that category. All data comes from the Redux store so there are no extra network requests on drill-down.

**Geographic matching** matches are found using a Haversine distance query in PostgreSQL, filtered by radius, and ranked by skill complementarity. The threshold logic (weak below 40, strong above 70) is configurable per request.

**Encrypted messaging** each conversation has a unique AES-256-GCM key derived from a server-side master secret and a per-conversation salt via HKDF. The server stores and relays ciphertext but cannot read message content.

**Real-time presence** Socket.io tracks online/offline state and last-seen timestamps. Presence updates are broadcast to all connected clients. Users join per-thread rooms for live message delivery.

**Admin panel** full CRUD for assessment questions with reordering, active/inactive toggling, and tag management. Includes a SQL snapshot system that saves point-in-time backups of the question set as executable restore scripts.

---

## Getting started

```bash
npm install
npm run dev
```

You will need a `.env` file with the following:

```
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_MAPS_KEY=
VITE_MAPBOX_TOKEN=
```

The backend repo needs to be running separately for API calls to work.

---

## Project structure

```
src/
  components/    reusable UI components (37+)
  pages/         route-level page components
  store/         Redux slices (user, assessments, events, news, friends, messages, matches)
  utils/         API client, token handling, helpers
```

---

## Status

Phase 1 is feature-complete and deployed. The platform handles real users with live auth, encrypted messaging, and geographic matching in production.

Planned for later phases: improved match discovery, mobile-native experience, group features, and expanded community tools.
