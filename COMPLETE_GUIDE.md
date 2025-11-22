# Complete Guide: Sending Chart Insights from Jupyter Notebook to Express Server

## Overview

This guide explains how to automatically collect chart URLs from your Jupyter notebook and send them to your Express server for storage and display in your React dashboard.

## The Big Picture

```
┌─────────────────┐
│  Jupyter        │
│  Notebook       │
│                 │
│  1. Generate    │
│     Charts      │
│                 │
│  2. Track URLs  │
│     in INSIGHTS │
│                 │
│  3. Send to     │
│     Server      │
└────────┬────────┘
         │
         │ HTTP POST
         │
         ▼
┌─────────────────┐
│  Express        │
│  Server         │
│                 │
│  Store in       │
│  SQLite DB      │
└────────┬────────┘
         │
         │ API GET
         ▼
┌─────────────────┐
│  React          │
│  Dashboard      │
│                 │
│  Display        │
│  Charts         │
└─────────────────┘
```

## Quick Start Checklist

- [ ] **Step 1:** Run initialization cell (sets up tracking)
- [ ] **Step 2:** Generate charts using `save_plot_tracked()`
- [ ] **Step 3:** Run send cell (sends all charts to server)

## Detailed Steps

### 📘 [Step 1: Initialization](./STEP_1_INITIALIZATION.md)
- Sets up global `INSIGHTS` array
- Creates unique session ID
- Configures Google Drive upload
- **Run this ONCE at the beginning**

### 📊 [Step 2: Generate Charts](./STEP_2_GENERATE_CHARTS.md)
- Use `save_plot_tracked()` to create charts
- Charts are automatically tracked
- Uploaded to Google Drive (if in Colab)
- **Run this throughout your analysis**

### 📤 [Step 3: Send to Server](./STEP_3_SEND_TO_SERVER.md)
- Collects all chart URLs from `INSIGHTS`
- Sends to Express server via POST request
- Server stores in database
- **Run this at the end of your analysis**

## Example Workflow

### In Google Colab:

```python
# ============================================
# STEP 1: Initialize (Run once at start)
# ============================================
# [Run Cell 45 - Initialization]
# This creates INSIGHTS array and ATTACK_SESSION_ID

# ============================================
# STEP 2: Generate Charts (Run as needed)
# ============================================
import matplotlib.pyplot as plt
import numpy as np

# Chart 1: Confusion Matrix
plt.figure(figsize=(8, 6))
# ... create your plot ...
save_plot_tracked("confusion_matrix.png", dpi=300)
plt.close()

# Chart 2: ROC Curve
plt.figure(figsize=(8, 6))
# ... create your plot ...
save_plot_tracked("roc_curve.png", dpi=300)
plt.close()

# Chart 3: Feature Importance
plt.figure(figsize=(8, 6))
# ... create your plot ...
save_plot_tracked("feature_importance.png", dpi=300)
plt.close()

# ============================================
# STEP 3: Send to Server (Run at end)
# ============================================
# [Run Cell 46 - Send Insights]
# This sends all charts to your Express server
```

## Configuration

### Update BASE_URL

In **Step 1 (Cell 45)**, make sure to set the correct BASE_URL:

```python
# Option 1: Using ngrok (recommended for Colab)
BASE_URL = "https://8a86dd0a7133.ngrok-free.app"

# Option 2: Using localhost (if testing locally)
BASE_URL = "http://localhost:3000"

# Option 3: Your custom server URL
BASE_URL = "https://your-server.com"
```

### Mount Google Drive (if in Colab)

```python
from google.colab import drive
drive.mount('/content/drive')
```

## Server Setup

Make sure your Express server is running:

```bash
cd express-server
npm install  # First time only
npm start
```

If using ngrok:
```bash
ngrok http 3000
# Copy the ngrok URL and update BASE_URL in Step 1
```

## What Gets Stored

When you send insights, the server stores:

```json
{
  "id": 1,
  "attack_session_id": "attack_20251104_101530",
  "insights": [
    "/content/drive/MyDrive/IDS_Charts/attack_20251104_101530/confusion_matrix.png",
    "/content/drive/MyDrive/IDS_Charts/attack_20251104_101530/roc_curve.png",
    "/content/drive/MyDrive/IDS_Charts/attack_20251104_101530/feature_importance.png"
  ],
  "created_at": "2025-11-04 10:30:45"
}
```

## API Endpoints

Your Express server provides these endpoints:

- `GET /` - Welcome message
- `POST /data` - Store insights (used by notebook)
- `GET /data` - Get all insights
- `GET /data/session/:sessionId` - Get insights by session

## Troubleshooting

### Problem: "No insights to send"
- **Solution:** Make sure you ran Step 1 and generated charts in Step 2

### Problem: "Connection refused"
- **Solution:** Make sure Express server is running and BASE_URL is correct

### Problem: "Drive not mounted"
- **Solution:** Run `drive.mount('/content/drive')` in Colab

### Problem: Charts not being tracked
- **Solution:** Use `save_plot_tracked()` instead of `plt.savefig()` directly

## Testing

You can test the connection from your notebook:

```python
import requests

# Test server connection
try:
    response = requests.get(f"{BASE_URL}/", timeout=5)
    print(f"✅ Server is reachable! Status: {response.status_code}")
except Exception as e:
    print(f"❌ Cannot reach server: {e}")
```

## Next Steps

After sending insights:

1. ✅ Data is stored in SQLite database
2. ✅ Can be retrieved via API
3. ✅ Ready to display in React dashboard
4. ✅ Organized by attack session ID

## Files Reference

- `STEP_1_INITIALIZATION.md` - Setup and initialization
- `STEP_2_GENERATE_CHARTS.md` - How to generate and track charts
- `STEP_3_SEND_TO_SERVER.md` - How to send to server
- `express-server/README.md` - Server documentation
- `express-server/TEST_RESULTS.md` - Test results

## Support

If you encounter issues:

1. Check the troubleshooting section in each step
2. Verify server is running: `npm start` in express-server
3. Check BASE_URL matches your server URL
4. Verify Google Drive is mounted (if in Colab)

---

**Ready to start?** Begin with [Step 1: Initialization](./STEP_1_INITIALIZATION.md) 🚀

