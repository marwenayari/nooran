import { json, LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { useTranslation } from 'react-i18next'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { CourseSummary, toCourseSummary } from '~/models/CourseSummary'
import { localeCookie } from '~/utils/cookies'
import { Suspense } from 'react'

export const meta: MetaFunction = () => {
  return [{ title: 'Nooran' }, { name: 'description', content: 'Welcome to Nooran!' }]
}

const categories = [
  {
    title: 'all',
    key: 0
  },
  {
    title: 'letters',
    key: 1
  },
  {
    title: 'vocabulary',
    key: 2
  },
  {
    title: 'grammar',
    key: 4
  },
  {
    title: 'conversations',
    key: 5
  }
]

export const loader: LoaderFunction = async ({ request }) => {
  const { supabase } = createSupabaseServerClient(request)
  const cookieHeader = request.headers.get('Cookie')
  const locale = await localeCookie.parse(cookieHeader)

  const { data } = await supabase.from('courses').select().order('created_at', { ascending: true })

  return json(data?.map((course) => toCourseSummary(course, locale)))
}

export default function Index() {
  const { t } = useTranslation('home')
  let selected = 0
  function selectCategory(key: number) {
    selected = key
  }

  const courses = useRouteLoaderData<CourseSummary[]>("routes/_index")

  return (
    <div>
      <h1 className='font-thin text-4xl md:text-6xl md:w-1/2 lg:w-1/2 xl:1/3 mb-8'>{t('title')}</h1>
      <div className='flex flex-col my-4'>
        <div className='flex flex-row overflow-scroll'>
          {categories.map((category) => (
            <button
              onClick={() => {
                selectCategory(category.key)
              }}
              key={category.title}
              className='mr-4 p-2 px-4 md:p-4 bg-dark-beige rounded-xl cursor-pointer'
            >
              <h3>{t(category.title)}</h3>
            </button>
          ))}
        </div>
      </div>
      <div className='flex flex-col'>
        <h2 className='font-thin text-2xl my-3'>{t('recent')}</h2>
        <div className='flex flex-row flex-wrap'>
          {courses.map((course) => (
            <Link
              className={`
                flex flex-col justify-between cursor-pointer p-2 md:-4 lg:p-4 xl:p-4 rounded-xl
                h-40 w-[calc(50%-0.5rem)] md:w-1/3 m-1 md:m-4`}
              key={course.id}
              style={{
                backgroundColor: course.color
              }}
              to={'/courses/' + course.id}
              prefetch='viewport'

            >
              <div className='flex justify-between items-center'>
                <span className='uppercase text-sm'>{t(course.level)} </span>
                <span className='bg-white rounded-xl w-12 flex items-center justify-center'>
                  <span>4.8</span>
                  <i className='ri-star-fill text-yellow-400 mx-1/2'></i>
                </span>
              </div>
              <div>
                <h3 className='text-lg'>{course.title}</h3>
                {course.description.split(' ').splice(0, 4).join(' ') + '..'}
              </div>
              <div className='flex justify-between'>
                <span></span>
                <span>{course.price == 0 ? t('common:free') : '$' + course.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
