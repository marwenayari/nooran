import { translationsToString } from '~/models/Translations'

export interface UserCourse{
  id: number,
  title: string,
  progress: number,
  progressColor: string
  color: string
}

export function toUserCourse(json: any, locale: string): UserCourse {
  return {
    id: json?.id,
    title: translationsToString(json?.title, locale),
    color: json?.color || '#94a3b8',
    progress: json?.progress || 0,
    progressColor: json?.progress_color || '#f4ebe5'
  }
}