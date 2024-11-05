export interface Profile {
  id: number
  locale: string
  userId: string
  email: string
  avatarUrl: string
  displayName: string
  bio: string
  age: number,
  plan: string
}

export function toProfile(json: any) {
  return {
    id: json?.id,
    locale: json?.locale || 'en',
    userId: json?.user_id || '',
    email: json?.email || '',
    avatarUrl: json?.avatar_url || '/profile/default.jpg',
    displayName: json?.display_name || '',
    bio: json?.bio || '',
    age: json?.locale || 0,
    plan: json?.plans?.key || 'basic'
  }
}
