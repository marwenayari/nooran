import { translationsToString } from '~/models/Translations'

export interface Feature {
  title: string,
  active: boolean
}
export interface Plan {
  id: number
  key: string
  title: string
  icon: string
  features: Feature[]
  price: number
}

export function toFeature(json: any, locale: string): Feature {
  return {
    title: translationsToString(json.title, locale),
    active: json?.active || false
  }
}

export function toPlan(json: any, locale: string): Plan {
  return {
    id: json?.id || 0,
    key: json?.icon || 'basic',
    icon: json?.icon || '',
    title: translationsToString(json.title, locale),
    features: json?.features['features'].map((feature: any) => toFeature(feature, locale)) || [],
    price: json?.price || 0
  }
}