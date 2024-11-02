import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const bgColors = ['bg-slate-200', 'bg-amber-300', 'bg-zinc-600']
const buttonBgColors = ['bg-slate-100', 'bg-amber-200', 'bg-zinc-400']
const colors = ['text-zinc-700', 'text-zinc-700', 'text-white']
const plans = [
  {
    title: 'أساسي', // Arabic primary
    title_en: 'Basic', // English version
    icon: 'ri-user-fill',
    price: 0,
    features: [
      {
        title: 'مستخدم واحد', // Arabic primary
        title_en: '1 User',
        active: true
      },
      {
        title: 'دعم أساسي', // Arabic primary
        title_en: 'Basic Support',
        active: true
      },
      {
        title: 'عدد غير محدود من الاختبارات', // Arabic primary
        title_en: 'Unlimited Quizzes',
        active: false
      },
      {
        title: 'عدد غير محدود من القصص', // Arabic primary
        title_en: 'Unlimited Stories',
        active: false
      }
    ]
  },
  {
    title: 'محترف', // Arabic primary
    title_en: 'Pro',
    price: 15,
    icon: 'ri-vip-crown-fill',
    features: [
      {
        title: '5 أجهزة', // Arabic primary
        title_en: '5 Devices',
        active: true
      },
      {
        title: 'دعم أولوية', // Arabic primary
        title_en: 'Priority Support',
        active: true
      },
      {
        title: 'عدد غير محدود من الاختبارات', // Arabic primary
        title_en: 'Unlimited Quizzes',
        active: true
      },
      {
        title: 'عدد غير محدود من القصص', // Arabic primary
        title_en: 'Unlimited Stories',
        active: true
      }
    ]
  },
  {
    title: 'المؤسسة', // Arabic primary
    title_en: 'Enterprise',
    price: 29,
    icon: 'ri-building-3-fill',
    features: [
      {
        title: 'عدد غير محدود من المستخدمين', // Arabic primary
        title_en: 'Unlimited Users',
        active: true
      },
      {
        title: 'دعم المؤسسة', // Arabic primary
        title_en: 'Enterprise Support',
        active: true
      },
      {
        title: 'تخصيص المؤسسة', // Arabic primary
        title_en: 'Enterprise Customization',
        active: true
      },
      {
        title: 'عدد غير محدود من الاختبارات', // Arabic primary
        title_en: 'Unlimited Quizzes',
        active: true
      },
      {
        title: 'عدد غير محدود من القصص', // Arabic primary
        title_en: 'Unlimited Stories',
        active: true
      }
    ]
  }
]

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json(plans)
}

const PlansPage = () => {
  let { t } = useTranslation('plans')
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(0)

  const select = (idx: number) => {
    setSelectedPlan(idx)
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
      <div className='py-8 w-full flex justify-between flex-grow max-w-[768px] mx-auto gap-4'>
        {plans.map((plan, idx) => (
          <div
            key={plan.title_en}
            className={`${bgColors[idx]} ${colors[idx]} w-1/3 flex flex-col p-2 justify-between rounded-lg`}
          >
            <div className='flex justify-between p-2 items-center'>
              <i className={`ri-1x ${plan.icon}`}></i>
              <h2 className='text-xl'>{t(plan.title_en)}</h2>
              <span className='text-xl'>{plan.price === 0 ? t('free') : '$' + plan.price}</span>
            </div>
            <div className='flex flex-col h-1/3'>
              {plan.features.map((feature) => (
                <div key={feature.title_en} className='p-2 flex gap-2'>
                  {feature.active ? (
                    <i className={`ri-1x text-green-400 ri-checkbox-circle-fill`}></i>
                  ) : (
                    <i className={`ri-1x text-gray-700 ri-checkbox-circle-line`}></i>
                  )}
                  <span>{t(feature.title_en)}</span>
                </div>
              ))}
            </div>
            <button
              className={`p-4 w-full ${buttonBgColors[idx]} opacity-100 hover:opacity-80 rounded-md text-center my-2 cursor-pointer`}
              onClick={() => select(idx)}
            >
              {t('choosePlan')}
            </button>
          </div>
        ))}
      </div>
      <div className={`${bgColors[selectedPlan]} w-full py-4 px-10`}>
        <div className='max-w-[1140px] mx-auto flex justify-end'>
          <button
            disabled={selectedPlan === null}
            onClick={() => select(0)}
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
