import classnames from 'classnames'
import { NavLink, useNavigate } from 'react-router-dom'
import { SheetTrigger, SheetContent, Sheet } from '../ui/sheet'
import { Button } from '../ui/button'
import { CircleUser, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Icon } from '../@diffrag/Icon'
import { useAuth } from '@/providers/user.provider'
import { useState } from 'react'
import { useRouteInfo } from '@/router'
import { navs } from '@/nav'

const year = new Date().getFullYear()

export const Header = () => {
  const auth = useAuth()
  const route = useRouteInfo()
  const navigate = useNavigate()
  const [drawer, openDrawer] = useState(false)

  const onClickSetting = () => {
    navigate('/settings')
  }

  const onClickLogout = () => {
    auth.logout()
  }
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-gray-50 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={drawer} onOpenChange={openDrawer}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid h-full gap-2 pb-4 text-lg font-medium">
            <ul>
              <NavLink
                to="/"
                onClick={() => openDrawer(false)}
                className="mb-5 flex items-center gap-2 text-base font-semibold"
              >
                <span className="">admin-template</span>
              </NavLink>
              {navs
                .filter((link) => link.to)
                .map((link) => {
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => openDrawer(false)}
                      className={({ isActive }) =>
                        classnames(
                          'text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2',
                          {
                            'bg-muted text-primary': isActive,
                          },
                        )
                      }
                    >
                      {link.icon}
                      {link.label}
                    </NavLink>
                  )
                })}
            </ul>

            <div className="text-muted-foreground mt-auto text-sm">
              <a href="https://diffrag.com" target="_blank">
                © {year}. Diffrag
              </a>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        <h1 className="text-xl font-bold">{route.title}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="gap-2 rounded-full">
            <CircleUser className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{auth.user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClickSetting} className="space-x-1.5">
            <Icon name="user" className="size-4" />
            <span>내 프로필</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClickLogout} className="space-x-1.5">
            <Icon name="log-out" className="size-4" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
