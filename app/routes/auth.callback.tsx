import { type LoaderFunctionArgs, redirect } from '@remix-run/node'
import { parse } from 'cookie'
import { createSupabaseServerClient } from '~/services/upabase.server'

export async function loader({ request }: LoaderFunctionArgs) {

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const headers = new Headers()

  console.log('callback', code)
  if (code) {
    const cookies = parse(request.headers.get('Cookie') ?? '')
    const { supabase } = createSupabaseServerClient(request)

    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    console.log('session data', data)
    if (!error) {
      return redirect(next, { headers })
    }
    console.log('error', error)
  }


  // return the user to an error page with instructions
  return redirect('/auth?error=auth-code-error', { headers })
}