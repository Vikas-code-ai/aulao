# 📊 Aulao Code Review & Improvement Plan

## 🚨 CRITICAL DATA ISSUES - ✅ FIXED

### Data Inconsistencies Fixed in `src/utils/classes.json`:

1. **✅ Duplicate IDs Removed** (IDs 22-29)
   - Original: 65 entries
   - After fix: 57 entries
   - Backup saved to: `classes.json.backup`

2. **✅ Invalid Start Times Fixed:**
   - ID 40: `1633346100000` → `795` (13:15)
   - ID 46: `2030` → `1230` (20:30)
   - ID 53: `1750` → `1050` (17:30)

3. **✅ Teacher Format Standardized:**
   - IDs 26, 33, 42: Changed from string to array format
   - Now all teachers use `["name"]` format

4. **⚠️ Missing Teachers:**
   - ID 57 (Companyia Jove) has empty teachers array - **Needs manual review**

---

## 🧹 CODE CLEANUP RECOMMENDATIONS

### 1. **Dead/Unused Files to Remove:**

```bash
# Unused route files
src/routes/offindex_tsx      # Looks like old version of index.tsx
src/routes/_index_tsx         # Incomplete/testing version

# Duplicate Component Files
src/components/_ClassesTable.tsx   # Underscore prefix suggests unused
src/components/_CoursesTable.tsx   # Duplicate of Table.tsx?

# Multiple ComboBox versions (consolidate!)
src/components/ComboBox.tsx    # Which one is actually used?
src/components/ComboBox1.tsx
src/components/ComboBox2.tsx
src/components/ComboBox3.tsx   # <- Currently used in routes
```

### 2. **Dead Code Hotspots** (548 commented lines total):

Most heavily commented files:
- `src/constants.tsx` - 73 commented lines
- `src/routes/index.tsx` - 65+ commented lines
- `src/components/Table.tsx` - 35+ commented lines
- `src/components/_CoursesTable.tsx` - 38+ commented lines
- `src/components/ClassesTableRows.tsx` - 45+ commented lines

**Recommendation:** Clean up or delete commented code blocks. They clutter the codebase and are available in git history.

### 3. **Unused Imports & Dependencies:**

Check and remove:
- Unused imports in component files
- `debugAll: true` and `debugTable: true` in production code
- Console.log statements throughout

---

## 🐛 POTENTIAL ERRORS & BUGS

### 1. **Type Inconsistencies:**

```typescript
// types.ts has two Class interfaces (one commented out)
// Line 18-35: Commented Class interface
// Line 37-51: Active Class interface
// ❌ PROBLEM: These differ in field names (starttime vs startTime, weekdays vs weekDays)
```

**Fix:** Remove commented interface, ensure consistent naming.

### 2. **Missing ocupacion (Room) Field Usage:**

```typescript
// Type definition has ocupacion field but it's NEVER used in components
export interface Class {
  ocupacion?: string;  // ❌ Defined but unused!
}
```

**Issue:** Your question about "classes switching classrooms" suggests you want to use this field, but it's not implemented in the UI.

### 3. **Conditional Rendering Issues:**

```tsx
// ClassesTableRows.tsx:46
<p class={"mt-4 text-s" + selected ? "" : "text-gray-500"}>
  {course.teachers}
</p>
```

**Bug:** Missing parentheses around ternary. Should be:
```tsx
<p class={"mt-4 text-s " + (selected ? "" : "text-gray-500")}>
```

### 4. **Inconsistent Data Model:**

- `Course` type uses `startTime` (camelCase)
- `Class` type uses `starttime` (lowercase)
- `Course` uses `weekDays`, `Class` uses `weekdays`

**Fix:** Standardize to one naming convention.

---

## ✨ FEATURE SUGGESTIONS

### 1. **Calendar/Grid View for Class Scheduling**

Based on your question about "classes switching rooms with segments", implement:

```tsx
// New component: src/components/ScheduleCalendar.tsx
interface ClassSegment {
  classId: string;
  day: number;           // 0-6 (Monday-Sunday)
  startTime: number;     // Minutes from midnight
  duration: number;
  room: string;          // From ocupacion field
  segmentIndex?: number; // For multi-room classes
  nextSegment?: string;  // Link to next segment
}

// Features:
- Visual grid: Time slots (rows) × Days (columns)
- Classes as colored blocks spanning multiple time slots
- Arrow indicators for classes that switch rooms
- Hover shows full class details
- Click to select/deselect classes
```

**Implementation:**
- Use CSS Grid for time-slot layout
- Calculate cell height based on duration
- Show arrows (→) for room transitions
- Truncate text for short durations, show tooltip on hover

### 2. **Multi-Room/Segment Support:**

```typescript
// Enhanced Class type:
export interface ClassSegment {
  time: number;
  duration: number;
  room: string;
  day?: number; // If segments occur on different days
}

export interface Class {
  // ... existing fields
  segments?: ClassSegment[]; // For classes with room changes
  ocupacion?: string | string[]; // Multiple rooms
}
```

