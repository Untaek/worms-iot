import { Input } from '../ui/input'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import useDebounce from '@/hooks/useDebounce'
import { Icon } from './Icon'

export const SearchBar = () => {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  useDebounce(search, {
    delay: 300,
    searchParamKey: 'q',
  })

  return (
    <div className="min-w-0">
      <div className="w-[400px] max-w-full">
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-2 top-2.5 size-5 text-muted-foreground"
          />
          <Input
            className="min-w-0 indent-6"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
