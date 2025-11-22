# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Initialize (Run Once)
```python
# In your notebook, run Cell 45
# This sets up INSIGHTS array and tracking
```

**What to check:**
- ✅ Update `BASE_URL` to your server URL
- ✅ Mount Google Drive if in Colab: `drive.mount('/content/drive')`

---

### Step 2: Generate Charts
```python
# Instead of: plt.savefig("chart.png")
# Use this:
save_plot_tracked("chart.png", dpi=300)
```

**What happens:**
- ✅ Chart saved locally
- ✅ Uploaded to Google Drive
- ✅ Added to INSIGHTS array automatically

---

### Step 3: Send to Server
```python
# In your notebook, run Cell 46
# This sends all collected charts to your server
```

**What happens:**
- ✅ All chart URLs sent to Express server
- ✅ Stored in database
- ✅ Ready for React dashboard

---

## ⚙️ Configuration

### Update BASE_URL (in Step 1)
```python
# Your ngrok URL:
BASE_URL = "https://8a86dd0a7133.ngrok-free.app"

# OR your local server:
BASE_URL = "http://localhost:3000"
```

### Start Express Server
```bash
cd express-server
npm start
```

---

## ✅ Success Indicators

**Step 1 Output:**
```
✅ Insights tracker initialized!
   Session ID: attack_20251104_101530
```

**Step 2 Output:**
```
📊 Saved and tracked: chart.png (Total: 1 charts)
  📁 Copied to Drive: /content/drive/MyDrive/IDS_Charts/...
```

**Step 3 Output:**
```
✅ Success! Server response:
   Session ID: attack_20251104_101530
   Charts count: 5
```

---

## 📚 Full Documentation

- [Complete Guide](./COMPLETE_GUIDE.md) - Full explanation
- [Step 1 Details](./STEP_1_INITIALIZATION.md) - Initialization
- [Step 2 Details](./STEP_2_GENERATE_CHARTS.md) - Generate Charts
- [Step 3 Details](./STEP_3_SEND_TO_SERVER.md) - Send to Server

---

**That's it!** Follow these 3 steps and your charts will be automatically sent to your server. 🎉

