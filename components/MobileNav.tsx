'use client'

import { ChevronRight, AlignJustify } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import Logo from '@/data/logo.svg'
import { headerNavLinks } from '@/data/navLinks'
import siteMetadata from '@/data/siteMetadata'
import { UserResponse } from '@/types/user'
import { getAvatarUrl } from '@/utils/helper'

import UserDropdown from './UserDropdown'

interface MobileNavProps {
  user?: UserResponse
  logout?: () => void
}

const MobileNav: React.FC<MobileNavProps> = ({ user, logout }) => {
  return (
    <SidebarProvider className="min-h-fit w-fit sm:hidden">
      <SidebarTrigger icon={<AlignJustify />} />
      <SidebarNav user={user} logout={logout} />
    </SidebarProvider>
  )
}

export default React.memo(MobileNav)

const SidebarNav: React.FC<MobileNavProps> = ({ user, logout }) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas" side="left" className="pt-14">
      <SidebarHeader>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="h-6 text-2xl font-semibold">{siteMetadata.headerTitle}</div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {headerNavLinks.map((link) => {
              if (link?.children) {
                return (
                  <Collapsible key={link?.title} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between">
                          <span>{link?.title}</span>
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {link?.children.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton href={child.href}>
                                {child.title}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }
              if (link?.mega) {
                return (
                  <Collapsible key={link?.title} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between">
                          <span>{link?.title}</span>
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {link?.groups?.map((group) => (
                            <SidebarMenuSubItem key={group?.groupTitle}>
                              <span className="text-xs text-gray-500 uppercase dark:text-gray-400">
                                {group?.groupTitle}
                              </span>
                              {group?.items.map((item) => (
                                <SidebarMenuSubButton key={item.title} href={item.href}>
                                  {item.title}
                                </SidebarMenuSubButton>
                              ))}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }
              return (
                <SidebarMenuItem key={link?.title}>
                  <SidebarMenuButton asChild>
                    <Link href={link?.href || '#'}>{link?.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && logout && (
          <SidebarMenu>
            <SidebarMenuItem>
              <UserDropdown user={user} logout={logout} toggleSidebar={toggleSidebar}>
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
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
