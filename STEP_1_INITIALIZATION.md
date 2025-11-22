# Step 1: Initialize the Insights Tracker

## What This Step Does

This step sets up the tracking system that will automatically collect all chart URLs you generate and prepare them to be sent to your Express server.

## When to Run This

**Run this cell ONCE at the beginning of your notebook session**, before generating any charts.

## What Gets Created

1. **Global `INSIGHTS` array** - This is where all your chart URLs will be stored
2. **`ATTACK_SESSION_ID`** - A unique ID for this analysis session (e.g., `attack_20251104_101530`)
3. **`save_plot_tracked()` function** - A helper function to save charts and track them automatically
4. **Google Drive upload function** - Automatically uploads charts to Drive if you're in Colab

## The Code (Cell 45 in your notebook)

```python
# =========================================================
# Initialize Global Insights Tracker
# Run this cell once at the beginning of your analysis
# =========================================================
import os
import datetime
import matplotlib.pyplot as plt

# Global insights array - tracks all chart URLs generated in this session
INSIGHTS = []

# Generate unique attack session ID for this run
ATTACK_SESSION_ID = f"attack_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Configuration
BASE_URL = "https://8a86dd0a7133.ngrok-free.app"  # ⚠️ UPDATE THIS with your server URL
PLOTS_DIR = os.path.join(ART_DIR, "plots") if 'ART_DIR' in globals() else "artifacts/plots"
os.makedirs(PLOTS_DIR, exist_ok=True)

# Helper function to upload to Google Drive and get shareable URL
def upload_to_drive_and_get_url(filepath, filename):
    """
    Upload file to Google Drive and return shareable URL.
    Automatically copies files to Drive when running in Colab.
    Returns Drive path (user needs to share folder to get public URLs).
    """
    try:
        import google.colab
        import shutil

        # Check if Drive is mounted
        if not os.path.exists('/content/drive'):
            print(f"  ⚠️  Drive not mounted. Mount Drive first with: drive.mount('/content/drive')")
            return filepath

        # Create Drive directory for charts (organized by session)
        drive_charts_dir = f"/content/drive/MyDrive/IDS_Charts/{ATTACK_SESSION_ID}"
        os.makedirs(drive_charts_dir, exist_ok=True)

        # Copy file to Drive
        drive_filepath = os.path.join(drive_charts_dir, filename)
        shutil.copy2(filepath, drive_filepath)

        print(f"  📁 Copied to Drive: {drive_filepath}")

        # Return Drive path - user can share the folder in Drive to get public access
        return drive_filepath

    except ImportError:
        # Not running in Colab
        print(f"  📄 Not in Colab - using local path")
        return filepath
    except Exception as e:
        print(f"  ⚠️  Error uploading to Drive: {e}")
        return filepath

# Helper function to save plot and track URL
def save_plot_tracked(filename, **kwargs):
    """
    Wrapper around plt.savefig that automatically tracks the saved chart URL.
    Automatically uploads to Google Drive if running in Colab.
    Usage: save_plot_tracked("my_chart.png") instead of plt.savefig("my_chart.png")
    """
    filepath = os.path.join(PLOTS_DIR, filename)
    plt.savefig(filepath, **kwargs)

    # Upload to Google Drive and get shareable URL
    file_url = upload_to_drive_and_get_url(filepath, filename)

    # Add to insights array
    INSIGHTS.append({
        "name": filename,
        "url": file_url,
        "session_id": ATTACK_SESSION_ID,
        "timestamp": datetime.datetime.now().isoformat()
    })

    print(f"📊 Saved and tracked: {filename} (Total: {len(INSIGHTS)} charts)")
    return filepath

print(f"✅ Insights tracker initialized!")
print(f"   Session ID: {ATTACK_SESSION_ID}")
print(f"   Plots directory: {PLOTS_DIR}")
print(f"   Current insights count: {len(INSIGHTS)}")
```

## Important: Update BASE_URL

**Before running this cell, make sure to update the `BASE_URL`:**

```python
BASE_URL = "https://8a86dd0a7133.ngrok-free.app"  # Your ngrok URL
# OR if testing locally:
BASE_URL = "http://localhost:3000"  # Your local server
```

## Expected Output

When you run this cell, you should see:

```
✅ Insights tracker initialized!
   Session ID: attack_20251104_101530
   Plots directory: artifacts/plots
   Current insights count: 0
   ✅ Google Drive detected and mounted
   📁 Charts will be uploaded to: /content/drive/MyDrive/IDS_Charts/attack_20251104_101530

💡 Usage:
   - Use save_plot_tracked('filename.png') to save, upload to Drive, and track
   - Or use plt.savefig() normally and manually add URLs to INSIGHTS array
   - Run the 'Send Insights' cell at the end to send all collected charts

📝 Note: Files are saved to Google Drive at:
   /content/drive/MyDrive/IDS_Charts/attack_20251104_101530/
   To get public URLs: Share the folder in Drive and get shareable links
```

## What Happens Next?

After running this cell:
- ✅ The tracking system is ready
- ✅ You can now generate charts (see Step 2)
- ✅ All charts will be automatically tracked in the `INSIGHTS` array

## Troubleshooting

**If you see "Drive not mounted":**
```python
from google.colab import drive
drive.mount('/content/drive')
```

**If BASE_URL is wrong:**
- Make sure your Express server is running
- If using ngrok, make sure ngrok is active
- Update the BASE_URL to match your server URL

---

**Next Step:** [Step 2 - Generate Charts](./STEP_2_GENERATE_CHARTS.md)

