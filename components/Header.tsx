'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import Logo from '@/data/logo.svg'
import siteMetadata from '@/data/siteMetadata'
import { getUniversalCookie } from '@/lib/cookie'
import { useLogout } from '@/requests/useAuth'
import { getAvatarUrl } from '@/utils/helper'

import HeaderMenu from './HeaderMenu'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'
import { Button } from './ui/button'
import UserDropdown from './UserDropdown'

const Header = () => {
  const { mutate: logout, isPending: isLogoutPending } = useLogout({ redirectUrl: '/login' })
  const [user, setUser] = useState<any>(null)

  // Initialize user state from cookie
  useEffect(() => {
    // Get profile cookie
    function getProfileFromCookie() {
      const profileCookie = getUniversalCookie('profile')
      return profileCookie ? JSON.parse(profileCookie) : undefined
    }

    setUser(getProfileFromCookie())

    // Listen for login/logout events across tabs
    const onStorage = () => setUser(getProfileFromCookie())
    window.addEventListener('storage', onStorage)

    // Listen for custom event for the same tab
    const onProfileChange = () => setUser(getProfileFromCookie())
    window.addEventListener('profile-changed', onProfileChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('profile-changed', onProfileChange)
    }
  }, [])

  return (
    <header
      className={clsx(
        'bg-white py-2 dark:bg-gray-950',
        siteMetadata.stickyNav && 'sticky top-0 z-50 shadow-sm'
      )}
    >
      <div
        className={clsx(
          'flex w-full items-center justify-between',
          'mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-7xl xl:px-0'
        )}
      >
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
          <div className="no-scrollbar hidden sm:flex">
            <HeaderMenu user={user} />
          </div>

          <SearchButton />

          <ThemeSwitch />

          <UserDropdown user={user} logout={logout}>
            <Button
              variant="outline"
              className="hover:border-primary-400 dark:hover:border-primary-500 group flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 font-semibold transition hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800"
            >
              <span className="from-primary-500 hidden bg-gradient-to-r via-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:text-transparent group-focus:text-transparent md:inline">
                {user?.name}
              </span>
              <Image
                src={getAvatarUrl(user?.avatar)}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full border-2 border-blue-400 bg-white object-contain shadow-lg"
              />
            </Button>
          </UserDropdown>

          <MobileNav user={user} />
        </div>
      </div>
    </header>
  )
}

export default Header
