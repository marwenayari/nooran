import type { ActionFunctionArgs } from '@remix-run/node'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { getSession } from '~/services/session.server'
import { json } from '@remix-run/react'
import { localeCookie } from '~/utils/cookies'

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient(request)
  const formaData = await request.formData()
  const session = await getSession(request.headers.get('Cookie'))

  if(request.method === 'PATCH') {
    if (formaData.has('lang')) {
      if (session.has('user')) {
        await supabase
          .from('profiles')
          .update({
            locale: formaData.get('lang')
          })
          .match({ user_id: session.get('user')['id'] })
      }

      return json(
        { lang: formaData.get('lang') },
        {
          headers: { 'Set-Cookie': await localeCookie.serialize(formaData.get('lang')), 'Clear-Site-Data': '"cache"' }
        }
      )
    }
    console.log('plan_id', formaData.get('plan_id'), session.get('user')['id'])
    if (formaData.has('plan_id') && session.has('user')) {
      const result = await supabase
        .from('profiles')
        .update({
          plan_id: formaData.get('plan_id')
        })
        .match({ user_id: session.get('user')['id'] })
      return json(
        { result: result }
      )
    }

  }

}