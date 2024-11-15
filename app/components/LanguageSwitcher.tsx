import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useFetcher } from '@remix-run/react'
import { useProfile } from '~/context/ProfileContext'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const fetcher = useFetcher<{lang: string}>()
  const { profile, updateProfile } = useProfile()

  const changeLanguage = (lang: string) => {
    fetcher.submit({ lang }, { method: 'patch', action: '/api/profile' })
  }

  useEffect(() => {
    if(profile && fetcher.data && fetcher.data.lang) {
      updateProfile({
        ...profile,
        locale: fetcher.data.lang
      })
    }
  }, [fetcher.data])

  useEffect(() => {
    if (profile && profile?.locale) {
      i18n.changeLanguage(profile?.locale)
    }
  }, [profile])

  return (
    // <fetcher.Form method="put">
    <div className='flex gap-1'>
      <button className='bg-white w-12 rounded-lg' onClick={() => changeLanguage('en')}>
        🇬🇧
      </button>
      <button className='bg-white w-12 rounded-lg' onClick={() => changeLanguage('ar')}>
        🇸🇦
      </button>
    </div>
    // </fetcher.Form>
  )
}
