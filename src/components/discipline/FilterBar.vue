<template>
  <div class="filter-bar bg-white rounded-lg shadow p-4 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Category Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Disciplina' : locale === 'en' ? 'Discipline' : 'Disciplina' }}
        </label>
        <select
          :value="filters.category"
          @change="emit('update:category', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todas las disciplinas' : 'All disciplines' }}
          </option>
          <option
            v-for="category in rootCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ getLocalizedLabel(category.label, category.name) }}
          </option>
        </select>
      </div>

      <!-- Participant Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Tipo de participante' : 'Participant type' }}
        </label>
        <select
          :value="filters.participantType"
          @change="emit('update:participantType', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todos' : 'All' }}
          </option>
          <option
            v-for="type in participantTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ getLocalizedLabel(type.label) }}
          </option>
        </select>
      </div>

      <!-- Teacher Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Profesor/a' : 'Teacher' }}
        </label>
        <select
          :value="filters.teacher"
          @change="emit('update:teacher', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todos los profesores' : 'All teachers' }}
          </option>
          <option
            v-for="teacher in teachers"
            :key="teacher.id"
            :value="teacher.id"
          >
            {{ teacher.name }}
          </option>
        </select>
      </div>

      <!-- Level Filter (for adults) -->
      <div v-if="!filters.participantType || filters.participantType === 'adults'">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Nivel' : 'Level' }}
        </label>
        <select
          :value="filters.level"
          @change="emit('update:level', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todos los niveles' : 'All levels' }}
          </option>
          <option
            v-for="level in skillLevels"
            :key="level.id"
            :value="level.id"
          >
            {{ getLocalizedLabel(level.label) }}
          </option>
        </select>
      </div>

      <!-- Age Group Filter (for kids) -->
      <div v-if="filters.participantType === 'kids'">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Edad' : 'Age' }}
        </label>
        <select
          :value="filters.ageGroup"
          @change="emit('update:ageGroup', ($event.target as HTMLSelectElement).value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todas las edades' : 'All ages' }}
          </option>
          <option
            v-for="ageGroup in ageGroups"
            :key="ageGroup.id"
            :value="ageGroup.id"
          >
            {{ getLocalizedLabel(ageGroup.label) }}
          </option>
        </select>
      </div>

      <!-- Weekday Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ locale === 'es' ? 'Día de la semana' : 'Weekday' }}
        </label>
        <select
          :value="filters.weekday"
          @change="emit('update:weekday', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            {{ locale === 'es' ? 'Todos los días' : 'All days' }}
          </option>
          <option
            v-for="(day, index) in weekdays"
            :key="index"
            :value="index"
          >
            {{ day }}
          </option>
        </select>
      </div>
    </div>

    <!-- Clear Filters Button -->
    <div v-if="hasActiveFilters" class="mt-4">
      <button
        @click="emit('clearFilters')"
        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
      >
        {{ locale === 'es' ? 'Limpiar filtros' : 'Clear filters' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  Category,
  ParticipantType,
  AgeGroup,
  Level,
  Teacher,
  FilterState,
  LocaleType,
  Translations
} from '@/types'
import { getLocalizedValue } from '@/services/directus'
import { getWeekdayName } from '@/utils/timeHelpers'

interface Props {
  filters: FilterState
  rootCategories: Category[]
  participantTypes: ParticipantType[]
  ageGroups: AgeGroup[]
  skillLevels: Level[]
  teachers: Teacher[]
  locale?: LocaleType
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'es'
})

const emit = defineEmits<{
  'update:category': [value: string]
  'update:participantType': [value: string]
  'update:teacher': [value: string]
  'update:level': [value: number | undefined]
  'update:ageGroup': [value: string]
  'update:weekday': [value: number | undefined]
  'clearFilters': []
}>()

// Weekdays list
const weekdays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => getWeekdayName(i, props.locale, false))
})

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return Object.keys(props.filters).length > 0
})

// Helper to get localized label
const getLocalizedLabel = (label: Translations, fallback?: string) => {
  return getLocalizedValue(label, props.locale, fallback)
}
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;
}
</style>
