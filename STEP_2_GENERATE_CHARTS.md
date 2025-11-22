# Step 2: Generate Charts and Track Them

## What This Step Does

This step shows you how to generate charts (plots) in your notebook. The charts will be automatically saved and tracked in the `INSIGHTS` array that was created in Step 1.

## When to Run This

**Run this AFTER Step 1 (Initialization)**. You can generate charts throughout your analysis - they will all be collected automatically.

## Two Ways to Generate Charts

### Method 1: Use `save_plot_tracked()` (Recommended) ✅

This is the easiest way - it automatically saves, uploads to Drive, and tracks the chart.

**Example:**
```python
import matplotlib.pyplot as plt
import numpy as np

# Create a simple chart
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.title("Sine Wave")
plt.xlabel("X")
plt.ylabel("Y")

# Save and track automatically
save_plot_tracked("sine_wave.png", dpi=300, bbox_inches='tight')
plt.close()
```

**What happens:**
1. ✅ Chart is saved to `artifacts/plots/sine_wave.png`
2. ✅ Chart is copied to Google Drive (if in Colab)
3. ✅ Chart URL is added to `INSIGHTS` array
4. ✅ You see: `📊 Saved and tracked: sine_wave.png (Total: 1 charts)`

### Method 2: Use `plt.savefig()` Normally

If you prefer to use `plt.savefig()` directly, you can still track charts:

**Example:**
```python
import matplotlib.pyplot as plt
import numpy as np

# Create a chart
x = np.linspace(0, 10, 100)
y = np.cos(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.title("Cosine Wave")

# Save normally
filepath = os.path.join(PLOTS_DIR, "cosine_wave.png")
plt.savefig(filepath, dpi=300, bbox_inches='tight')
plt.close()

# Manually add to INSIGHTS array
INSIGHTS.append({
    "name": "cosine_wave.png",
    "url": upload_to_drive_and_get_url(filepath, "cosine_wave.png"),
    "session_id": ATTACK_SESSION_ID,
    "timestamp": datetime.datetime.now().isoformat()
})
print(f"📊 Tracked: cosine_wave.png (Total: {len(INSIGHTS)} charts)")
```

## Real Example from Your Notebook

Here's how you might generate charts in your SYN flood detection analysis:

```python
# Example: Confusion Matrix
from sklearn.metrics import confusion_matrix
import seaborn as sns

cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")

# Save and track
save_plot_tracked("confusion_matrix.png", dpi=300, bbox_inches='tight')
plt.close()

# Example: ROC Curve
from sklearn.metrics import roc_curve, auc

fpr, tpr, _ = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'AUC = {roc_auc:.2f}')
plt.plot([0, 1], [0, 1], 'k--')
plt.title("ROC Curve")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.legend()

# Save and track
save_plot_tracked("roc_curve.png", dpi=300, bbox_inches='tight')
plt.close()

# Example: Feature Importance
feature_importance = model.feature_importances_
plt.figure(figsize=(10, 6))
plt.barh(range(len(feature_importance)), feature_importance)
plt.title("Feature Importance")
plt.xlabel("Importance")
plt.ylabel("Feature")

# Save and track
save_plot_tracked("feature_importance.png", dpi=300, bbox_inches='tight')
plt.close()
```

## Check Your Progress

At any time, you can check how many charts you've generated:

```python
print(f"Total charts generated: {len(INSIGHTS)}")
print(f"Session ID: {ATTACK_SESSION_ID}")
print("\nCharts:")
for i, insight in enumerate(INSIGHTS, 1):
    print(f"  {i}. {insight['name']} - {insight['url']}")
```

## Expected Output

As you generate charts, you'll see messages like:

```
📊 Saved and tracked: confusion_matrix.png (Total: 1 charts)
  📁 Copied to Drive: /content/drive/MyDrive/IDS_Charts/attack_20251104_101530/confusion_matrix.png

📊 Saved and tracked: roc_curve.png (Total: 2 charts)
  📁 Copied to Drive: /content/drive/MyDrive/IDS_Charts/attack_20251104_101530/roc_curve.png

📊 Saved and tracked: feature_importance.png (Total: 3 charts)
  📁 Copied to Drive: /content/drive/MyDrive/IDS_Charts/attack_20251104_101530/feature_importance.png
```

## Important Notes

1. **All charts are tracked automatically** - You don't need to manually keep track
2. **Charts are organized by session** - Each analysis run has its own folder in Drive
3. **You can generate as many charts as you want** - They'll all be collected
4. **Charts are saved locally AND to Drive** - You have backups

## Troubleshooting

**If charts aren't being tracked:**
- Make sure you ran Step 1 (Initialization) first
- Make sure you're using `save_plot_tracked()` or manually adding to `INSIGHTS`
- Check that `PLOTS_DIR` exists

**If Drive upload fails:**
- Make sure Google Drive is mounted: `drive.mount('/content/drive')`
- Check that you have write permissions in Drive

---

**Next Step:** [Step 3 - Send to Server](./STEP_3_SEND_TO_SERVER.md)

