import { Checkbox } from '@/components/ui/checkbox'
import { CellContext } from '@tanstack/react-table'
import classNames from 'classnames'
import { useRef, useState } from 'react'

type Props = CellContext<any, any>

export const EditableCheckboxCell = ({
  getValue,
  table,
  row,
  column,
}: Props) => {
  const initialValue = useRef(getValue()).current
  const [value, setValue] = useState(initialValue)

  const onChangeValue = (val: boolean) => {
    setValue(val)
    table.options.meta?.updateData?.(row.index, column.id, val)
  }

  return (
    <div
      className={classNames(
        'absolute inset-0 flex size-full items-center justify-center bg-white',
        {
          '!bg-sky-100': initialValue !== value,
        },
      )}
    >
      <Checkbox
        checked={value}
        onCheckedChange={onChangeValue}
        className="size-6"
      />
    </div>
  )
}
