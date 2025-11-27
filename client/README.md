# IDS Dashboard Client

A beautiful React dashboard for the Intrusion Detection System that displays attack sessions, visualizations, and analytics.

## Features

- 📊 **Dashboard Overview**: Real-time statistics and charts
- 🔍 **Attack Sessions List**: View all attack analysis sessions
- 📈 **Detailed Visualizations**: View all charts and graphs for each session
- 🎨 **Modern UI**: Built with React, TypeScript, Tailwind CSS, and Recharts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Login

For demo purposes, you can use any username/password to login. Authentication is currently bypassed.

## Pages

- **Dashboard** (`/dashboard`): Overview with statistics and charts
- **Attacks** (`/attacks`): List of all attack sessions
- **Attack Detail** (`/attacks/:id`): Detailed view with all visualizations

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- Recharts
- Axios

## API Integration

The client connects to the Express server at `http://localhost:3000` by default. Make sure the Express server is running before using the dashboard.

Endpoints used:
- `GET /data` - Fetch all insights
- `GET /data/session/:sessionId` - Fetch insights by session