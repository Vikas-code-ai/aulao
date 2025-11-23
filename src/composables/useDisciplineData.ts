import { ref, computed, watch, type Ref } from 'vue'
import type {
  Category,
  ParticipantType,
  AgeGroup,
  Level,
  Teacher,
  Room,
  Class,
  ClassWithRelations,
  FilterState,
  CategoryNode,
  LocaleType
} from '@/types'
import {
  fetchAllData,
  enrichClasses,
  type DisciplineData
} from '@/services/directus'
import {
  buildCategoryTree,
  filterClassesByCategory,
  getAllChildren
} from '@/utils/classHelpers'

export function useDisciplineData() {
  // Data state
  const categories = ref<Category[]>([])
  const participantTypes = ref<ParticipantType[]>([])
  const ageGroups = ref<AgeGroup[]>([])
  const levels = ref<Level[]>([])
  const teachers = ref<Teacher[]>([])
  const rooms = ref<Room[]>([])
  const classes = ref<Class[]>([])
  const enrichedClasses = ref<ClassWithRelations[]>([])

  // Loading state
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  // Locale
  const locale = ref<LocaleType>('es')

  // Filter state
  const filters = ref<FilterState>({})

  // Load all data
  const loadData = async () => {
    try {
      isLoading.value = true
      error.value = null

      const data = await fetchAllData()

      categories.value = data.categories
      participantTypes.value = data.participantTypes
      ageGroups.value = data.ageGroups
      levels.value = data.levels
      teachers.value = data.teachers
      rooms.value = data.rooms
      classes.value = data.classes

      // Enrich classes with related data
      enrichedClasses.value = enrichClasses(data.classes, data)
    } catch (err) {
      error.value = err as Error
      console.error('Error loading discipline data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Computed: Category tree
  const categoryTree = computed<CategoryNode[]>(() => {
    return buildCategoryTree(categories.value)
  })

  // Computed: Root categories (top-level)
  const rootCategories = computed<Category[]>(() => {
    return categories.value.filter((c) => !c.parent)
  })

  // Computed: Filtered classes
  const filteredClasses = computed<ClassWithRelations[]>(() => {
    let result = enrichedClasses.value

    // Filter by category (including subcategories)
    if (filters.value.category) {
      result = filterClassesByCategory(
        result,
        filters.value.category,
        categories.value
      )
    }

    // Filter by participant type
    if (filters.value.participantType) {
      result = result.filter(
        (cls) => cls.participant_type === filters.value.participantType
      )
    }

    // Filter by level
    if (filters.value.level !== undefined) {
      result = result.filter((cls) => cls.level === filters.value.level)
    }

    // Filter by age group
    if (filters.value.ageGroup) {
      result = result.filter((cls) => cls.age_group === filters.value.ageGroup)
    }

    // Filter by teacher
    if (filters.value.teacher) {
      result = result.filter((cls) => cls.teacher_id === filters.value.teacher)
    }

    // Filter by weekday
    if (filters.value.weekday !== undefined) {
      result = result.filter((cls) => cls.weekdays.includes(filters.value.weekday!))
    }

    return result
  })

  // Computed: Classes grouped by category
  const classesByCategory = computed<Record<string, ClassWithRelations[]>>(() => {
    const grouped: Record<string, ClassWithRelations[]> = {}

    filteredClasses.value.forEach((cls) => {
      if (!grouped[cls.category]) {
        grouped[cls.category] = []
      }
      grouped[cls.category].push(cls)
    })

    return grouped
  })

  // Computed: Active categories (categories that have classes)
  const activeCategories = computed<Category[]>(() => {
    const categoryIds = new Set(filteredClasses.value.map((cls) => cls.category))
    return categories.value.filter((cat) => categoryIds.has(cat.id))
  })

  // Computed: Skill levels (type='skill')
  const skillLevels = computed<Level[]>(() => {
    return levels.value.filter((l) => l.type === 'skill')
  })

  // Computed: Age levels (type='age')
  const ageLevels = computed<Level[]>(() => {
    return levels.value.filter((l) => l.type === 'age')
  })

  // Methods
  const setFilter = (key: keyof FilterState, value: any) => {
    filters.value = { ...filters.value, [key]: value }
  }

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters.value }
    delete newFilters[key]
    filters.value = newFilters
  }

  const clearAllFilters = () => {
    filters.value = {}
  }

  const setLocale = (newLocale: LocaleType) => {
    locale.value = newLocale
  }

  return {
    // State
    categories,
    participantTypes,
    ageGroups,
    levels,
    teachers,
    rooms,
    classes,
    enrichedClasses,
    isLoading,
    error,
    locale,
    filters,

    // Computed
    categoryTree,
    rootCategories,
    filteredClasses,
    classesByCategory,
    activeCategories,
    skillLevels,
    ageLevels,

    // Methods
    loadData,
    setFilter,
    clearFilter,
    clearAllFilters,
    setLocale,
  }
}
