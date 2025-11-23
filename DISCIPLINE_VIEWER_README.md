# Aulao Discipline Viewer - Vue 3 + TypeScript

A modern, completely rebuilt discipline viewer application for dance classes, built with Vue 3, TypeScript, and Tailwind CSS. This application displays dance classes organized by discipline, with advanced filtering capabilities.

## 🎯 Features

- **Hierarchical Category System**: 3-level category hierarchy (e.g., Tap → Variations → History)
- **Advanced Filtering**: Filter by discipline, participant type, teacher, level, age group, and weekday
- **Multi-dimensional Classes**: Support for participant types (kids, adults, youth company), skill levels, and age groups
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Multi-language Support**: Spanish (es), English (en), and Catalan (cat)
- **Type-Safe**: Full TypeScript coverage for better developer experience
- **Modern Stack**: Vue 3 Composition API with Vite for fast development

## 📊 New Database Structure

The application adapts to the new Directus database schema:

### Tables

- **categories**: 3-level hierarchy for disciplines/styles/subspecialties
  - Fields: `id`, `name`, `label`, `parent`, `color`, `icon`, `category_type`, `sort`

- **participant_types**: Types of participants (kids, adults, youth_company, all)
  - Fields: `id`, `name`, `label`, `order`

- **age_groups**: Age ranges for kids classes
  - Fields: `id`, `name`, `label`, `min_age`, `max_age`, `order`

- **levels**: Skill levels (for adults) or age levels (for kids)
  - Fields: `id`, `name`, `label`, `type` ('skill' | 'age'), `order`

- **classes**: Enhanced class information
  - Fields: `id`, `category`, `participant_type`, `level`, `age_group`, `custom_title`, `teacher_id`, `room`, `starttime`, `duration`, `weekdays`, etc.

### Example Data Structure

```javascript
// Category hierarchy
{id: "tap", name: "Tap", parent: null}
{id: "tap_variations", name: "Variations", parent: "tap"}
{id: "tap_history", name: "History", parent: "tap_variations"}

// Class example
{
  category: "tap_history",           // Leaf node
  participant_type: "adults",        // Required
  level: 3,                          // Advanced (for adults)
  age_group: null,                   // Only for kids
  custom_title: null,                // Auto-generated if null
  teacher_id: "teacher_123",
  starttime: 1080,                   // 18:00 (minutes since midnight)
  duration: 90,                      // 1h 30min
  weekdays: [0, 2]                   // Monday and Wednesday
}
```

## 🚀 Getting Started

### Prerequisites

- **Bun** 1.0 or higher (recommended) or Node.js 18+
- Access to Directus CMS instance

### Installation

1. Install dependencies:
```bash
bun install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your Directus URL:
```
VITE_DIRECTUS_URL=https://your-directus-instance.com
```

3. Start the development server:
```bash
bun run dev
```

The app will be available at `http://localhost:3034`

### Build for Production

```bash
bun run build
```

The built files will be in the `dist/` directory.

### Type Checking

```bash
bun run type-check
```

### Preview Production Build

```bash
bun run preview
```

## 📁 Project Structure

```
src/
├── components/
│   └── discipline/
│       ├── ClassCard.vue           # Individual class display
│       ├── FilterBar.vue           # Filter controls
│       ├── CategorySection.vue     # Category with classes
│       └── DisciplineViewer.vue    # Main viewer component
├── composables/
│   └── useDisciplineData.ts        # Data fetching & state management
├── services/
│   └── directus.ts                 # Directus API client
├── types/
│   └── index.ts                    # TypeScript type definitions
├── utils/
│   ├── classHelpers.ts             # Class title generation, category helpers
│   └── timeHelpers.ts              # Time formatting utilities
├── App.vue                         # Root component
├── main.ts                         # Application entry point
├── style.css                       # Global styles (Tailwind)
└── env.d.ts                        # TypeScript declarations
```

