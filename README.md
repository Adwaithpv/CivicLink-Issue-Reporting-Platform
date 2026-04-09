
## CivicLink (MERN MVP)

This repo contains a working MERN MVP:
- React (Vite) client in `client/`
- Express + MongoDB API in `server/`

### Prereqs
- Node.js
- MongoDB (local or Atlas)

### Setup
1. Install deps:
   - `npm install`
2. Create `server/.env` (copy from `server/.env.example`) and set:
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `CLIENT_ORIGIN` (e.g. `http://localhost:3000`)
   - Optional: `ADMIN_EMAILS` (comma-separated) to auto-assign admin role on register

### Run (dev)
- `npm run dev`

Client: `http://localhost:3000` (proxies `/api` to the server)\nServer: `http://localhost:4000`
  