# Step 3: Send Insights to Express Server

## What This Step Does

This step takes all the chart URLs you've collected in the `INSIGHTS` array and sends them to your Express server. The server will store them in a database so you can view them later in your React dashboard.

## When to Run This

**Run this cell AFTER you've generated all your charts** (after Step 2). This is typically at the end of your analysis.

## Prerequisites

Before running this step, make sure:

1. ✅ **Step 1 (Initialization) has been run** - `INSIGHTS` array exists
2. ✅ **Step 2 (Generate Charts) has been completed** - You have charts in `INSIGHTS`
3. ✅ **Express server is running** - Your server is accessible at `BASE_URL`
4. ✅ **BASE_URL is correct** - Matches your server URL (ngrok or localhost)

## The Code (Cell 46 in your notebook)

```python
# =========================================================
# Send Collected Insights to Express Server
# Run this cell after all charts have been generated
# =========================================================
%pip install -q requests

import requests

# Check if we have insights to send
if len(INSIGHTS) == 0:
    print("⚠️  No insights to send. Generate charts first using save_plot_tracked() or plt.savefig()")
    print("   Make sure to manually add URLs to INSIGHTS array if using plt.savefig() directly")
else:
    print(f"📊 Preparing to send {len(INSIGHTS)} insights from session: {ATTACK_SESSION_ID}")
    print(f"\n📋 Charts to send:")
    for i, insight in enumerate(INSIGHTS, 1):
        print(f"  {i}. {insight['name']}")

    # Extract URLs from insights
    chart_urls = [insight["url"] for insight in INSIGHTS]

    # Prepare payload
    payload = {
        "insights": chart_urls,
        "attack_session_id": ATTACK_SESSION_ID
    }

    try:
        print(f"\n📤 Sending to {BASE_URL}/data...")

        # Send POST request
        response = requests.post(
            f"{BASE_URL}/data",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success! Server response:")
            print(f"   Session ID: {result.get('session_id')}")
            print(f"   Stored ID: {result.get('id')}")
            print(f"   Charts count: {result.get('count')}")
            print(f"   Message: {result.get('message')}")

            # Clear insights after successful send (optional - comment out if you want to keep them)
            # INSIGHTS.clear()
            # print(f"\n🔄 Insights array cleared. Ready for next session.")

        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Response: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send insights: {e}")
        print(f"   Make sure the server is running at {BASE_URL}")
        print(f"   Insights are still in INSIGHTS array and can be sent later")
```

## Expected Output (Success)

When everything works correctly, you'll see:

```
📊 Preparing to send 5 insights from session: attack_20251104_101530

📋 Charts to send:
  1. confusion_matrix.png
  2. roc_curve.png
  3. feature_importance.png
  4. precision_recall_curve.png
  5. model_comparison.png

📤 Sending to https://8a86dd0a7133.ngrok-free.app/data...
✅ Success! Server response:
   Session ID: attack_20251104_101530
   Stored ID: 1
   Charts count: 5
   Message: Successfully stored 5 insights
```

## Expected Output (No Charts)

If you haven't generated any charts yet:

```
⚠️  No insights to send. Generate charts first using save_plot_tracked() or plt.savefig()
   Make sure to manually add URLs to INSIGHTS array if using plt.savefig() directly
```

## Expected Output (Server Error)

If the server isn't running or unreachable:

```
📊 Preparing to send 5 insights from session: attack_20251104_101530

📋 Charts to send:
  1. confusion_matrix.png
  2. roc_curve.png
  ...

📤 Sending to https://8a86dd0a7133.ngrok-free.app/data...
❌ Failed to send insights: Connection refused
   Make sure the server is running at https://8a86dd0a7133.ngrok-free.app
   Insights are still in INSIGHTS array and can be sent later
```

## What Happens on the Server

When you send insights, the server:

1. ✅ **Receives the payload** - Gets the array of chart URLs and session ID
2. ✅ **Stores in database** - Saves to SQLite database (`insights.db`)
3. ✅ **Returns confirmation** - Sends back success message with stored ID

The data is stored like this:
```json
{
  "id": 1,
  "attack_session_id": "attack_20251104_101530",
  "insights": "[\"url1\", \"url2\", \"url3\"]",
  "created_at": "2025-11-04 10:30:45"
}
```

## Verify It Worked

You can verify the data was stored by checking your Express server:

**Option 1: Check server logs**
- Look at your server console - you should see:
  ```
  Received 5 insights/charts for session: attack_20251104_101530
  Insights stored with ID: 1 for session: attack_20251104_101530
  ```

**Option 2: Query the API**
```python
# In a new cell, test retrieving the data
import requests

response = requests.get(f"{BASE_URL}/data")
if response.status_code == 200:
    data = response.json()
    print(f"Total insights in database: {len(data['insights'])}")
    for insight in data['insights']:
        print(f"  Session: {insight['attack_session_id']}")
        print(f"  Created: {insight['created_at']}")
```

## Troubleshooting

### Problem: "Connection refused" or "Connection error"

**Solution:**
1. Make sure your Express server is running:
   ```bash
   cd express-server
   npm start
   ```

2. If using ngrok, make sure ngrok is active:
   ```bash
   ngrok http 3000
   ```

3. Check that BASE_URL is correct in Step 1

### Problem: "No insights to send"

**Solution:**
- Make sure you ran Step 1 (Initialization)
- Make sure you generated charts using `save_plot_tracked()` in Step 2
- Check that `len(INSIGHTS) > 0`

### Problem: "400 Bad Request"

**Solution:**
- The payload format might be wrong
- Make sure `INSIGHTS` array contains dictionaries with "url" key
- Check server logs for more details

### Problem: "Timeout"

**Solution:**
- Server might be slow or unreachable
- Increase timeout: `timeout=60` instead of `timeout=30`
- Check your internet connection (if using ngrok)

## What's Next?

After successfully sending insights:

1. ✅ **Data is stored** - Your charts are now in the database
2. ✅ **Can be retrieved** - Your React dashboard can fetch them via API
3. ✅ **Organized by session** - Each attack analysis has its own session ID

You can now:
- View insights in your React dashboard
- Query insights by session ID
- Retrieve all insights via `GET /data` endpoint

---

**All Steps Complete!** 🎉

Your charts are now stored in the database and ready to be displayed in your React dashboard.

