export type Column<T> = {
  label: string
  key: PathsToProps<T, string | number | Date>
  valueMap?: Record<string, string>
  fallback?: string | number
  formatter?: (
    value: any,
    rawValue: any,
  ) => React.ReactNode | Promise<React.ReactNode>
}

type PathsToProps<T, V> = T extends V
  ? ''
  : {
      [K in Extract<keyof T, string>]: Dot<K, PathsToProps<T[K], V>>
    }[Extract<keyof T, string>]

type Dot<T extends string, U extends string> = '' extends U ? T : `${T}.${U}`
