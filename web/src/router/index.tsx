import React from 'react'
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom'
import Root from '@/router/Root'
import { useUser } from '@/providers/user.provider'
import { Error404 } from '@/router/error/Error404'
import { Setting } from './Setting'
import { ContentView } from '@/components/layout/ContentView'
import { create } from 'zustand'
import { Dashboard } from './content/Dashboard'

type ProtectedProps = {
  children: React.ReactNode
}

type ProtectedRouteObject = RouteObject & {
  protect?: boolean
  blockUser?: boolean
}

const Protected = ({ children }: ProtectedProps) => {
  const user = useUser()

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

const BlockUser = ({ children }: ProtectedProps) => {
  const user = useUser()

  if (user) {
    return <Navigate to="/" />
  }

  return children
}

const routes: ProtectedRouteObject[] = [
  {
    path: '/',
    element: <Root />,
    protect: false,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/settings', element: <Setting /> },
    ],
  },
  {
    path: '*',
    element: <Error404 />,
  },
]

export const router = createBrowserRouter(
  routes.map(({ protect, blockUser, ...route }) => {
    if (protect) {
      route.element = <Protected>{route.element}</Protected>
    }

    if (blockUser) {
      route.element = <BlockUser>{route.element}</BlockUser>
    }

    return route
  }),
)

type RouteInfoStore = {
  title: string
  setTitle: (title: string) => void
}

export const useRouteInfo = create<RouteInfoStore>((set) => ({
  title: '',
  setTitle(title) {
    set({ title })
  },
}))
