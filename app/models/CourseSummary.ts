import { translationsToString } from '~/models/Translations'

export interface CourseSummary {
    id: number,
    title: string,
    description: string,
    color: string,
    level: string,
    price: number
}

export function toCourseSummary(json: any, locale: string): CourseSummary {
    const levels = ['beginner','intermediate','advanced']
    return {
        id: json?.id,
        title: translationsToString(json?.title, locale),
        description: translationsToString(json?.description, locale),
        color: json?.color || '#f4ebe5',
        level: levels[json?.level - 1] || 'beginner',
        price: json?.price || 0
    }
}