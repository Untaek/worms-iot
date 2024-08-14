import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

type Options<T, P> = {
  id: string
  fn: (args: P) => Promise<T>
  params?: P
  onDataChangeCallback?: (data: T) => void
}

export const useApi = <T, P>({
  id,
  params,
  fn,
  onDataChangeCallback,
}: Options<T, P>) => {
  const { data, refetch } = useQuery({
    queryKey: params ? [id, params] : [id],
    queryFn: (args) => fn(args.queryKey[1] as P),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (data) {
      onDataChangeCallback?.(data)
    }
  }, [data])

  return {
    data,
    refetch,
  }
}
