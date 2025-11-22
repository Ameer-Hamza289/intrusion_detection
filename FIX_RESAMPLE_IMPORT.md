# Fix: NameError: name 'resample' is not defined

## Problem
You're getting this error:
```
NameError: name 'resample' is not defined
```

## Solution

Add this import statement at the **beginning** of the cell where you use `resample`:

```python
# Import resample function for data balancing
from sklearn.utils import resample

df_majority = df[df.Label == 0]

df_minority = df[df.Label == 1]

if len(df_minority) == 0:
    print("⚠️ No attack samples found (Label == 1). Generating dummy attack data for testing.")

    # Simulate some attack rows (only for testing ML pipeline)
    df_minority = df_majority.sample(n=100, random_state=42).copy()
    df_minority['Label'] = 1  # mark as attack

# Now safe to balance
df_majority_downsampled = resample(df_majority, replace=False, n_samples=len(df_minority), random_state=42)
df_balanced = pd.concat([df_majority_downsampled, df_minority])
```

## What to Do

1. **Find the cell** that contains the `resample` code
2. **Add this line at the very top** of that cell:
   ```python
   from sklearn.utils import resample
   ```
3. **Run the cell again**

## Alternative: Add Import in a Separate Cell

If you prefer, you can also add the import in a cell before this one:

```python
from sklearn.utils import resample
```

Then your original cell will work without modification.

## Why This Happens

The `resample` function is part of `sklearn.utils` and needs to be explicitly imported. It's not imported automatically when you import sklearn.

## Complete Import List (if needed)

If you want to import all commonly used sklearn utilities at once, you can use:

```python
from sklearn.utils import resample
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
```

---

**After adding the import, your cell should run without errors!** ✅

