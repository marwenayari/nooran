import {LessonSummary, toLessonSummary} from "~/models/LessonSummary";

export interface CourseDetails {
    id: number,
    title: string
    description: string
    progressColor: string
    lessons: LessonSummary[]
}

export function toCourseDetails(json: any): CourseDetails {
    return {
        id: json?.id,
        title: json?.title || '',
        description: json?.title || '',
        progressColor: json?.progress_color || '#f4ebe5',
        lessons: json?.lessons?.map(toLessonSummary),
    }
}