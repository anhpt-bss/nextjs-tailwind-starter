'use client'

import { LogOut, UserCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserResponse } from '@/types/user'
import { getAvatarUrl } from '@/utils/helper'

interface UserDropdownProps {
  children: React.ReactNode
  user?: UserResponse
  logout: () => void
  toggleSidebar?: () => void
}

const UserDropdown: React.FC<UserDropdownProps> = ({ children, user, logout, toggleSidebar }) => {
  if (!user) {
    return (
      <Link
        href="/login"
        onClick={() => {
          toggleSidebar?.()
        }}
        className="hover:border-primary-400 dark:hover:border-primary-500 from-primary-500 rounded-2xl border border-transparent bg-gradient-to-r via-blue-500 to-purple-500 bg-clip-text px-4 py-2 font-semibold text-transparent transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Sign In / Up
      </Link>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={getAvatarUrl(user?.avatar)} alt={user?.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              href="/profile"
              className="flex items-center gap-2"
              onClick={() => {
                toggleSidebar?.()
              }}
            >
              <UserCircle />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            toggleSidebar?.()
            logout()
          }}
          className="cursor-pointer"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default React.memo(UserDropdown)
