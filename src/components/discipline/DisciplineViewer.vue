<template>
  <div class="discipline-viewer max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold mb-2">
        {{ locale === 'es' ? 'Horario de Clases' : locale === 'en' ? 'Class Schedule' : 'Horari de Classes' }}
      </h1>
      <p class="text-gray-600">
        {{ locale === 'es' ? 'Explora nuestras clases de danza y encuentra la perfecta para ti' : 'Explore our dance classes and find the perfect one for you' }}
      </p>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">
        {{ locale === 'es' ? 'Cargando clases...' : 'Loading classes...' }}
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <p class="font-semibold">{{ locale === 'es' ? 'Error al cargar las clases' : 'Error loading classes' }}</p>
      <p class="text-sm mt-1">{{ error.message }}</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Filter Bar -->
      <FilterBar
        :filters="filters"
        :root-categories="rootCategories"
        :participant-types="participantTypes"
        :age-groups="ageGroups"
        :skill-levels="skillLevels"
        :teachers="teachers"
        :locale="locale"
        @update:category="setFilter('category', $event || undefined)"
        @update:participant-type="setFilter('participantType', $event || undefined)"
        @update:teacher="setFilter('teacher', $event || undefined)"
        @update:level="setFilter('level', $event)"
        @update:age-group="setFilter('ageGroup', $event || undefined)"
        @update:weekday="setFilter('weekday', $event)"
        @clear-filters="clearAllFilters"
      />

      <!-- Stats -->
      <div class="mb-6 text-sm text-gray-600">
        {{ locale === 'es' ? 'Mostrando' : 'Showing' }}
        <span class="font-semibold">{{ filteredClasses.length }}</span>
        {{ locale === 'es' ? (filteredClasses.length === 1 ? 'clase' : 'clases') : (filteredClasses.length === 1 ? 'class' : 'classes') }}
      </div>

      <!-- Classes by Category -->
      <div v-if="filteredClasses.length > 0" class="space-y-8">
        <CategorySection
          v-for="category in visibleCategories"
          :key="category.id"
          :category="category"
          :classes="classesByCategory[category.id] || []"
          :all-categories="categories"
          :locale="locale"
          :group-by-subcategory="shouldGroupBySubcategory(category)"
          :show-path="!!filters.category"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">
          {{ locale === 'es' ? 'No se encontraron clases con los filtros seleccionados' : 'No classes found with the selected filters' }}
        </p>
        <button
          @click="clearAllFilters"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {{ locale === 'es' ? 'Limpiar filtros' : 'Clear filters' }}
        </button>
      </div>
    </div>

    <!-- Locale Switcher (for testing) -->
    <div class="fixed bottom-4 right-4 flex gap-2">
      <button
        v-for="loc in ['es', 'en', 'cat']"
        :key="loc"
        @click="setLocale(loc as LocaleType)"
        :class="[
          'px-3 py-1 rounded text-sm font-medium transition-colors',
          locale === loc
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ loc.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDisciplineData } from '@/composables/useDisciplineData'
import FilterBar from './FilterBar.vue'
import CategorySection from './CategorySection.vue'
import type { Category, LocaleType } from '@/types'

// Use the composable
const {
  categories,
  participantTypes,
  ageGroups,
  skillLevels,
  teachers,
  isLoading,
  error,
  locale,
  filters,
  rootCategories,
  filteredClasses,
  classesByCategory,
  loadData,
  setFilter,
  clearAllFilters,
  setLocale,
} = useDisciplineData()

// Load data on mount
onMounted(async () => {
  await loadData()
})

// Get visible categories (categories that have filtered classes)
const visibleCategories = computed(() => {
  const categoryIds = new Set(filteredClasses.value.map((cls) => cls.category))

  // If a specific category is selected, show that category and its children
  if (filters.value.category) {
    const selectedCategory = categories.value.find((c) => c.id === filters.value.category)

    // If selected category is a parent, show its children
    const children = categories.value.filter((c) => c.parent === filters.value.category)

    if (children.length > 0) {
      // Show children that have classes
      return children.filter((c) => categoryIds.has(c.id))
    }

    // Otherwise show the selected category itself
    if (selectedCategory) {
      return [selectedCategory]
    }
  }

  // Show all root categories that have classes
  return rootCategories.value.filter((c) => {
    // Check if this category or any of its descendants have classes
    const hasClasses = categoryIds.has(c.id)
    const childrenHaveClasses = categories.value
      .filter((cat) => cat.parent === c.id)
      .some((cat) => categoryIds.has(cat.id))

    return hasClasses || childrenHaveClasses
  })
})

// Determine if we should group by subcategory
const shouldGroupBySubcategory = (category: Category) => {
  // Group by subcategory if the category has children and no specific subcategory is selected
  const hasChildren = categories.value.some((c) => c.parent === category.id)
  return hasChildren && !filters.value.category
}
</script>

<style scoped>
.discipline-viewer {
  min-height: 100vh;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