### 3. **Display Improvements for Small Cells:**

For classes with duration < 75min or single room:

```tsx
// Option A: Tooltip on hover
<Tooltip content={fullClassDetails}>
  <div class="truncate text-xs">{abbreviatedTitle}</div>
</Tooltip>

// Option B: Expandable cells on click
<div
  class="cursor-pointer"
  onClick={() => setExpanded(!expanded)}
>
  {expanded ? fullDetails : abbreviatedDetails}
</div>

// Option C: Use icons + abbreviations
<div class="flex items-center gap-1">
  <LevelBadge level={level} />
  <span class="truncate text-xs">{titleAbbr}</span>
  <TeacherIcon />
</div>
```

### 4. **Room/Ocupacion Filter:**

Add room-based filtering alongside teacher and category filters:

```tsx
<ComboBox
  options={uniqueRooms}
  selected={selectedRoom}
  setSelected={setSelectedRoom}
  placeholder="Filter by room"
/>
```

### 5. **Time Range Filter:**

```tsx
<TimeRangeSlider
  min={540}  // 9:00 AM
  max={1320} // 10:00 PM
  value={timeRange}
  onChange={setTimeRange}
/>
```

### 6. **Export Functionality:**

```tsx
// Export selected classes to:
- PDF (printable schedule)
- iCal (calendar import)
- JSON (data export)
```

### 7. **Responsive Design Improvements:**

```tsx
// Mobile view: Switch from grid to list
// Tablet view: Compact grid
// Desktop view: Full calendar grid
```

---

## 🏗️ ARCHITECTURE IMPROVEMENTS

### 1. **Consolidate Duplicate Logic:**

Lots of repeated filtering logic in different components. Create:

```typescript
// src/utils/classFilters.ts
export const filterClasses = (
  classes: Class[],
  filters: {
    category?: string;
    teacher?: string;
    room?: string;
    level?: number[];
    timeRange?: [number, number];
  }
) => {
  // Centralized filtering logic
};
```

### 2. **Type Safety:**

```typescript
// Create unified types:
export type TimeInMinutes = number; // 0-1439
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ClassId = string;
```

### 3. **Separate Concerns:**

```
src/
  components/
    schedule/
      ScheduleCalendar.tsx
      ClassCell.tsx
      TimeSlot.tsx
      DayColumn.tsx
    table/
      ClassesTable.tsx
      ClassesTableRows.tsx
    filters/
      CategoryFilter.tsx
      TeacherFilter.tsx
      TimeRangeFilter.tsx
```

---

## 📝 DOCUMENTATION NEEDS

1. **README.md** - Setup instructions, architecture overview
2. **Component Documentation** - Props, usage examples
3. **Data Model Documentation** - Field descriptions, validation rules
4. **API Documentation** - Directus schema, queries

---

## 🎯 PRIORITY ACTION ITEMS

### High Priority:
1. ✅ Fix data inconsistencies (DONE)
2. 🔧 Fix type inconsistencies (Course vs Class)
3. 🗑️ Remove dead code and unused files
4. 🐛 Fix conditional rendering bug in ClassesTableRows.tsx

### Medium Priority:
5. 🎨 Implement calendar/grid view with room segments
6. 📱 Improve display for small class cells
7. 🏷️ Standardize naming conventions
8. 🧪 Add TypeScript strict mode

### Low Priority:
9. 📚 Add documentation
10. 🚀 Performance optimizations
11. ♿ Accessibility improvements
12. 🧹 Code cleanup (remove console.logs, debug flags)

---

## 🔍 SPECIFIC TO YOUR QUESTION

### About "Popping class on Monday switching classrooms":

I couldn't find a "Popping" class in your data. To implement class segments with room switching:

1. **Data Structure:**
```json
{
  "id": "popping-monday",
  "title": "Popping",
  "weekdays": [1, 5], // Monday, Friday
  "segments": [
    {
      "day": 1, // Monday
      "starttime": 1080, // 18:00
      "duration": 45,
      "room": "Room A"
    },
    {
      "day": 1, // Monday (continues)
      "starttime": 1125, // 18:45
      "duration": 30,
      "room": "Room B"
    },
    {
      "day": 5, // Friday
      "starttime": 1080,
      "duration": 75,
      "room": "Room B"
    }
  ]
}
```

2. **Visual Indicator:**
```tsx
// In calendar cell for segment 1:
<div class="class-segment">
  <div class="class-content">Popping</div>
  <div class="arrow-indicator">→ Room B</div>
</div>

// In calendar cell for segment 2:
<div class="class-segment">
  <div class="arrow-indicator">← Room A</div>
  <div class="class-content">Popping (cont.)</div>
</div>
```

3. **CSS for connecting arrows:**
```css
.class-segment {
  position: relative;
}

.class-segment.has-next::after {
  content: '→';
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
}

.class-segment.has-prev::before {
  content: '←';
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
}
```

---

**Would you like me to implement any of these improvements?** Let me know which ones are most important to you!
