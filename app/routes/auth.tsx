import type { LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { commitSession, getSession } from '~/services/session.server'
import { Form, useActionData, useNavigate } from '@remix-run/react'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '~/components/LanguageSwitcher'
import { Profile, toProfile } from '~/models/Profile'
import { useProfile } from '~/context/ProfileContext'
import { useEffect } from 'react'

type ActionData = {
  success?: boolean
  error?: string
  profile: Profile | null
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = session.get('user')

  if (user) {
    return redirect('/')
  }

  return json({ success: true })
}

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  const getProfile = async (userId: string): Promise<Profile | null> => {
    let profile = null
    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single()

    if (!error) {
      profile = data
      session.set('profileId', profile?.id)
      return toProfile(data)
    }
    return null;
  }

  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  const { supabase } = createSupabaseServerClient(request)

  // First, try to sign in the user
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (signInError) {
    return json({ success: false, error: signInError.message, profile: null })
    // If sign-in fails because the user doesn't exist, attempt sign-up
    // if (signInError.code === 'invalid_credentials') {
    //   const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    //     email,
    //     password
    //   })
    //
    //   if (signUpError) {
    //     return json({ success: false, error: signUpError.message })
    //   }
    //
    //
    //   session.set('user', signUpData.user)
    //   return json(
    //     {
    //       success: true,
    //       error: '',
    //       profile: await getProfile(signUpData.user?.id ?? '')
    //     },
    //     {
    //       headers: { 'Set-Cookie': await commitSession(session) }
    //     }
    //   )
    // } else {
    //   return json({ success: false, error: signInError.message, profile: null })
    // }
  } else {
    session.set('user', signInData.user)
    return json(
      {
        success: true,
        error: '',
        profile: await getProfile(signInData.user?.id ?? '')
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) }
      }
    )
  }
}

export default function Auth() {
  const { t } = useTranslation('auth')
  const actionData: ActionData | undefined = useActionData()
  const { updateProfile } = useProfile()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('action data', actionData)
    if (actionData && actionData.profile) {
      updateProfile(actionData.profile)
      navigate('/')
    }
  }, [actionData])

  return (
    <main className='flex items-center justify-center h-screen w-screen bg-cloud bg-cover'>
      <div
        className='flex items-center justify-center h-screen w-screen
              bg-gradient-to-b from-red-300 to-red-100/10'
      >
        <div className='login-box bg-white dark:bg-slate-600 dark:text-white p-8 rounded-2xl shadow-lg w-80 text-center'>
          <div className='text-center  flex justify-center'>
            <img className='w-12 h-12' src='/logo.png' alt='' />
          </div>
          <h2 className='text-2xl mb-3 dark:text-white'>{t('sign-in-with-email')}</h2>
          <h3 className='mb-6 dark:text-white'>{t('start-learning')}</h3>
          <Form method='post'>
            <div>
              <input
                className='my-1 w-full p-2 rounded-md bg-red-50/50'
                type='email'
                name='email'
                placeholder='Email'
                required
              ></input>
              <input
                className='my-1 w-full p-2 rounded-md bg-red-50/50'
                type='password'
                name='password'
                placeholder='Password'
                required
              ></input>
              <div className='mb-5'>
                {actionData?.error && <span className='text-red-500'>{actionData?.error}</span>}
              </div>
              <div className='mb-5 text-right'>
                <h3 className='dark:text-white cursor-pointer'>{t('forgot-password')}</h3>
              </div>
              <button className='p-2 bg-slate-600 text-white rounded-md w-full' type='submit'>
                {t('sign-in')}
              </button>
            </div>
          </Form>

          <div className='flex flex-col items-center justify-center h-20'>
            <span className='mb-2 text-slate-500'>{t('or-sign-in-with')}</span>
            <div className='flex justify-between w-1/2 '>
              <i className='ri-google-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10'></i>
              <i className='ri-apple-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10'></i>
              <i className='ri-twitter-x-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10'></i>
            </div>
          </div>
          <div className='hidden'>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </main>
  )
}
