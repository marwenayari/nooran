import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { CourseDetails, toCourseDetails } from '~/models/CourseDetails'
import { getSession } from '~/services/session.server'
import { toLessonDetails } from '~/models/LessonDetails'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient(request)
  const session = await getSession(request.headers.get('Cookie'))
  // get current course
  const courseData = await supabase
    .from('courses')
    .select('id, title, description, progress_color')
    .match({ id: Number(params['id']) })
    .single()
  // get All Lessons of current course
  const lessonsData = await supabase
    .from('lessons')
    .select('id, title, challenges(*)')
    .match({ course_id: courseData.data?.id })
  // get All challenges in lessons and user id
  const challenges = lessonsData.data?.flatMap(lesson => lesson.challenges) || []
  const challengeIds = challenges.map(challenge => Number(challenge.id))
  const challengeProgressData = await supabase
    .from('challenge_progress')
    .select('*')
    .match({user_id: session.get('user')?.id })
    .in('challenge_id', challengeIds)
  // calculate percentage of completion of each lesson
  const progressByLesson: any = {}
  lessonsData.data?.forEach(lesson => {
    const challengeIdsOfCurrentLesson = challenges.filter(challenge => challenge.lesson_id === lesson.id).map(challenge => Number(challenge.id))
    const progressOfCurrentLesson = challengeProgressData.data?.filter(progress => challengeIdsOfCurrentLesson.includes(progress.challenge_id))
    progressByLesson[lesson.id] = progressOfCurrentLesson && lesson.challenges.length ? (progressOfCurrentLesson.length * 100) / lesson.challenges.length : 0;
  })

  return json({
    course: {
      ...toCourseDetails(courseData.data),
      lessons: lessonsData.data?.map(toLessonDetails)
    },
    progressByLesson
  })
}

const CoursePage = () => {
  const {course, progressByLesson} = useLoaderData<{course: CourseDetails, progressByLesson: any}>()
  const getMarginLeft = (index: number) => {
    const mls = [
      'ml-0 rtl:mr-0',
      'ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]',
      'ml-[-4rem] rtl:ml-0 rtl:mr-[-4rem]',
      'ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]',
      'ml-0 rtl:mr-0',
      'ml-[2rem] rtl:ml-0 rtl:mr-[2rem]',
      'ml-[4rem] rtl:ml-0 rtl:mr-[4rem]'
    ]
    return mls[index % 6]
  }

  return (
    <section className='flex flex-col items-center'>
      <div
        className={`w-2/3 rounded-lg p-2 text-white`}
        style={{
          backgroundColor: course.progressColor
        }}
      >
        <div className=' flex items-center uppercase opacity-70'>
          <Link to={`/`}>
            <i className='text-xl ri-arrow-left-line mr-2 my-2'></i>
          </Link>
          {course.title}
        </div>
        <div>{course.description}</div>
      </div>
      <div className='path lessons flex flex-col gap-8 justify-between items-center pt-8 pb-4'>
        {course.lessons.map((lesson, idx) => (
          <Link
            to={`/lessons/${lesson.id}`}
            prefetch='viewport'
            key={lesson.id}
            className={`flex items-center justify-center shadow-lg shadow-slate-400 rounded-full w-16 h-16 ${getMarginLeft(
              idx
            )}`}
            style={{
              backgroundColor: progressByLesson[lesson.id] && progressByLesson[lesson.id] > 0 ? course.progressColor : '#94a3b8'
            }}
          >
            <i className='text-4xl text-white ri-star-fill cursor-pointer'></i>
          </Link>
        ))}
        {/* <img
          className="w-56"
          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/locked/bf1a9ccba05390a74cf13a0f7c9a665d.svg"
        ></img> */}
        <img className='w-56' src='/img/trophy.png'></img>
      </div>
    </section>
  )
}

export default CoursePage
