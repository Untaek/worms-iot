import BrowserCookie from 'js-cookie'

const customFetch: typeof fetch = async (params, init) => {
  const res = await fetch(params, init)

  /**
   * Client side 요청일 경우 새로운 token 받아오기
   * Server side 의 경우 middleware에서 token refresh 처리
   */
  if (typeof window === 'object') {
    if (res.status === 401) {
      const refreshToken = BrowserCookie.get('refresh_token')

      const { accessToken } = await api().auth.getToken({
        secure: false,
        headers: { Authorization: `Bearer ${refreshToken}` },
      })

      BrowserCookie.set('access_token', accessToken, {
        secure: true,
        sameSite: 'lax',
        expires: undefined,
      })

      return fetch(params, {
        ...init,
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    }

    if (res.status === 403) {
      BrowserCookie.remove('access_token')
      BrowserCookie.remove('refresh_token')
      // alert('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.')
      // location.href = '/login'
    }
  }

  return res
}

const api = <T>(
  fetchFunction = customFetch,
): Omit<Api<T>, 'abortRequest' | 'baseUrl' | 'request' | 'setSecurityData'> => {
  const instance = new Api({
    async securityWorker() {
      /**
       * fetchFunction이 window.fetch 일 경우에는
       * 인증 설정을 Skip 한다.
       */
      if (fetchFunction === fetch) {
        return
      }

      const token = BrowserCookie.get('access_token')

      if (!token) {
        return
      }

      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    },
    baseUrl: import.meta.env.VITE_API_HOST,
    baseApiParams: {
      format: 'json',
      secure: true,
      cache: 'no-store',
    },
    customFetch: fetchFunction,
  })

  return instance
}

const handleApiError = (error: unknown) => {
  const response = error as Response

  if (!(response instanceof Response)) {
    console.warn(response)
    return {
      status: 500,
      message: 'unexpected error',
    }
  }

  switch (response.status) {
    case 403:
      return {
        status: 403,
      }
  }
}

export { api, handleApiError }
