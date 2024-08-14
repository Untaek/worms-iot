import { OffsetPaginationParams, OffsetPaginationRO } from '@/type'
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { useMemo } from 'react'
import useIntersect from './useIntersect'

type Options<T, P = OffsetPaginationParams> = {
  id: string
  fn: (params: P) => Promise<OffsetPaginationRO<T>>
  params: P
  enabled?: boolean
}

export const useOffsetInfiniteList = <
  T,
  P extends OffsetPaginationParams = OffsetPaginationParams,
>({
  id,
  fn,
  params,
  enabled,
}: Options<T, P>) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<OffsetPaginationRO<T>>({
    queryKey: [id, params],
    queryFn: ({ queryKey, pageParam }) => {
      const page = (pageParam as number) || 1
      return fn({ ...(queryKey[1] as P), page })
    },
    enabled: enabled,
    initialPageParam: undefined,
    getNextPageParam: (current, pages) =>
      current.items.length === params.amount ? pages.length + 1 : undefined,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnMount: true,
    refetchOnReconnect: false,
    placeholderData: keepPreviousData,
  })

  const rows = useMemo(() => {
    return data?.pages.flat() || []
  }, [data])

  const listBottom = useIntersect(
    () => {
      if (isFetching || isFetchingNextPage) {
        return
      }

      if (!hasNextPage) {
        return
      }

      fetchNextPage()
    },
    { rootMargin: '400px' },
  )

  return {
    pages: data?.pages.at(-1)?.pages || [],
    currentPage: data?.pages.at(-1)?.currentPage || 1,
    total: data?.pages.at(-1)?.total || 0,
    rows,
    listBottom,
    refetch,
  }
}
