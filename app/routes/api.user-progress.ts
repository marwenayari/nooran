import type { LoaderFunctionArgs } from '@remix-run/node'
import { getSession } from '~/services/session.server'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { toUserCourse } from '~/models/UserCourse'
import { json } from '@remix-run/react'
import { localeCookie } from '~/utils/cookies'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("user progress")
  const cookieHeader = request.headers.get('Cookie')
  const locale = await localeCookie.parse(cookieHeader)
  const session = await getSession(cookieHeader)
  const { supabase } = createSupabaseServerClient(request)

  const courseWithProgressResult = await supabase.rpc('get_courses_with_progress_percentage', {
    user_id_param: session.get('user')?.id
  })

  let userCourses = []
  if (!courseWithProgressResult.error) {
    userCourses = courseWithProgressResult.data?.map((course: any) => toUserCourse(course, locale)) || []
  }

  return json(
    { userCourses }
  )
}