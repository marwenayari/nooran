import {ChallengeOption, toChallengeOption} from "~/models/ChallengeOption";

export interface Challenge {
    id: number,
    question: string,
    type: string,
    options: ChallengeOption[]
}

export function toChallenge(json: any): Challenge {
    return {
        id: json?.id,
        question: json?.question || '',
        type: json?.type || 'text',
        options: json?.challenge_options?.map(toChallengeOption)
    }
}