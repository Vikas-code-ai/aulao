<template>
  <div v-if="classes.length > 0" class="category-section mb-8">
    <!-- Category Header -->
    <div class="category-header mb-4">
      <h2 class="text-2xl font-bold flex items-center gap-3">
        <!-- Color indicator -->
        <span
          v-if="category.color"
          class="w-4 h-4 rounded-full"
          :style="{ backgroundColor: category.color }"
        ></span>

        <!-- Category label -->
        <span>{{ categoryLabel }}</span>

        <!-- Class count -->
        <span class="text-sm font-normal text-gray-500">
          ({{ classes.length }})
        </span>
      </h2>

      <!-- Category path (if subcategory) -->
      <p v-if="categoryPath && showPath" class="text-sm text-gray-500 mt-1">
        {{ categoryPath }}
      </p>
    </div>

    <!-- Subcategories (if grouped) -->
    <div v-if="groupBySubcategory" class="space-y-6">
      <div
        v-for="(subClasses, subCategoryId) in classesBySubcategory"
        :key="subCategoryId"
      >
        <h3 class="text-lg font-semibold mb-3 text-gray-700 px-4">
          {{ getSubcategoryLabel(subCategoryId) }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClassCard
            v-for="cls in subClasses"
            :key="cls.id"
            :class-data="cls"
            :locale="locale"
          />
        </div>
      </div>
    </div>

    <!-- Flat class list -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ClassCard
        v-for="cls in classes"
        :key="cls.id"
        :class-data="cls"
        :locale="locale"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category, ClassWithRelations, LocaleType } from '@/types'
import ClassCard from './ClassCard.vue'
import { getCategoryPath } from '@/utils/classHelpers'
import { getLocalizedValue } from '@/services/directus'

interface Props {
  category: Category
  classes: ClassWithRelations[]
  allCategories: Category[]
  locale?: LocaleType
  groupBySubcategory?: boolean
  showPath?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'es',
  groupBySubcategory: false,
  showPath: false
})

// Get category label
const categoryLabel = computed(() => {
  return getLocalizedValue(props.category.label, props.locale, props.category.name)
})

// Get category path
const categoryPath = computed(() => {
  if (!props.category.parent) return null
  return getCategoryPath(props.category.id, props.allCategories, props.locale)
})

// Group classes by subcategory
const classesBySubcategory = computed(() => {
  if (!props.groupBySubcategory) return {}

  const grouped: Record<string, ClassWithRelations[]> = {}

  props.classes.forEach((cls) => {
    const categoryId = cls.category

    if (!grouped[categoryId]) {
      grouped[categoryId] = []
    }

    grouped[categoryId].push(cls)
  })

  return grouped
})

// Get subcategory label
const getSubcategoryLabel = (categoryId: string) => {
  const category = props.allCategories.find((c) => c.id === categoryId)
  if (!category) return categoryId

  return getLocalizedValue(category.label, props.locale, category.name)
}
</script>

<style scoped>
.category-section {
  scroll-margin-top: 2rem;
}
</style>
