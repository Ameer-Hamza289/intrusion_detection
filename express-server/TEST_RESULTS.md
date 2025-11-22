# Express Server Test Results

## ✅ All Tests Passed!

### Test Results Summary

**Date:** 2025-11-04
**Server:** Express Server (Node.js)
**Port:** 3000

---

### Test 1: Root Endpoint ✅
- **Endpoint:** `GET /`
- **Status:** ✅ PASSED
- **Response:** "Welcome to intrusion detection system!"
- **Result:** Server is running correctly

---

### Test 2: POST Insights ✅
- **Endpoint:** `POST /data`
- **Status:** ✅ PASSED
- **Payload:**
  ```json
  {
    "insights": [
      "https://drive.google.com/uc?export=view&id=test_chart_1",
      "https://drive.google.com/uc?export=view&id=test_chart_2",
      "https://drive.google.com/uc?export=view&id=test_chart_3"
    ],
    "attack_session_id": "attack_2025-11-04T10-16-46"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully stored 3 insights",
    "id": 1,
    "session_id": "attack_2025-11-04T10-16-46",
    "count": 3
  }
  ```
- **Result:** Insights successfully stored in database

---

### Test 3: GET All Insights ✅
- **Endpoint:** `GET /data`
- **Status:** ✅ PASSED
- **Response:** Retrieved all stored insights
- **Result:** Database query working correctly

---

### Test 4: GET Insights by Session ✅
- **Endpoint:** `GET /data/session/:sessionId`
- **Status:** ✅ PASSED
- **Result:** Session-based filtering working correctly

---

### Test 5: Input Validation ✅
- **Endpoint:** `POST /data` (with invalid data)
- **Status:** ✅ PASSED (400 Bad Request)
- **Result:** Validation working correctly - rejects invalid payloads

---

## Database Structure

The server uses SQLite with the following schema:

```sql
CREATE TABLE insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attack_session_id TEXT,
    insights TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### 1. `GET /`
- Returns welcome message
- **Response:** `"Welcome to intrusion detection system!"`

### 2. `POST /data`
- Stores insights (chart URLs) for an attack session
- **Body:**
  ```json
  {
    "insights": ["url1", "url2", ...],
    "attack_session_id": "optional_session_id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Successfully stored N insights",
    "id": 1,
    "session_id": "attack_...",
    "count": N
  }
  ```

### 3. `GET /data`
- Retrieves all stored insights
- **Response:**
  ```json
  {
    "insights": [
      {
        "id": 1,
        "attack_session_id": "attack_...",
        "insights": "[\"url1\", \"url2\"]",
        "created_at": "2025-11-04 10:16:48"
      }
    ]
  }
  ```

### 4. `GET /data/session/:sessionId`
- Retrieves insights for a specific session
- **Response:**
  ```json
  {
    "insights": [...],
    "session_id": "attack_..."
  }
  ```

---

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

3. **Test the endpoints:**
   ```bash
   node test-endpoints.js
   ```

---

## Integration with Notebook

The notebook should use:
- **Base URL:** `http://localhost:3000` (or your ngrok URL: `https://8a86dd0a7133.ngrok-free.app`)
- **Endpoint:** `POST /data`
- **Payload format:** As shown above

---

## Notes

- ✅ All endpoints are working correctly
- ✅ Database storage is functional
- ✅ Session tracking is implemented
- ✅ Input validation is working
- ✅ CORS is enabled for cross-origin requests
- ✅ Database file: `insights.db` (created automatically)

---

**Status:** ✅ **READY FOR PRODUCTION USE**


