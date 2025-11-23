import type {
  ClassWithRelations,
  Category,
  CategoryNode,
  LocaleType,
  Translations
} from '@/types'
import { getLocalizedValue } from '@/services/directus'

/**
 * Generate a class title based on its attributes
 * Priority: custom_title > auto-generated title
 */
export const generateClassTitle = (
  cls: ClassWithRelations,
  locale: LocaleType = 'es'
): string => {
  // Use custom title if provided
  if (cls.custom_title) {
    return cls.custom_title
  }

  // Auto-generate title from category hierarchy
  const parts: string[] = []

  // Add category label
  if (cls.categoryData) {
    const categoryLabel = getLocalizedValue(cls.categoryData.label, locale, cls.categoryData.name)
    parts.push(categoryLabel)
  }

  // Add participant type if not "all"
  if (cls.participantTypeData && cls.participantTypeData.id !== 'all') {
    const ptLabel = getLocalizedValue(cls.participantTypeData.label, locale)
    if (ptLabel) {
      parts.push(`(${ptLabel})`)
    }
  }

  // Add level for adults or age group for kids
  if (cls.levelData && cls.levelData.type === 'skill') {
    const levelLabel = getLocalizedValue(cls.levelData.label, locale)
    if (levelLabel) {
      parts.push(`- ${levelLabel}`)
    }
  } else if (cls.ageGroupData) {
    const ageLabel = getLocalizedValue(cls.ageGroupData.label, locale)
    if (ageLabel) {
      parts.push(`- ${ageLabel}`)
    }
  }

  return parts.join(' ')
}

/**
 * Get full category path (e.g., "Tap > Variations > History")
 */
export const getCategoryPath = (
  categoryId: string,
  categories: Category[],
  locale: LocaleType = 'es'
): string => {
  const path: string[] = []
  let currentId: string | null = categoryId

  while (currentId) {
    const category = categories.find((c) => c.id === currentId)
    if (!category) break

    const label = getLocalizedValue(category.label, locale, category.name)
    path.unshift(label)
    currentId = category.parent
  }

  return path.join(' → ')
}

/**
 * Build category tree from flat list
 */
export const buildCategoryTree = (categories: Category[]): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>()

  // Create nodes
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, children: [] })
  })

  // Build tree
  const roots: CategoryNode[] = []

  categories.forEach((cat) => {
    const node = categoryMap.get(cat.id)!

    if (cat.parent) {
      const parent = categoryMap.get(cat.parent)
      if (parent) {
        parent.children.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}

/**
 * Get all leaf categories (categories with no children)
 */
export const getLeafCategories = (categories: Category[]): Category[] => {
  const parentIds = new Set(categories.filter((c) => c.parent).map((c) => c.parent))
  return categories.filter((c) => !parentIds.has(c.id))
}

/**
 * Get parent category
 */
export const getParentCategory = (
  categoryId: string,
  categories: Category[]
): Category | undefined => {
  const category = categories.find((c) => c.id === categoryId)
  if (!category || !category.parent) return undefined
  return categories.find((c) => c.id === category.parent)
}

/**
 * Get root category for a given category
 */
export const getRootCategory = (
  categoryId: string,
  categories: Category[]
): Category | undefined => {
  let current = categories.find((c) => c.id === categoryId)

  while (current && current.parent) {
    const parent = categories.find((c) => c.id === current!.parent)
    if (!parent) break
    current = parent
  }

  return current
}

/**
 * Check if a category is a leaf (has no children)
 */
export const isLeafCategory = (categoryId: string, categories: Category[]): boolean => {
  return !categories.some((c) => c.parent === categoryId)
}

/**
 * Get all children of a category (recursive)
 */
export const getAllChildren = (categoryId: string, categories: Category[]): Category[] => {
  const children = categories.filter((c) => c.parent === categoryId)
  const allChildren = [...children]

  children.forEach((child) => {
    allChildren.push(...getAllChildren(child.id, categories))
  })

  return allChildren
}

/**
 * Filter classes by category (including subcategories)
 */
export const filterClassesByCategory = (
  classes: ClassWithRelations[],
  categoryId: string,
  categories: Category[]
): ClassWithRelations[] => {
  const childrenIds = getAllChildren(categoryId, categories).map((c) => c.id)
  const validCategoryIds = [categoryId, ...childrenIds]

  return classes.filter((cls) => validCategoryIds.includes(cls.category))
}
