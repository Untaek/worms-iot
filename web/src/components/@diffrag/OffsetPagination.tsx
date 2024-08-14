import React, { useMemo } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '../ui/pagination'

type Props = {
  page: number
  pages: number[]
  prevPagesEntry?: number
  nextPagesEntry?: number
  pageQueryKey?: string
  onChange?: (page: number) => void
}

export const OffsetPagination = React.memo(
  ({
    page,
    pages,
    prevPagesEntry,
    nextPagesEntry,
    pageQueryKey = 'page',
    onChange,
  }: Props) => {
    const link = (i: number) => {
      const nextState = new URL(location.href)
      if (onChange) {
        return nextState.toString()
      }

      nextState.searchParams.set(pageQueryKey, i.toString())
      return nextState.toString()
    }

    const safePages = useMemo(() => {
      if (pages.length === 0) {
        return [1]
      }

      return pages
    }, [pages])

    return (
      <Pagination>
        <PaginationContent>
          {prevPagesEntry && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onChange?.(prevPagesEntry)}
                to={link(prevPagesEntry)}
              />
            </PaginationItem>
          )}

          {safePages.map((i) => {
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => onChange?.(i)}
                  to={link(i)}
                  isActive={page === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          {nextPagesEntry && (
            <PaginationItem>
              <PaginationNext
                onClick={() => onChange?.(nextPagesEntry)}
                to={link(nextPagesEntry)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    )
  },
)
