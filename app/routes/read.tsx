import { Link } from '@remix-run/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ReadPage = () => {
  let { t } = useTranslation('stories')
  const [shownSentence, setShownSentence] = useState<number>(-1)

  let story
  let selectedStory
  if (localStorage) {
    story = JSON.parse(localStorage.getItem('story') ?? '{}')
    selectedStory = JSON.parse(localStorage.getItem('selectedStory') || '{}')
  }
  const content = JSON.parse(story?.content)
  const englishContent = JSON.parse(story?.content_en)

  const showControl = (idx: number) => {
    setShownSentence(idx)
  }

  return (
    <section
      className='w-screen h-screen flex flex-col items-center pt-10'
      style={{ viewTransitionName: 'read-transition' }}
    >
      <div className='story-bg w-full h-full absolute left-0 top-0 opacity-20'></div>
      <div className='story-header pb-3 flex gap-x-7 items-center justify-end max-w-[1140px] mx-auto w-full px-10'>
        <Link prefetch='viewport' to={'/stories?type=0' + '&selected=' + selectedStory.key}>
          <i className='text-3xl text-slate-500 hover:opacity-75 transition cursor-pointer ri-close-large-line'></i>
        </Link>
      </div>
      <div className='story-content py-8 w-full flex flex-col justify-between flex-grow max-w-[768px] mx-auto gap-1'>
        {content.map((sentence: string, idx: number) => (
          <div
            key={idx}
            dir='rtl'
            className={`relative p-1 text-right cursor-pointer flex flex-col justify-start rounded-lg text-xl`}
            onClick={() => showControl(idx)}
          >
            {sentence}
            {shownSentence === idx && (
              <span dir='ltr' className='absolute  bg-white rounded-md p-1'>
                {englishContent[idx]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className='w-full py-4 px-10'>
        <div className='max-w-[1140px] mx-auto flex justify-end'></div>
      </div>
    </section>
  )
}

export default ReadPage
