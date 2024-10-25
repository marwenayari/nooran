export interface CourseSummary {
    id: number,
    title: string,
    description: string,
    color: string,
    level: string,
    price: number
}

export function toCourseSummary(json: any): CourseSummary {
    const levels = ['beginner','intermediate','advanced']
    return {
        id: json?.id,
        title: json?.title || '',
        description: json?.description || '',
        color: json?.color || '#f4ebe5',
        level: levels[json?.level - 1] || 'beginner',
        price: json?.price || 0
    }
}