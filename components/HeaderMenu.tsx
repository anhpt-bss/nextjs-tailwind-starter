import Link from 'next/link'

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { headerNavLinks } from '@/data/navLinks'
import { UserResponse } from '@/types/user'

interface HeaderMenuProps {
  user?: UserResponse
}

export default function HeaderMenu({ user }: HeaderMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {headerNavLinks.map((item) => {
          if (item.isPrivate && !user) return null
          return (
            <NavigationMenuItem key={item?.title}>
              {item?.children || item?.mega ? (
                <>
                  <NavigationMenuTrigger className="font-medium">
                    {item?.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {item?.mega ? (
                      <div className="grid w-[600px] grid-cols-3 gap-4 p-4">
                        {item?.groups?.map((group) => (
                          <div key={group?.groupTitle}>
                            <h4 className="mb-2 font-semibold">{group?.groupTitle}</h4>
                            <ul className="space-y-1">
                              {group?.items.map((link) => (
                                <li key={link.title}>
                                  <NavigationMenuLink asChild>
                                    <Link href={link.href}>{link.title}</Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="w-[300px] p-4">
                        {item?.children?.map((child) => (
                          <li key={child.title} className="mb-2">
                            <NavigationMenuLink asChild>
                              <Link href={child.href}>
                                <div className="font-medium">{child.title}</div>
                                {child.description && (
                                  <p className="text-muted-foreground text-xs">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link href={item?.href || '#'} className="font-medium">
                    {item?.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
