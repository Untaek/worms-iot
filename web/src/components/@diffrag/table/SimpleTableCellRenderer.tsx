import { TableCell } from '@/components/ui/table'
import { Column } from './type'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

type Props<T> = {
  column: Column<T>
  data: T
}

export const SimpleTableCellRenderer = React.memo(
  <T,>({ data, column }: Props<T>) => {
    const pending = useRef(false)
    const [promiseResult, setPromiseResult] = useState<any>()

    const value = useMemo(() => {
      const [key, ...path] = column.key.split('.')
      let _value = data[key]

      if (path) {
        for (const k of path) {
          if (!_value) {
            return undefined
          }

          _value = _value[k]
        }
      }

      return _value
    }, [data, column])

    useLayoutEffect(() => {
      if (column.formatter) {
        if (pending.current) {
          return
        }

        let _value: any | Promise<any> = value

        if (column.valueMap && typeof value === 'string') {
          _value = column.valueMap[value]
        }

        const isPromise = column.formatter(_value, value)

        if (isPromise instanceof Promise) {
          pending.current = true
          isPromise.then((v) => {
            setPromiseResult(v)
            pending.current = false
          })
        } else {
          setPromiseResult(isPromise)
        }
      }
    }, [column, data, value])

    const formattedValue = useMemo(() => {
      let _value: any | Promise<any> = value

      if (column.valueMap && typeof value === 'string') {
        _value = column.valueMap[value]
      }

      if (column.formatter) {
        if (promiseResult) {
          _value = promiseResult
        } else {
          return
        }
      }

      return _value
    }, [column, promiseResult, value])

    return (
      <TableCell
        key={column.key.toString()}
        className="h-11 whitespace-nowrap py-0"
      >
        {(formattedValue || column.fallback) ?? '-'}
      </TableCell>
    )
  },
)
