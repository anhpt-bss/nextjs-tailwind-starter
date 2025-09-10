import { UsersIcon, LayoutDashboardIcon, FileIcon } from 'lucide-react'

interface NavLinkGroupItem {
  title: string
  href: string
  description?: string
  icon?: React.ReactNode
}

interface NavLinkGroup {
  groupTitle: string
  items: NavLinkGroupItem[]
}
interface NavLink extends NavLinkGroupItem {
  children?: NavLinkGroupItem[]
  mega?: boolean
  groups?: NavLinkGroup[]
}

export const adminNavLinks: NavLink[] = [
  {
    title: 'Bảng điều khiển',
    href: '/admin/dashboard',
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
  },
  {
    title: 'Bài đăng',
    href: '/admin/blog',
    icon: <FileIcon className="h-4 w-4" />,
  },
  {
    title: 'Người dùng',
    href: '/admin/user',
    icon: <UsersIcon className="h-4 w-4" />,
  },
]

export const headerNavLinks: NavLink[] = [
  { href: '/news', title: 'News' },
  { href: '/blog', title: 'Blog' },
  { href: '/feed', title: 'Feed' },
  { href: '/gallery', title: 'Gallery' },
  { href: '/about', title: 'About' },
  // {
  //   title: 'More',
  //   children: [
  //     { href: '/blog', title: 'Blog' },
  //     { href: '/tags', title: 'Tags' },
  //     { href: '/projects', title: 'Projects' },
  //     { href: '/about', title: 'About' },
  //   ],
  // },
  // {
  //   title: 'More',
  //   mega: true,
  //   groups: [
  //     {
  //       groupTitle: 'Resources',
  //       items: [
  //         { title: 'Docs', href: '/docs' },
  //         { title: 'Guides', href: '/guides' },
  //       ],
  //     },
  //     {
  //       groupTitle: 'Community',
  //       items: [
  //         { title: 'GitHub', href: 'https://github.com' },
  //         { title: 'Discord', href: 'https://discord.com' },
  //       ],
  //     },
  //     {
  //       groupTitle: 'Company',
  //       items: [
  //         { title: 'About Us', href: '/about' },
  //         { title: 'Careers', href: '/careers' },
  //       ],
  //     },
  //   ],
  // },
]
