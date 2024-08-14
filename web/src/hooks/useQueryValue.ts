import { useSearchParams } from 'react-router-dom'

export const useQueryValues = () => {
  const [searchParams] = useSearchParams()
  const get = <T extends string | number>(key: string, defaultValue: T): T => {
    let formatter: (val: string | number | null) => T

    if (typeof defaultValue === 'number') {
      formatter = ((val) => (val !== null ? Number(val) : defaultValue)) as (
        val: string | number | null,
      ) => T
    } else {
      formatter = ((val) => (val !== null ? String(val) : defaultValue)) as (
        val: string | number | null,
      ) => T
    }

    return formatter(searchParams.get(key))
  }

  return {
    get,
  }
}

export const useQueryValue = <T extends string | number>(
  key: string,
  defaultValue: T,
) => {
  const values = useQueryValues()
  return values.get(key, defaultValue)
}
