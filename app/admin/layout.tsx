'use client'

import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import SiteHeader from '@/components/SiteHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
} from '@/components/ui/sidebar'
import UserDropdown from '@/components/UserDropdown'
import { adminNavLinks } from '@/data/navLinks'
import { getUniversalCookie } from '@/lib/cookie'
import { useLogout } from '@/requests/useAuth'
import { UserResponse, CookieProfileSaved } from '@/types/user'
import { getAvatarUrl } from '@/utils/helper'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const { mutate: logout, isPending: isLogoutPending } = useLogout({ redirectUrl: '/login' })
  const [user, setUser] = React.useState<(UserResponse & CookieProfileSaved) | undefined>(undefined)

  React.useEffect(() => {
    if (user) {
      if (user?.isAdmin && pathname === '/admin') {
        router.push('/admin/dashboard')
      } else if (!user.isAdmin) {
        router.push('/')
        toast.error('Bạn không có quyền truy cập trang quản trị!')
      }
    }
  }, [user, pathname])

  // Initialize user state from cookie
  React.useEffect(() => {
    // Get profile cookie
    function getProfileFromCookie() {
      const profileCookie = getUniversalCookie('profile')
      return profileCookie ? JSON.parse(profileCookie) : undefined
    }

    const user = getProfileFromCookie()

    if (user) {
      setUser(user)
    } else {
      router.push('/login')
    }

    // Listen for login/logout events across tabs
    const onStorage = () => setUser(user)
    window.addEventListener('storage', onStorage)

    // Listen for custom event for the same tab
    const onProfileChange = () => setUser(user)
    window.addEventListener('profile-changed', onProfileChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('profile-changed', onProfileChange)
    }
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="offcanvas"
          variant="sidebar"
          side="left"
          className="border-r bg-white"
        >
          <SidebarHeader className="mb-2 border-0 border-none">
            <div className="text-center text-xl font-bold">Admin CMS</div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {adminNavLinks.map((item) => {
                if (item?.icon) {
                  return (
                    <SidebarMenuItem key={item?.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item?.href || pathname?.includes(item?.href)}
                      >
                        <Link href={item?.href}>
                          {item?.icon}
                          <span>{item?.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <SidebarMenu>
              <SidebarMenuItem>
                <UserDropdown user={user} logout={logout}>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                    </div>
                    <MoreVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </UserDropdown>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SiteHeader navMenu={adminNavLinks} currentPath={pathname} />
          <section className="h-[calc(100vh-var(--header-height))] overflow-auto p-4">
            {children}
          </section>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
