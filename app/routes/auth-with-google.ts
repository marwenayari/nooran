import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { createSupabaseServerClient } from '~/services/upabase.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createSupabaseServerClient(request)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.BASE_URL}/auth/callback`
    }
  })
  if (data.url) {
    return redirect(data.url) // use the redirect API for your server framework
  }
  return redirect('/auth')
}