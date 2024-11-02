export interface ChallengeOption {
  id: number
  text: string
}

export function toChallengeOption(json: any): ChallengeOption {
  return {
    id: json?.id,
    text: json?.text || ''
  }
}
