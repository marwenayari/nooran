import { type ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { LessonDetails, toLessonDetails } from '~/models/LessonDetails'
import { ChallengeType } from '~/models/ChallengeType'
import ImageAndAudioWithOptionsChallenge from '~/components/ImageAndAudioWithOptionsChallenge'
import AudioWithOptionsChallenge from '~/components/AudioWithOptionsChallenge'
import { useTranslation } from 'react-i18next'
import { getSession } from '~/services/session.server'

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient(request)
  const formaData = await request.formData()
  const session = await getSession(request.headers.get('Cookie'))

  if (formaData.has('challengeId') && formaData.has('optionId') && session.has('user')) {
    let correct = false
    const { data } = await supabase
      .from('challenge_options')
      .select('*')
      .match({ challenge_id: Number(formaData.get('challengeId')), correct: true })
      .single()

    if (data && data?.id === Number(formaData.get('optionId'))) {
      correct = true
    }

    const { error } = await supabase
      .from('challenge_progress')
      .upsert(
        {
          user_id: session.get('user').id,
          challenge_id: Number(formaData.get('challengeId')),
          finished_at: new Date().toISOString(),
          correct: correct
        },
        {
          onConflict: 'user_id, challenge_id'
        }
      )
      .select()
    if (error) {
      throw error
    }
    return json({ correct: correct })
  }
  return json({ error: 'invalid request' })
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const { supabase } = createSupabaseServerClient(request)
  const lessonResult = await supabase
    .from('lessons')
    .select('id, title, courses(id, title), challenges(*, challenge_options(*))')
    .match({ id: Number(params['id']) })
    .single()
  const lesson = toLessonDetails(lessonResult.data)
  const challengeIds = lesson.challenges.map((challenge) => challenge.id)

  const progressResult = await supabase
    .from('challenge_progress')
    .select('*')
    .match({ user_id: session.get('user')?.id })
    .in('challenge_id', challengeIds)

  const completedChallengeIds = progressResult.data?.map((progress) => progress.challenge_id)

  lesson.challenges = [
    ...lesson.challenges
      .map((challenge) => {
        return {
          ...challenge,
          completed: completedChallengeIds?.includes(challenge.id) || false
        }
      })
      .sort((c1, c2) => c1.order - c2.order)
  ]
  return json(lesson)
}

enum Status {
  question = 'QUESTION',
  correct = 'CORRECT',
  wrong = 'WRONG'
}

const LessonPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('lessons')
  const fetcher = useFetcher<{ correct: boolean }>()
  const [searchParams] = useSearchParams()
  const lessonId = parseInt(searchParams.get('id') || '-1')

  const currentLesson = useLoaderData<LessonDetails>()
  // const questions = useLoaderData<typeof loader>();
  const [currentChallenge, setCurrentChallenge] = useState(
    currentLesson.challenges.find((challenge) => !challenge.completed) ||
      currentLesson.challenges[currentLesson.challenges.length - 1]
  )
  const [progress, setProgress] = useState<number>(0)
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>(Status.question)

  useEffect(() => {
    if (currentLesson) {
      setProgress(
        (currentLesson.challenges.filter((chalenge) => chalenge.completed)?.length * 100) /
          currentLesson.challenges.length
      )
    }
  }, [currentLesson])

  useEffect(() => {
    if (fetcher && fetcher?.data) {
      if (fetcher.data.correct) {
        setStatus(Status.correct)
      } else {
        setStatus(Status.wrong)
      }
    }
  }, [fetcher])

  const answer = () => {
    fetcher.submit(
      { challengeId: currentChallenge?.id, optionId: currentAnswer },
      {
        method: 'put'
      }
    )
  }
  const nextChallenge = () => {
    const currentChallengeIndex = currentLesson.challenges.findIndex(
      (challenge) => challenge.id === currentChallenge?.id
    )
    if (currentChallengeIndex + 1 < currentLesson.challenges.length) {
      setCurrentChallenge(currentLesson.challenges[currentChallengeIndex + 1])
      setStatus(Status.question)
      setCurrentAnswer(null)
    } else {
      navigate(`/courses/${currentLesson.course.id}`)
    }
  }

  return (
    <section
      className='w-screen h-screen flex flex-col items-center pt-10'
      style={{ viewTransitionName: 'lesson-stone-transition-' + lessonId }}
    >
      <div className='pb-3 px-4 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full'>
        <Link
          to={'/courses/' + currentLesson.course.id}
          prefetch='viewport'
          className='text-3xl text-slate-500 hover:opacity-75 transition cursor-pointer'
        >
          <i className='ri-close-large-line'></i>
        </Link>
        <div className='w-full bg-gray-200 rounded-full h-3.5  dark:bg-gray-700'>
          <div className='bg-green-400 h-3.5 rounded-full' style={{ width: `${progress}%` }}></div>
        </div>
        <div className='flex items-center font-bold'>
          <i className='ri-heart-fill text-3xl text-red-500'></i>
        </div>
      </div>
      {currentLesson.challenges.length > 0 && (
        <>
          <div className='py-8 px-4 w-full flex flex-grow max-w-[768px] mx-auto items-center'>
            <div className='block w-full'>
              {currentChallenge.type === ChallengeType.imageAndAudioWithOptions && (
                <ImageAndAudioWithOptionsChallenge
                  currentOptionId={currentAnswer}
                  challenge={currentChallenge}
                  opOptionClick={(option) => status === Status.question ? setCurrentAnswer(option.id): null}
                />
              )}
              {currentChallenge.type === ChallengeType.audioWithOptions && (
                <AudioWithOptionsChallenge
                  currentOptionId={currentAnswer}
                  challenge={currentChallenge}
                  opOptionClick={(option) => status === Status.question ? setCurrentAnswer(option.id): null}
                />
              )}
            </div>
          </div>
          {status === Status.question && (
            <div className='border-t-2 w-full p-4'>
              <div className='max-w-[1140px] mx-auto flex w-full flex-row-reverse'>
                <button
                  disabled={currentAnswer === null}
                  onClick={answer}
                  className={`inline-block py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer ${
                    currentAnswer === null ? 'bg-gray-200 text-gray-600' : 'text-white bg-green-400'
                  }`}
                >
                  {t('check')}
                </button>
              </div>
            </div>
          )}
          {(status === Status.correct || status === Status.wrong) && (
            <div className={` w-full  p-4 ${status === Status.correct ? 'bg-green-200' : 'bg-red-200'}`}>
              <div className='max-w-[1140px] mx-auto flex justify-between'>
                <i
                  className={`w-16 h-16 items-center justify-center text-4xl rounded-full font-bold flex bg-white ${
                    status === Status.correct ? 'ri-check-line text-green-900' : 'ri-close-line text-red-900'
                  }`}
                ></i>

                <button
                  onClick={nextChallenge}
                  className={`py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer text-white ${
                    status === Status.correct ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {t('continue')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default LessonPage
