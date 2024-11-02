import { LessonSummary, toLessonSummary } from '~/models/LessonSummary'
import { translationsToString } from '~/models/Translations'

export interface CourseDetails {
  id: number
  title: string
  description: string
  progressColor: string
  color: string
  lessons: LessonSummary[]
}

export function toCourseDetails(json: any, locale: string): CourseDetails {
  return {
    id: json?.id,
    title: translationsToString(json?.title, locale),
    description: translationsToString(json?.description, locale),
    progressColor: json?.progress_color || '#f4ebe5',
    color: json?.color || '#94a3b8',
    lessons: json?.lessons?.map(toLessonSummary, locale)
  }
}
