# CivicLink (MERN MVP)

This repository contains a working MERN (MongoDB, Express, React, Node.js) Minimum Viable Product.

- **Frontend:** React (Vite) located in the `client/` directory. Utilizes Radix UI for accessible components and Recharts for data visualization.
- **Backend:** Express + MongoDB API located in the `server/` directory. Uses Zod for schema validation and Bcrypt for security.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas)

## Getting Started

### 1. Installation
Install the required dependencies for both the frontend and backend.
From the root directory, navigate to each folder:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Setup
Navigate to the `server/` directory and create a `.env` file (you can copy from `server/.env.example` if available). Set the following variables:

```ini
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:5173
# Optional: comma-separated emails to auto-assign admin role on register
ADMIN_EMAILS=admin@example.com
```
*(Note: Frontend Vite runs on port `5173` by default, update `CLIENT_ORIGIN` if using a different port or `3000`)*

### 3. Running the Application (Development Mode)
You will need to start both the server and client in separate terminal windows.

**Start the Server:**
```bash
cd server
npm run dev
```
*The server will run on `http://localhost:4000`.*

**Start the Client:**
```bash
cd client
npm run dev
```
*The client will run on `http://localhost:5173` (proxies `/api` to the server).*