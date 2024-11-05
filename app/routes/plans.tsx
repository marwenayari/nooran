import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { localeCookie } from '~/utils/cookies'
import { createSupabaseServerClient } from '~/services/upabase.server'
import { Plan, toPlan } from '~/models/Plan'
import { useProfile } from '~/context/ProfileContext'

const bgColors: any = {
  patron: 'bg-sky-200',
  enterprise: 'bg-zinc-600',
  pro: 'bg-amber-300',
  basic: 'bg-slate-200'
}
const buttonBgColors: any = {
  patron: 'bg-sky-100',
  enterprise: 'bg-zinc-700',
  pro: 'bg-amber-200',
  basic: 'bg-slate-100'
}

const colors: any = {
  patron: 'text-zinc-700',
  enterprise: 'text-white',
  pro: 'text-zinc-700',
  basic: 'text-zinc-700'
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie')
  const locale = await localeCookie.parse(cookieHeader)
  const { supabase } = createSupabaseServerClient(request)
  // const session = await getSession(cookieHeader)
  const { data } = await supabase.from('plans').select('*').order('id')

  return json({ plans: data?.map((json) => toPlan(json, locale)) })
}

const PlansPage = () => {
  const { plans } = useLoaderData<{ plans: Plan[] }>()
  let { t } = useTranslation('plans')
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const { profile, updateProfile } = useProfile()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const choosePlan = () => {
    if (profile && selectedPlan) {
      fetcher.submit({ plan_id: selectedPlan.id }, { method: 'patch', action: '/api/profile' })
      updateProfile({
        ...profile,
        plan: selectedPlan.key
      })
      window.setTimeout(() => {
        navigate(-1)
      }, 500)
    }
  }

  return (
    <section className='w-screen h-screen flex flex-col items-center pt-10'>
      <div className='pb-3 flex gap-x-7 items-center justify-end max-w-[1140px] mx-auto w-full px-10'>
        <i
          onClick={() => {
            navigate(-1)
          }}
          className='text-3xl text-slate-500 hover:opacity-75 transition cursor-pointer ri-close-large-line'
        ></i>
      </div>
      <div className='py-8 w-full flex justify-between flex-grow max-w-[968px] mx-auto gap-4'>
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`${bgColors[plan.key]} ${colors[plan.key]} w-1/4 flex flex-col p-2 justify-between rounded-lg`}
          >
            <div className='flex justify-between p-2 items-center'>
              <i className={`ri-1x ${plan.icon}`}></i>
              <h2 className='text-xl'>{t(plan.title)}</h2>
              <span className='text-xl'>{plan.price === 0 ? t('free') : '$' + plan.price}</span>
            </div>
            <div className='flex flex-col h-1/3'>
              {plan.features.map((feature, index) => (
                <div key={index} className='p-2 flex gap-2'>
                  {feature.active ? (
                    <i className={`ri-1x text-green-400 ri-checkbox-circle-fill`}></i>
                  ) : (
                    <i className={`ri-1x text-gray-700 ri-checkbox-circle-line`}></i>
                  )}
                  <span>{t(feature.title)}</span>
                </div>
              ))}
            </div>
            <button
              className={`p-4 w-full ${buttonBgColors[plan.key]} ${colors[plan.key]}  opacity-100 hover:opacity-80 rounded-md text-center my-2 cursor-pointer`}
              onClick={() => setSelectedPlan(plan)}
            >
              {t('choosePlan')}
            </button>
          </div>
        ))}
      </div>
      <div className={` w-full py-4 px-10 ${selectedPlan ? bgColors[selectedPlan.key] : ''}`}>
        <div className='max-w-[1140px] mx-auto flex justify-end'>
          <button
            disabled={selectedPlan === null}
            onClick={() => choosePlan()}
            className={`inline-block py-4 px-8 font-bold rounded-md text-center my-2 cursor-pointer bg-white text-gray-400`}
          >
            {t('proceed')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default PlansPage
//${bgColors[selectedPlan]}
