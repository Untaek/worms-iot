import {
  BarChartIcon,
  FileIcon,
  HomeIcon,
  PieChart,
} from 'lucide-react'

import { useAuth } from '../providers/user.provider'
import { NavLink, Outlet } from 'react-router-dom'
import classnames from 'classnames'
import React, { useState } from 'react'
import classNames from 'classnames'
import { Avatar } from '@/components/ui/avatar'
import { Header } from '@/components/layout/Header'

const year = new Date().getFullYear()

export const navs: Nav[] = [
  {
    icon: <BarChartIcon className="size-4" />,
    label: '기본',
    header: true,
  },
  {
    to: '/',
    label: '대시보드',
    icon: <PieChart className="size-4" />,
  },
]

type Nav = {
  icon?: React.ReactNode
  to?: string
  label: string
  header?: boolean
}

export default function Root() {
  const auth = useAuth()
  const [isOpenSidebar, setIsOpenSidebar] = useState(true)

  return (
    <div
      className={classNames('grid h-screen w-screen', {
        'md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]': isOpenSidebar,
        'grid-cols-[72px_1fr]': !isOpenSidebar,
      })}
    >
      <div className="hidden border-r bg-gray-50 md:block">
        <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            {isOpenSidebar ? (
              <NavLink to="/" className="flex items-center gap-2 font-semibold">
                <span className="">Worms-iot</span>
              </NavLink>
            ) : (
              <NavLink to="/">
                <HomeIcon size={20} />
              </NavLink>
            )}
          </div>
          <div className="flex-1 py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navs.map((link, i) => {
                if (link.header) {
                  return (
                    <h2
                      key={link.label}
                      className={classNames(
                        'mb-2 inline-flex items-center gap-2 text-base font-medium tracking-tight',
                        {
                          'mx-auto': !isOpenSidebar,
                        },
                      )}
                    >
                      {link.icon && <div className="mb-0.5">{link.icon}</div>}
                      {isOpenSidebar && link.label}
                    </h2>
                  )
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      classnames(
                        'group mb-1 flex h-9 items-center gap-3 rounded-lg px-3 text-sm tracking-tight text-muted-foreground transition-all hover:bg-muted hover:text-primary',
                        {
                          'bg-muted text-primary': isActive,
                          'justify-center': !isOpenSidebar,
                          'mb-6': navs[i + 1]?.header,
                        },
                      )
                    }
                  >
                    {isOpenSidebar && <span>{link.label}</span>}
                    {!isOpenSidebar &&
                      (link.icon || <FileIcon className="size-4" />)}
                    {!isOpenSidebar && (
                      <div className="pointer-events-none absolute left-[95%] hidden whitespace-nowrap rounded bg-black/70 p-2 leading-none text-white group-hover:block">
                        {link.label}
                      </div>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
          <div className="mt-auto flex items-end justify-between p-4 text-sm text-muted-foreground">
            {isOpenSidebar && (
              <a href="https://diffrag.com" target="_blank">
                © {year}. Diffrag
              </a>
            )}

            {/* <Button
              variant="ghost"
              className="ml-auto h-auto p-2"
              onClick={() => setIsOpenSidebar((prev) => !prev)}
            >
              {isOpenSidebar ? <PanelLeftClose /> : <PanelRightClose />}
            </Button> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />

        <main className="flex w-full max-w-[100vw] flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
