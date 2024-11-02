import { translationsToString } from '~/models/Translations'

export interface LessonSummary {
  id: number
  title: string
}

export function toLessonSummary(json: any, locale:string): LessonSummary {
  return {
    id: json?.id,
    title: translationsToString(json?.title, locale)
  }
}
