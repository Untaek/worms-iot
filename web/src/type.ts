export type OAuthProvider = 'KAKAO' | 'GOOGLE' | 'APPLE'

export type AuthStatus = 'INACTIVE' | 'ACTIVE'

export type AuthResponse = {
  accessToken: string
  status: AuthStatus
  oAuthId: string
  oAuthProvider: OAuthProvider
  resignCancelled?: boolean
}

export type User = {
  id: number
  nickname: string
  username: string
  email: string
  status: AuthStatus
  nationId: number
  thumbnail?: string
  oAuthProvider: OAuthProvider
  oldUsername?: string
  role: string
}

export interface Crop {
  x: number
  y: number
  width: number
  height: number
}

export interface OffsetPaginationParams {
  amount: number
  page: number
}

export interface OffsetPaginationRO<T> {
  items: T[]
  pages: number[]
  currentPage: number
  total: number
}
