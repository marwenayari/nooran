import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import { commitSession, getSession } from './services/session.server'

import 'remixicon/fonts/remixicon.css'
import './tailwind.css'
import './style.css'
import { useTranslation } from 'react-i18next'
import SideBar from './components/SideBar'
import SideMenu from './components/SideMenu'
import { ShouldRevalidateFunction, useLocation } from 'react-router-dom'
import { createSupabaseServerClient } from './services/upabase.server'
import { ProfileProvider } from './context/ProfileContext'
import { Profile, toProfile } from '~/models/Profile'
import { toUserCourse, UserCourse } from '~/models/UserCourse'
import { localeCookie } from '~/utils/cookies'
import { Suspense, useEffect, useState } from 'react'


export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

export const shouldRevalidate: ShouldRevalidateFunction = ({}) => {
  return false
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const locale = await localeCookie.parse(cookieHeader)
  const session = await getSession(cookieHeader)
  const { supabase } = createSupabaseServerClient(request)
  const user = session.get('user')


  let profile = null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .single()

  profile = toProfile(data)

  if (!error) {
    session.set('profileId', profile?.id)
  }

  const courseWithProgressResult = await supabase.rpc('get_courses_with_progress_percentage', { user_id_param: session.get('user')?.id  });

  // console.log('courseWithProgressResult.data', courseWithProgressResult.data)
  let userCourses = [];
  if (!courseWithProgressResult.error) {
    userCourses = courseWithProgressResult.data?.map((course: any) => toUserCourse(course, locale)) || [];
  }

  return json(
    { userProfile: profile, user, locale, userCourses },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  )
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { userProfile, locale, userCourses } = useLoaderData<{
    userProfile: Profile
    locale: string
    user: any,
    userCourses: UserCourse[]
  }>()
  const [direction, setDirection] = useState<string>(locale === 'ar' ? 'rtl' : 'ltr')


  const { i18n } = useTranslation()


  useEffect(() => {
    i18n.on("languageChanged", () => {
      setDirection(i18n.dir())
    })
  }, [i18n])

  const location = useLocation()
  const isAuthPage = location.pathname === '/auth'
  const fullScreenPaths = ['/lessons', '/plans', '/read']
  const isFullScreen = fullScreenPaths.some((value) => location.pathname.startsWith(value))

  return (

    <html lang={locale} dir={direction}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
      <Suspense fallback={<div>Loading...</div>}>
        {isAuthPage ? (
          <ProfileProvider userProfile={userProfile}>
            <main className='flex items-center justify-center h-screen'>{children}</main>
          </ProfileProvider>
        ) : (
          <ProfileProvider userProfile={userProfile}>
            {isFullScreen && <section className='h-full w-full'>{children}</section>}
            {!isFullScreen && (
              <section
                className='
            flex flex-col-reverse md:flex-row lg:flex-row items-center
            w-screen h-screen p-4 md:p-8 lg:p-8 overflow-hidden'
              >
                <SideMenu />
                <section className='h-full w-full pb-4 md:p-8 lg:p-8 overflow-y-scroll'>{children}</section>
                <SideBar userCourses={userCourses}/>
              </section>
            )}
          </ProfileProvider>
        )}
      </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
