import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '~/context/ProfileContext'

const PatronPage = () => {
  const { t } = useTranslation('patron')

  return (
    <div className='patron-page'>
      <h1 className='text-3xl mb-4'>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}

export default PatronPage
