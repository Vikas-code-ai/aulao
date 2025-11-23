<template>
  <div class="class-card rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <!-- Class Title -->
    <h4 class="text-lg font-semibold mb-2">
      {{ classTitle }}
    </h4>

    <!-- Class Details -->
    <div class="space-y-2 text-sm">
      <!-- Teacher -->
      <div v-if="classData.teacherData" class="flex items-center gap-2">
        <span class="text-gray-500">👤</span>
        <span>{{ classData.teacherData.name }}</span>
      </div>

      <!-- Schedule -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">📅</span>
        <span>{{ weekdaysText }}</span>
      </div>

      <!-- Time -->
      <div class="flex items-center gap-2">
        <span class="text-gray-500">🕐</span>
        <span>{{ timeRange }}</span>
        <span class="text-gray-400">({{ durationText }})</span>
      </div>

      <!-- Room -->
      <div v-if="classData.roomData" class="flex items-center gap-2">
        <span class="text-gray-500">📍</span>
        <span>{{ classData.roomData.name }}</span>
      </div>

      <!-- Participant Type & Level/Age -->
      <div class="flex flex-wrap gap-2 mt-3">
        <!-- Participant Type Badge -->
        <span
          v-if="classData.participantTypeData && classData.participant_type !== 'all'"
          class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
        >
          {{ getLocalizedLabel(classData.participantTypeData.label) }}
        </span>

        <!-- Level Badge (for adults) -->
        <span
          v-if="classData.levelData && classData.levelData.type === 'skill'"
          class="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
        >
          {{ getLocalizedLabel(classData.levelData.label) }}
        </span>

        <!-- Age Group Badge (for kids) -->
        <span
          v-if="classData.ageGroupData"
          class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
        >
          {{ getLocalizedLabel(classData.ageGroupData.label) }}
        </span>

        <!-- Formation Badge -->
        <span
          v-if="classData.formacion"
          class="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs"
        >
          Formación
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ClassWithRelations, LocaleType, Translations } from '@/types'
import { generateClassTitle } from '@/utils/classHelpers'
import { formatWeekdays, getTimeRange, formatDuration } from '@/utils/timeHelpers'
import { getLocalizedValue } from '@/services/directus'

interface Props {
  classData: ClassWithRelations
  locale?: LocaleType
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'es'
})

// Generate class title
const classTitle = computed(() => {
  return generateClassTitle(props.classData, props.locale)
})

// Format weekdays
const weekdaysText = computed(() => {
  return formatWeekdays(props.classData.weekdays, props.locale)
})

// Format time range
const timeRange = computed(() => {
  return getTimeRange(props.classData.starttime, props.classData.duration)
})

// Format duration
const durationText = computed(() => {
  return formatDuration(props.classData.duration)
})

// Helper to get localized label
const getLocalizedLabel = (label: Translations) => {
  return getLocalizedValue(label, props.locale)
}
</script>

<style scoped>
.class-card {
  background: white;
}

.class-card:hover {
  border-color: #cbd5e0;
}
</style>
