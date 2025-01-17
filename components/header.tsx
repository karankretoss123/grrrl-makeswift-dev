import { useIsOnline } from 'lib/useIsOnline'
import Link from 'next/link'
import { MouseEvent } from 'react'

import { Cart } from './cart'
import { LocaleSwitcher } from './locale/locale-switcher'
import { CiHeart, CiSearch, CiUser } from 'react-icons/ci'
import { useTopCategories } from 'lib/top-categories-context'

type LinkValue = {
  href: string
  target: '_blank' | '_self' | undefined
  onClick(event: MouseEvent<HTMLElement>): void
}

type Props = {
  className?: string
  links: {
    text?: string
    link?: LinkValue
  }[]
  localeSwitcherDisabled?: boolean
  cartDisabled?: boolean
}

export function Header({ className, links, localeSwitcherDisabled, cartDisabled }: Props) {
  const isOnline = useIsOnline()

  const staticCategories = [
    { id: 47, name: 'Home', link: '/page' },
    { id: 49, name: 'Vag Up', link: '/category/49' },
    { id: 39, name: 'New Gear', link: '/category/39' },
    { id: 47, name: 'Sweatpants', link: '/category/47' },
    { id: 43, name: 'Shorts', link: '/category/43' },
  ]

  return (
    <div className={`${className}  py-4 bg-[#0E0D1F] w-full`}>
      {/* Row 1: Logo Centered, Icons Right */}
      <div className="flex justify-between items-center h-12 my-16 px-8">
        <CiSearch fill="white" className="text-2xl hover:cursor-pointer stroke-1 text-white" />
        <div className="flex-grow flex justify-center ml-16">
          <Link href="/">
            <img src="/images/GRRRL_Logos.png" alt="GRRRL Logos" className="object-contain " />
          </Link>
        </div>
        <div className="flex items-center space-x-5 text-white">
          <CiHeart fill="white" className="text-2xl hover:cursor-pointer stroke-1" />
          <CiUser fill="white" className="text-2xl hover:cursor-pointer stroke-1" />
          <Cart disabled={cartDisabled} />
        </div>
      </div>

      {/* Row 2: Static Categories Centered */}
      <div className="flex justify-center my-4 text-white">
        <div className="flex space-x-8">
          {staticCategories.map(category => (
            <Link href={category.link} key={category.id} className="hover:text-gray-400">
              {category.name}
            </Link>
          ))}
          {links.map((link, i) => (
            <Link
              href={link.link?.href ?? '#'}
              target={link.link?.target}
              onClick={link.link?.onClick}
              key={i}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed z-10 bottom-3 inset-x-7 md:col-start-2 md:absolute md:flex md:bottom-auto md:inset-x-1/3">
          <div className="flex max-w-[318px] mx-auto justify-self-center space-x-3 items-center justify-center text-white bg-green px-6 lg:px-14 pt-[9px] pb-[11px]">
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.90106 6.43659C2.04617 7.24652 0.75 9.09647 0.75 11.25C0.75 14.1495 3.10051 16.5 6 16.5H13.9645L12.4645 15H6C3.92894 15 2.25 13.3211 2.25 11.25C2.25 9.49724 3.45312 8.02438 5.07839 7.61392L3.90106 6.43659ZM18.7614 14.2259C19.3685 13.6769 19.75 12.883 19.75 12C19.75 10.4459 18.5677 9.16698 17.0539 9.01515C16.7259 8.98225 16.4579 8.73905 16.3933 8.41581C15.8902 5.89741 13.6659 4 11 4C10.2702 4 9.57339 4.14214 8.93592 4.40038L7.80542 3.26989C8.76299 2.77784 9.84892 2.5 11 2.5C14.2115 2.5 16.9166 4.66207 17.7416 7.60975C19.7501 8.06164 21.25 9.85526 21.25 12C21.25 13.2972 20.7011 14.4662 19.823 15.2874L18.7614 14.2259Z"
                fill="white"
              />
              <path d="M3 2L19 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-base leading-7 whitespace-nowrap">You are currently offline</span>
          </div>
        </div>
      )}
    </div>
  )
}
