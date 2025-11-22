# Express Server - Intrusion Detection System

Backend server for storing and retrieving attack insights/charts from the Jupyter notebook.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test the endpoints:**
   ```bash
   node test-endpoints.js
   ```

## Environment Variables

Create a `.env` file (optional):
```
PORT=3000
```

## API Endpoints

- `GET /` - Welcome message
- `POST /data` - Store insights (chart URLs)
- `GET /data` - Get all insights
- `GET /data/session/:sessionId` - Get insights by session

## Database

SQLite database (`insights.db`) is created automatically on first run.

## Testing

Run the test suite:
```bash
node test-endpoints.js
```

See `TEST_RESULTS.md` for detailed test results.


