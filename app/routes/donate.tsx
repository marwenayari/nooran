import { Form } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '~/context/ProfileContext'

const DonatePage = () => {
  const { t } = useTranslation('donate')

  return (
    <div className='donate-page'>
      <h1 className='text-3xl'>{t('title')}</h1>
    </div>
  )
}

export default DonatePage
