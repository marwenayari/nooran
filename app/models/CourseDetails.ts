import { LessonSummary, toLessonSummary } from '~/models/LessonSummary'

export interface CourseDetails {
  id: number
  title: string
  description: string
  progressColor: string
  color: string
  lessons: LessonSummary[]
}

export function toCourseDetails(json: any): CourseDetails {
  return {
    id: json?.id,
    title: json?.title || '',
    description: json?.description || '',
    progressColor: json?.progress_color || '#f4ebe5',
    color: json?.color || '#94a3b8',
    lessons: json?.lessons?.map(toLessonSummary)
  }
}
