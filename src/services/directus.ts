import { createDirectus, rest, readItems } from '@directus/sdk'
import type {
  Category,
  ParticipantType,
  AgeGroup,
  Level,
  Teacher,
  Room,
  Class,
  ClassWithRelations,
  LocaleType,
  Translations
} from '@/types'

// Directus schema interface
interface DirectusSchema {
  categories: Category[]
  participant_types: ParticipantType[]
  age_groups: AgeGroup[]
  levels: Level[]
  teachers: Teacher[]
  rooms: Room[]
  classes: Class[]
}

// Directus base URL - can be configured via environment variable
const DIRECTUS_BASE_URL = import.meta.env.VITE_DIRECTUS_URL || 'https://dir.kivia.de'

// Create Directus client
export const directusClient = createDirectus<DirectusSchema>(DIRECTUS_BASE_URL).with(rest())

// Helper function to get localized value
export const getLocalizedValue = (
  translations: Translations,
  locale: LocaleType,
  fallback?: string
): string => {
  return translations[locale] || translations['es'] || fallback || ''
}

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categories = await directusClient.request(
      readItems('categories', {
        fields: ['*'],
        sort: ['sort'],
      })
    )
    return categories as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Fetch all participant types
export const fetchParticipantTypes = async (): Promise<ParticipantType[]> => {
  try {
    const types = await directusClient.request(
      readItems('participant_types', {
        fields: ['*'],
        sort: ['order'],
      })
    )
    return types as ParticipantType[]
  } catch (error) {
    console.error('Error fetching participant types:', error)
    return []
  }
}

// Fetch all age groups
export const fetchAgeGroups = async (): Promise<AgeGroup[]> => {
  try {
    const ageGroups = await directusClient.request(
      readItems('age_groups', {
        fields: ['*'],
        sort: ['order'],
      })
    )
    return ageGroups as AgeGroup[]
  } catch (error) {
    console.error('Error fetching age groups:', error)
    return []
  }
}

// Fetch all levels
export const fetchLevels = async (): Promise<Level[]> => {
  try {
    const levels = await directusClient.request(
      readItems('levels', {
        fields: ['*'],
        sort: ['order'],
      })
    )
    return levels as Level[]
  } catch (error) {
    console.error('Error fetching levels:', error)
    return []
  }
}

// Fetch all teachers
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const teachers = await directusClient.request(
      readItems('teachers', {
        fields: ['*'],
      })
    )
    return teachers as Teacher[]
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return []
  }
}

// Fetch all rooms
export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const rooms = await directusClient.request(
      readItems('rooms', {
        fields: ['*'],
      })
    )
    return rooms as Room[]
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

// Fetch all classes
export const fetchClasses = async (): Promise<Class[]> => {
  try {
    const classes = await directusClient.request(
      readItems('classes', {
        fields: ['*'],
      })
    )
    return classes as Class[]
  } catch (error) {
    console.error('Error fetching classes:', error)
    return []
  }
}

// Fetch all data at once
export interface DisciplineData {
  categories: Category[]
  participantTypes: ParticipantType[]
  ageGroups: AgeGroup[]
  levels: Level[]
  teachers: Teacher[]
  rooms: Room[]
  classes: Class[]
}

export const fetchAllData = async (): Promise<DisciplineData> => {
  const [categories, participantTypes, ageGroups, levels, teachers, rooms, classes] =
    await Promise.all([
      fetchCategories(),
      fetchParticipantTypes(),
      fetchAgeGroups(),
      fetchLevels(),
      fetchTeachers(),
      fetchRooms(),
      fetchClasses(),
    ])

  return {
    categories,
    participantTypes,
    ageGroups,
    levels,
    teachers,
    rooms,
    classes,
  }
}

// Enrich classes with related data
export const enrichClasses = (
  classes: Class[],
  data: DisciplineData
): ClassWithRelations[] => {
  return classes.map((cls) => ({
    ...cls,
    categoryData: data.categories.find((c) => c.id === cls.category),
    participantTypeData: data.participantTypes.find((pt) => pt.id === cls.participant_type),
    levelData: cls.level ? data.levels.find((l) => l.id === cls.level) : undefined,
    ageGroupData: cls.age_group ? data.ageGroups.find((ag) => ag.id === cls.age_group) : undefined,
    teacherData: data.teachers.find((t) => t.id === cls.teacher_id),
    roomData: cls.room ? data.rooms.find((r) => r.id === cls.room) : undefined,
  }))
}
