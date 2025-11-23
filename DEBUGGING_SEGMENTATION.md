# 🔍 Debugging Segmentation for Class 150 (Popping)

## What I Added:

### 1. **Segmentation Type Definitions**

Added to `src/types.ts`:
```typescript
export interface Segmentation {
  id: number;
  classes_id: number;
  starttime: number;
  duration: number;
  ocupacion: string;  // Room (e.g., "2", "3", "2+3")
  weekday?: number;
  sort?: number;
}

export interface Class {
  // ... existing fields
  segments?: Segmentation[]; // Room-switching segments
}
```

### 2. **Directus API Integration**

Added to `src/data/directus.ts`:
- `getSegmentation()` function to fetch segmentation table
- Debug logging for class 150 and "popping" classes
- Debug logging for segmentation data
- Automatic merging of segments with their parent classes

### 3. **Route Data Integration**

Updated `src/routes/index.tsx`:
- Now fetches segmentation data alongside classes
- Merges segments into their parent classes
- Logs which classes have segments

---

## 🚀 How to Get the Debug Info:

### **Step 1: Run your app**
```bash
npm run dev
```

### **Step 2: Open browser and check console**

You'll see output like:
```
🔍 DEBUG: Total classes: 150
✅ DEBUG: Found class 150: { id: "150", title: "Popping", ... }
✅ DEBUG: Found popping classes: [...]
🔍 DEBUG: Segmentation data fetched: 50 segments
🔍 DEBUG: Sample segmentation entries:
  Segment: { id: 1, classes_id: 150, starttime: 1080, duration: 45, ocupacion: "3", sort: 1 }
  Segment: { id: 2, classes_id: 150, starttime: 1125, duration: 30, ocupacion: "2+3", sort: 2 }
✅ Class 150 (Popping) has 2 segments: [...]
🔍 DEBUG: Classes with segments: 15
```

### **Step 3: Share the output with me**

Copy and paste the console output, especially:
1. ✅ Class 150 details
2. ✅ Segments for class 150
3. Any other classes with segments (for reference)

---

## 📊 What I Need From You:

Please share the **console output** showing:

### **For Class 150 (Popping):**
```javascript
// Example of what I expect to see:
{
  id: "150",
  title: "Popping",
  category: "urban",
  starttime: 1080,  // Start time in minutes (18:00)
  duration: 75,     // Total duration
  weekdays: [2],    // Tuesday (2 = Tuesday in your system)
  ocupacion: "3",   // Starting room
  segments: [
    {
      id: 1,
      classes_id: 150,
      starttime: 1080,  // 18:00 - First segment start
      duration: 45,     // 45 minutes in room 3
      ocupacion: "3",   // Room 3
      sort: 1
    },
    {
      id: 2,
      classes_id: 150,
      starttime: 1125,  // 18:45 - Second segment start
      duration: 30,     // 30 minutes in merged rooms
      ocupacion: "2+3", // Rooms 2+3 merged
      sort: 2
    }
  ]
}
```

---

## 🎯 What I'll Implement Based on Your Data:

### **Visual Improvements for Segmented Classes:**

1. **Segment Display:**
   ```
   ┌─────────────────────┐
   │ Popping             │
   │ 18:00-18:45         │
   │ Room 3          → │ ← Arrow showing continuation
   └─────────────────────┘

   ┌─────────────────────┐
   │ ← Popping (cont.)   │ ← Arrow showing from previous
   │ 18:45-19:15         │
   │ Rooms 2+3           │
   └─────────────────────┘
   ```

2. **Exact Timing:**
   - First segment ends exactly at 18:45
   - Second segment starts exactly at 18:45
   - No visual gap or overlap

3. **Arrow Indicators:**
   - Right arrow (→) in first segment: "continues in next room"
   - Left arrow (←) in second segment: "continued from previous room"
   - Color-coded to match the class
   - Clickable to highlight both segments

4. **Room Information:**
   - Display room changes clearly
   - Show merged rooms as "2+3" or "3+4"
   - Highlight when room changes

5. **Small Cell Improvements:**
   - For segments < 75min: Use abbreviated display
   - Tooltip shows full details on hover
   - Icon indicators for room switching

---

## 🔧 Room Merging Logic (As You Described):

- **Rooms 2 & 3:** Can be merged → "2+3"
- **Rooms 3 & 4:** Can be merged → "3+4"
- **Typical patterns:**
  1. Start in single room (e.g., "3") → Continue in merged rooms (e.g., "2+3")
  2. Start in merged rooms (e.g., "2+3") → Continue in single room (e.g., "3")
  3. Switch between different rooms entirely

---

## ⏰ Time Constraint Example:

> "Room 3 is occupied by another class at 20h (1200 minutes)"

So if a class segment is:
- Segment 1: Room 3, 18:00-18:45 (1080-1125)
- Segment 2: Rooms 2+3, 18:45-19:15 (1125-1155)

Both segments must end before 20:00 (1200 minutes) to avoid overlap with the next class.

Visual representation should show:
- Segment 1 ending exactly at 18:45 (no extension)
- Clear separation from the 20:00 class in Room 3

---

## 📝 Next Steps:

1. **Run the app** and share console output
2. **I'll analyze** the segmentation structure
3. **I'll implement** the visual improvements:
   - Segment arrows
   - Exact timing display
   - Room change indicators
   - Small cell optimizations
4. **You review** and provide feedback

---

**Ready when you are! Share the console output and I'll implement the perfect segmented class display.** 🚀
