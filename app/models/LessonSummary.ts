export interface LessonSummary {
    id: number,
    title: string
}

export function toLessonSummary(json: any): LessonSummary {
    return {
        id: json?.id,
        title: json?.title || ''
    }
}