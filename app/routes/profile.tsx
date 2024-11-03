import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '~/context/ProfileContext'


const ProfilePage = () => {
  const { t } = useTranslation('profile')
  const { profile } = useProfile()
  const name = profile?.displayName || ''

  return (
    <div className='profile-settings'>
      <h1 className='text-3xl'>{t('title')}</h1>
      <Form method='post'>
        <div className='form-group'>
          <label htmlFor='username'>{t('username')}: </label>
          <input className='p-2' type='text' id='username' name='username' defaultValue={name} />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>{t('email')}: </label>
          <input className='p-2' type='email' id='email' name='email' defaultValue={name} />
        </div>
        <button type='submit'>{t('common:save')}</button>
      </Form>
    </div>
  )
}

export default ProfilePage
