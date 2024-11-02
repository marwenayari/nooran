import { ChallengeOption, toChallengeOption } from '~/models/ChallengeOption'
import { translationsToString } from '~/models/Translations'

export interface Challenge {
  id: number
  question: string
  type: string
  imageSource: string
  audio: string
  options: ChallengeOption[]
  order: number
  completed: boolean
}

export function toChallenge(json: any, locale: string): Challenge {
  return {
    id: json?.id,
    question: translationsToString(json?.question, locale),
    type: json?.type || 'text',
    imageSource: json?.image_source,
    audio: json?.audio,
    options: json?.challenge_options?.map((data: any) => toChallengeOption(data, locale)),
    order: json?.order,
    completed: false
  }
}
