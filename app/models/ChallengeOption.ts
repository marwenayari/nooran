export interface ChallengeOption {
    id: number,
    text: string,
    correct: boolean
}

export function toChallengeOption(json: any): ChallengeOption {
    return {
        id: json?.id,
        text: json?.text || '',
        correct: json?.correct || false
    }
}