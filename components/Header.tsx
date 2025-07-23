'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useLogout } from '@/requests/useAuth'
import { Fragment, useEffect, useState } from 'react'
import { getUniversalCookie } from '@/lib/cookie'
import Image from 'next/image'
import { getAvatarUrl } from '@/utils/helper'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }
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
    <header className={headerClass}>
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
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}

          {user && (
            <Link
              key={'gallery'}
              href={'/gallery'}
              className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
            >
              Gallery
            </Link>
          )}
        </div>

        <SearchButton />

        <ThemeSwitch />

        {/* User actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <Menu as="div" className="relative">
              <MenuButton className="hover:border-primary-400 dark:hover:border-primary-500 group flex items-center gap-2 rounded-2xl border border-transparent px-4 py-2 font-semibold transition hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
                <span className="from-primary-500 hidden bg-gradient-to-r via-blue-500 to-purple-500 bg-clip-text text-transparent group-hover:text-transparent group-focus:text-transparent md:inline">
                  {user.name}
                </span>
                <Image
                  src={getAvatarUrl(user.avatar)}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-blue-400 bg-white object-contain shadow-lg"
                />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="absolute right-0 z-50 mt-2 w-40 rounded-2xl bg-gray-200 py-1 shadow-lg ring-1 ring-black/10 focus:outline-none dark:bg-gray-700"
              >
                <MenuItem as={Fragment}>
                  {({ focus }) => (
                    <Link
                      href="/profile"
                      className={`block rounded-2xl px-4 py-2 font-semibold text-gray-900 transition-colors dark:text-gray-100${focus ? 'bg-primary-100 dark:bg-primary-700' : ''}`}
                    >
                      Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem as={Fragment}>
                  {({ focus }) => (
                    <button
                      onClick={() => logout()}
                      className={`block w-full rounded-2xl px-4 py-2 text-left font-semibold text-gray-900 transition-colors dark:text-gray-100${focus ? 'bg-red-100 dark:bg-red-700' : ''}`}
                      disabled={isLogoutPending}
                    >
                      {isLogoutPending ? 'Signing out...' : 'Logout'}
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Link
              href="/login"
              className="hover:border-primary-400 dark:hover:border-primary-500 from-primary-500 rounded-2xl border border-transparent bg-gradient-to-r via-blue-500 to-purple-500 bg-clip-text px-4 py-2 font-semibold text-transparent transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Login / Register
            </Link>
          )}
        </div>

        <MobileNav user={user} />
      </div>
    </header>
  )
}

export default Header
