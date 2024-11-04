import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { Profile } from '~/models/Profile'
type ProfileContextType = {
  profile: Profile | null
  updateProfile: (profile: Profile | null) => void
}
const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType)
export const useProfile = () => useContext(ProfileContext)

type ProfileProviderProps = {
  children: ReactNode
  userProfile: Profile | null
}
export const ProfileProvider = ({ children, userProfile }: ProfileProviderProps) => {
  const [profile, setProfile] = useState<Profile | null>(userProfile)
  const updateProfile = (profile: Profile | null) => {
    setProfile(profile)
  }
  const contextValue = useMemo(
    () => ({ profile, updateProfile }),
    [profile] // re-memoize only when `profile` changes
  )
  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
}
