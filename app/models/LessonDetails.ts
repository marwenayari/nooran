import {Challenge, toChallenge} from "~/models/Challenge";

export interface LessonDetails {
    id: number,
    title: string,
    course: {
        id: string,
        title: string,
    }
    challenges: Challenge[]
}

export function toLessonDetails(json: any): LessonDetails {
    return {
        id: json?.id,
        title: json?.title || '',
        course: {
            id: json?.courses?.id!,
            title: json?.courses?.title || '',
        },
        challenges: json?.challenges?.map(toChallenge),
    }
}