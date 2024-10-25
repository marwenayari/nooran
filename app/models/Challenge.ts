import {ChallengeOption, toChallengeOption} from "~/models/ChallengeOption";

export interface Challenge {
    id: number,
    question: string,
    type: string,
    imageSource: string,
    audio: string,
    options: ChallengeOption[]
}

export function toChallenge(json: any): Challenge {
    return {
        id: json?.id,
        question: json?.question || '',
        type: json?.type || 'text',
        imageSource: json?.image_source,
        audio: json?.audio,
        options: json?.challenge_options?.map(toChallengeOption)
    }
}