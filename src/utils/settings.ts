import { seedSettings } from '../data/seed'
import type { StoreSettings } from '../types'

export function normalizeSettings(value?: Partial<StoreSettings> | null): StoreSettings {
  return {
    ...seedSettings,
    ...value,
    categories: Array.isArray(value?.categories) && value.categories.length ? value.categories : seedSettings.categories,
    visibility: { ...seedSettings.visibility, ...value?.visibility },
    appearance: { ...seedSettings.appearance, ...value?.appearance },
    content: { ...seedSettings.content, ...value?.content },
  }
}
