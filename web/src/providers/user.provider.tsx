'use client'

import React, {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { User } from '@/type'
import BrowerCookie from 'js-cookie'
import { decodeJwt } from 'jose'

type UserContextType = {
  user?: User
  sync: () => User | undefined
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  sync: function (): User | undefined {
    throw new Error('Function not implemented.')
  },
  logout: function (): void {
    throw new Error('Function not implemented.')
  },
})

type Props = {
  children?: React.ReactNode
}

export const useUser = () => {
  return useContext(UserContext).user
}

export const useAuth = () => useContext(UserContext)

export const UserProvider = ({ children }: Props) => {
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState<User>()

  const sync = useCallback(() => {
    const token = BrowerCookie.get('access_token')

    if (!token) {
      return
    }

    const payload = decodeJwt<User>(token)

    // if (payload.role !== 'ADMIN') {
    //   BrowerCookie.remove('access_token')
    //   BrowerCookie.remove('refresh_token')
    //   setUser(undefined)
    //   return
    // }

    setUser(payload)
    return payload
  }, [])

  const logout = useCallback(() => {
    BrowerCookie.remove('access_token')
    BrowerCookie.remove('refresh_token')
    setUser(undefined)
  }, [])

  useEffect(() => {
    sync()
    setLoaded(true)
  }, [sync])

  return (
    <Fragment>
      <UserContext.Provider value={{ user, sync, logout }}>
        {loaded && children}
      </UserContext.Provider>
    </Fragment>
  )
}
