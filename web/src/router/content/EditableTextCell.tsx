import { CellContext } from '@tanstack/react-table'
import classNames from 'classnames'
import { useRef, useState } from 'react'

type Props = CellContext<any, any>

export const EditableTextCell = ({ getValue, table, row, column }: Props) => {
  const initialValue = useRef(getValue()).current
  const [value, setValue] = useState(initialValue)

  const onChangeValue = (val: string) => {
    setValue(val)
    table.options.meta?.updateData?.(row.index, column.id, val)
  }

  return (
    <div
      className={classNames('absolute inset-0 flex size-full bg-white', {
        '!bg-sky-100': initialValue !== value,
      })}
    >
      <input
        className="w-full min-w-0 bg-transparent p-3 focus:outline"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  )
}
