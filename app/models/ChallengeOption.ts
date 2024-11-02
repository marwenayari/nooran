import { translationsToString } from '~/models/Translations'

export interface ChallengeOption {
  id: number
  text: string
}

export function toChallengeOption(json: any, locale: string): ChallengeOption {
  return {
    id: json?.id,
    text: translationsToString(json?.text, locale)
  }
}
