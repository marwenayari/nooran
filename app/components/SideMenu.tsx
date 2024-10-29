import { Link } from '@remix-run/react'
import { useTranslation } from 'react-i18next'

export default function SideMenu() {
  const menu = [
    { label: 'Home', icon: 'ri-home-2-line', href: '/' },
    { label: 'Stories', icon: 'ri-book-open-line', href: '/stories' },
    { label: 'About', icon: 'ri-team-line', href: '/about' }
  ]
  return (
    <section
      className='side-menu
      flex items-center md:flex-col lg:flex-col justify-between
      md:p-5 lg:p-5 px-4 w-full md:w-auto lg:w-auto md:h-full lg:h-full rounded-2xl'
    >
      <section className='flex justify-center  h-10'>
        <Link to='/' prefetch='intent'>
          <i className='text-3xl ri-landscape-fill'></i>
        </Link>
      </section>
      <section className='flex gap-2 md:block lg:block items-center'>
        {menu.map((item) => (
          <div key={item.href}>
            <Link
              to={item.href}
              prefetch='viewport'
              className='flex bg-white dark:bg-gray-500 rounded-full items-center justify-center w-10 h-10 my-2'
            >
              <i className={'text-xl ' + item.icon}></i>
            </Link>
          </div>
        ))}
      </section>
      <section>
        <Link
          to='/donate'
          prefetch='viewport'
          className='flex bg-white dark:bg-gray-500 rounded-full items-center justify-center w-10 h-10 my-2'
        >
          {/* <i className='text-xl ri-hand-heart-line'></i> */}
          {/* <i className='text-xl ri-drinks-line'></i> */}
          <i className='text-xl ri-drinks-fill'></i>
          {/* <i className='text-xl ri-hand-heart-fill'></i> */}
        </Link>
      </section>
    </section>
  )
}
