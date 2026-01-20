# SmartSoother - Baby Monitor (MERN Stack)

SmartSoother is a comprehensive monitoring system for baby health metrics (Temperature, Heart Rate, Hydration) using simulated IoT data.

## Features
- **Real-time Dashboard**: Live updates via Socket.IO.
- **Alert System**: Immediate notifications for critical vitals.
- **Device Management**: Pair simulated devices to baby profiles.
- **Role-based Auth**: Secure login for parents.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **Auth**: JWT, bcrypt

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or URI provided)

## Setup Instructions

### 1. Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file (included): 
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-soother
   JWT_SECRET=your_secret_key
   ```
4. Start server: `npm run dev` (Runs on port 5000)

### 2. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev` (Runs on port 5173)

### 3. Usage Guide
1. **Signup** as a parent.
2. Go to **My Devices**.
3. **Add a Baby** profile.
4. **Pair a Device** using any ID (e.g., `DEVICE_001`).
   - *Note: Since this is a simulation, pairing a new ID will automatically "activate" it.*
5. Go to **Dashboard** to view live data streaming from the background simulator.

## Troubleshoot
- If charts don't show, ensure the backend is running and MongoDB is connected.
- If simulated data doesn't appear, make sure you have paired a device and assigned it to a baby.

---
**GlowCare Innovations**