## 🎨 Key Components

### DisciplineViewer
The main component that orchestrates the entire viewer:
- Loads data from Directus
- Manages filter state
- Displays categories and classes
- Handles loading and error states

### FilterBar
Advanced filtering controls:
- Category (discipline) selector
- Participant type filter
- Teacher filter
- Level filter (for adults)
- Age group filter (for kids)
- Weekday filter
- Clear all filters button

### CategorySection
Displays a category with its classes:
- Category header with color indicator
- Optional category path (breadcrumb)
- Grid layout of classes
- Optional subcategory grouping

### ClassCard
Individual class display with:
- Auto-generated or custom title
- Teacher name
- Schedule (weekdays and time)
- Duration
- Room
- Badges for participant type, level, and age group

## 🔧 Utilities

### Class Title Generation
Classes can have custom titles or auto-generated titles based on:
- Category hierarchy (e.g., "Tap Variations - History")
- Participant type (e.g., "Niños")
- Level (e.g., "Intermedio") or age group (e.g., "7-9 años")

### Category Helpers
- `buildCategoryTree()`: Convert flat categories to hierarchical tree
- `getCategoryPath()`: Get full category path (e.g., "Tap → Variations → History")
- `filterClassesByCategory()`: Filter classes including subcategories
- `getLeafCategories()`: Get categories with no children

### Time Helpers
- `minutesToTime()`: Convert minutes since midnight to HH:MM
- `formatDuration()`: Format duration (e.g., "1h 30min")
- `formatWeekdays()`: Format weekday array (e.g., "Lun, Mié, Vie")
- `getTimeRange()`: Get time range string (e.g., "18:00 - 19:30")

## 🌐 Internationalization

The application supports three languages:
- **Spanish (es)**: Default language
- **English (en)**
- **Catalan (cat)**

All labels, category names, and UI text are stored in Directus with translations.

Use the locale switcher (bottom-right corner) to change languages during development.

## 📦 Dependencies

### Runtime
- **vue**: ^3.4.0 - Progressive JavaScript framework
- **@directus/sdk**: ^12.0.1 - Directus API client

### Development
- **@vitejs/plugin-vue**: ^5.0.0 - Vue 3 plugin for Vite
- **vite**: ^5.0.0 - Fast build tool and dev server
- **typescript**: ^5.3.0 - TypeScript compiler
- **vue-tsc**: ^1.8.0 - TypeScript checker for Vue
- **tailwindcss**: ^3.3.3 - Utility-first CSS framework
- **autoprefixer**: ^10.4.16 - PostCSS plugin for vendor prefixes
- **postcss**: ^8.4.31 - CSS transformations

## 🔍 Type Safety

The application is fully type-safe with TypeScript interfaces for:
- Categories, participant types, age groups, levels
- Classes and enriched classes (with populated relations)
- Filter state
- Directus API responses
- Component props and emits

## 🎯 Migration from Old App

This is a **complete rebuild** from the old SolidJS-based viewer. Key changes:

### Technology Stack
- ❌ SolidJS → ✅ Vue 3
- ❌ Solid Start → ✅ Vite
- ❌ Solid Table → ✅ Custom grid layout
- ✅ Directus SDK (same)
- ✅ Tailwind CSS (same)

### Database Schema
- ❌ Simple 2-level categories → ✅ 3-level hierarchy
- ❌ No participant types → ✅ participant_types table
- ❌ Simple levels → ✅ Levels with type (skill/age) + age_groups table
- ❌ Classes with just category → ✅ Multi-dimensional classes

### Features
- ✅ Hierarchical category navigation
- ✅ Advanced multi-dimensional filtering
- ✅ Auto-generated class titles
- ✅ Better type safety
- ✅ Modern component architecture

## 📝 License

This project is part of the Aulao dance school management system.

---

Built with ❤️ using Vue 3, TypeScript, and Vite
