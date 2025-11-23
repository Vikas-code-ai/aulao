// Locale and translation types
export type LocaleType = 'en' | 'es' | 'cat'

export interface Translations {
  es?: string
  en?: string
  cat?: string
}

// Category types (3-level hierarchy)
export interface Category {
  id: string
  name: string
  label: Translations
  parent: string | null
  color?: string
  icon?: string
  category_type?: 'discipline' | 'style' | 'subspecialty'
  sort?: number
}

// Participant types
export interface ParticipantType {
  id: string
  name: string
  label: Translations
  order: number
}

// Age groups (for kids)
export interface AgeGroup {
  id: string
  name: string
  label: Translations
  min_age: number
  max_age: number
  order: number
}

// Levels (skill levels for adults, age groups for kids)
export interface Level {
  id: number
  name: string
  label: Translations
  type: 'skill' | 'age'
  order?: number
}

// Teacher
export interface Teacher {
  id: string
  name: string
}

// Room
export interface Room {
  id: string
  name: string
  label?: Translations
}

// Class (enhanced with new structure)
export interface Class {
  id: number
  category: string // FK to categories (leaf node)
  participant_type: string // FK to participant_types (required)
  level: number | null // FK to levels (nullable, only for adults)
  age_group: string | null // FK to age_groups (nullable, only for kids)
  custom_title: string | null // Overrides auto-generation
  teacher_id: string
  room?: string
  starttime: number // Minutes since midnight
  duration: number // Duration in minutes
  weekdays: number[] // [0-6] where 0 = Monday
  startdate?: Date | string
  enddate?: Date | string
  formacion?: boolean
  ocupacion?: string
}

// Extended class with populated relationships
export interface ClassWithRelations extends Class {
  categoryData?: Category
  participantTypeData?: ParticipantType
  levelData?: Level
  ageGroupData?: AgeGroup
  teacherData?: Teacher
  roomData?: Room
}

// Filter state
export interface FilterState {
  category?: string
  participantType?: string
  level?: number
  ageGroup?: string
  teacher?: string
  weekday?: number
}

// UI helpers
export interface SelectOption {
  id: string
  label: string
  value: string
}

// Category tree node (for hierarchical display)
export interface CategoryNode extends Category {
  children: CategoryNode[]
  classes?: ClassWithRelations[]
}
