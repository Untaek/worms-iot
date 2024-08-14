import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

type DebounceOptions<T> = {
  delay?: number
  searchParamKey?: string
}

function useDebounce<T>(
  value: T,
  options: DebounceOptions<T> = { delay: 500, searchParamKey: '' },
): T {
  const timeout = useRef<NodeJS.Timeout>()
  const mounted = useRef(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (!mounted.current) {
      setTimeout(() => {
        mounted.current = true
      }, options.delay)
      return
    }

    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }

    timeout.current = setTimeout(() => {
      setDebouncedValue(value)

      if (options.searchParamKey) {
        if (typeof value === 'string' || typeof value === 'number') {
          const state = new URLSearchParams(searchParams)
          state.set(options.searchParamKey, value.toString())
          setSearchParams(state)
        }
      }
    }, options.delay)

    return () => {
      clearTimeout(timeout.current)
      timeout.current = undefined
    }
  }, [value, options.delay, options.searchParamKey])

  return debouncedValue
}

export default useDebounce
