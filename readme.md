### A Lightweight Intrusion Detection System for IoT: Detecting SYN Flood

A comprehensive full-stack application for monitoring and analyzing network attacks in IoT environments, with a particular focus on SYN flood detection and visualization. This system provides real-time monitoring, historical analysis, and detailed attack insights through an intuitive dashboard interface and listings.

## Features

### Dashboard Overview
- Real-time attack monitoring with live updates
- Interactive charts and metrics visualization
- Attack severity distribution analysis
- Success rate monitoring for attack mitigation
- Time-based attack pattern analysis

### Attack Management
- Comprehensive attack listing with filtering capabilities
- Detailed attack information and metrics
- Visual representation of attack patterns
- Attack severity classification (High, Medium, Low)
- Attack status tracking (Mitigated, Ongoing, Failed)

### Security
- JWT-based authentication system
- Role-based access control
- Secure password hashing
- Protected API endpoints
- Session management

### Performance
- Lazy loading of images and visualizations
- Efficient data fetching with React Query
- Optimized database queries
- Response caching
- Paginated data loading

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript 5.x
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - HeadlessUI for accessible components
- **State Management & Data Fetching**:
  - TanStack Query (React Query) v5 for server state
  - React Context for authentication state
- **Routing**: React Router v6
- **Visualization**:
  - Recharts for interactive charts
  - react-lazy-load-image-component for optimized image loading
- **Type Safety**: TypeScript with strict mode enabled

### Backend
- **Framework**: Express
- **Language**: TypeScript 5.x
- **Database**:
  - MongoDB for data storage

## Project Structure

```
infusion_detection/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── server/                   # Backend NestJS application
    ├── src/
    │   ├── attacks/         # Attacks module
    │   │   ├── dto/        # Data Transfer Objects
    │   │   ├── entities/   # Database entities
    │   │   └── tests/      # Module tests
    │   ├── auth/            # Authentication module
    │   │   ├── dto/        # Auth DTOs
    │   │   ├── entities/   # User entity
    │   │   └── tests/      # Auth tests
    │   └── main.ts         # Application entry point
    └── package.json         # Backend dependencies
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v16 or later)
- npm/pnpm/yarn
- Git

### Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE ids_db;
   ```
3. Note your PostgreSQL credentials for the next steps

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create .env file
   cp .env.example .env

   # Update the following variables in .env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=ids_db
   JWT_SECRET=your_secret_key
   ```

4. Start the development server:
   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:3000" > .env
   ```

4. Start the development server:
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm run preview
   ```

### Accessing the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api

## API Documentation

### Authentication Endpoints

#### POST /auth/login
- Login with username and password
- Returns JWT token
```json
{
  "username": "string",
  "password": "string"
}
```

#### POST /auth/register
- Register a new user
- Returns user object without password
```json
{
  "username": "string",
  "password": "string"
}
```

### Attacks Endpoints

#### GET /attacks
- List all attacks with pagination
- Query parameters:
  - page: number
  - limit: number
  - severity: 'high' | 'medium' | 'low'
  - status: 'mitigated' | 'ongoing' | 'failed'

#### GET /attacks/overview
- Get attack statistics and metrics
- Query parameters:
  - timeRange: '24h' | '7d' | '30d'
```json
{
  "totalCount": "number",
  "highSeverityCount": "number",
  "mitigationRate": "number",
  "timeSeriesData": [
    {
      "timestamp": "string",
      "attacks": "number"
    }
  ]
}
```

#### GET /attacks/:id
- Get detailed information about a specific attack
```json
{
  "id": "string",
  "type": "string",
  "severity": "string",
  "status": "string",
  "timestamp": "string",
  "metrics": {
    "packetsPerSecond": "number",
    "bandwidth": "number",
    "duration": "number",
    "sourceIpCount": "number"
  },
  "visualizations": [
    {
      "title": "string",
      "imageUrl": "string",
      "description": "string"
    }
  ],
  "mitigation": {
    "actions": "string[]",
    "recommendations": "string[]"
  }
}
```

#### POST /attacks/images
- Store attack visualizations and insights
```json
{
  "imageUrl": "string",
  "insights": "string"
}
```

## Development

### Scripts

#### Backend
```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Testing
npm run test          # Unit tests
npm run test:e2e     # E2E tests
npm run test:cov     # Test coverage
```

#### Frontend
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview

# Linting and formatting
npm run lint
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
