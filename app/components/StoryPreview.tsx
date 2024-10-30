import { Link, NavLink, useSearchParams } from '@remix-run/react'
import { Story } from '~/types'
import { getStoryCover } from '~/utils/colors'
import { useTranslation } from 'react-i18next'
import { useProfile } from '~/context/ProfileContext'

interface StoryPreviewProps {
  story: Story
}

const StoryPreview = ({ story }: StoryPreviewProps) => {
  const { t } = useTranslation('stories')
  const { profile } = useProfile()
  const isRTL = profile?.locale === 'ar'
  const [searchParams] = useSearchParams()
  const selected = parseInt(searchParams.get('selected') || '-1')
  const type = parseInt(searchParams.get('type') || '-1')
  localStorage.setItem('story', JSON.stringify(story))
  localStorage.setItem('selectedStory', JSON.stringify({ type: type, key: selected }))

  return (
    <section className='w-2/5 fixed ltr:right-0 rtl:left-0 top-0 bg-white h-full p-16'>
      <div className='flex gap-4'>
        <div
          className={`cover ltr:ml-[-7rem]  rtl:mr-[-7rem] cursor-pointer rounded-md shadow-xl min-w-28 h-40 w-28 ${getStoryCover(
            selected
          )} text-center p-2 text-white`}
          style={{ viewTransitionName: 'cover-transition' + story.id }}
        >
          <div style={{ viewTransitionName: 'read-transition' }}></div>
          <div>
            <h2>{story.title}</h2>
          </div>
        </div>
        <div className='h-40 flex flex-col justify-between'>
          <h2 className='text-3xl text-slate-800'>{story.title}</h2>
          <p className='text-slate-800 '>{story.brief}</p>
          <NavLink
            to={'/read'}
            unstable_viewTransition
            className='flex justify-center items-center w-40 rounded-full bg-slate-800 text-white h-10'
          >
            {t('start-reading')}
            {isRTL ? (
              <i className='text-xl mx-1 font-thin mb-[-4px] ri-arrow-left-up-line'></i>
            ) : (
              <i className='text-xl mx-1 font-thin mb-[-4px] ri-arrow-right-up-line'></i>
            )}
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default StoryPreview
