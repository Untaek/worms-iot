import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CellContext } from '@tanstack/react-table'
import classNames from 'classnames'
import { useCallback, useRef, useState } from 'react'

type EditableSelectItem = {
  value: string
  label: string
}

type EditableSelectCellOptions = {
  items: EditableSelectItem[]
}

export const EditableSelectCell = ({ items }: EditableSelectCellOptions) => {
  return useCallback(
    (props: CellContext<any, any>) => (
      <EditableSelectCellComponent {...props} options={{ items }} />
    ),
    [items],
  )
}

type Props = CellContext<any, any> & {
  options: EditableSelectCellOptions
}

const EditableSelectCellComponent = ({
  getValue,
  options,
  table,
  row,
  column,
}: Props) => {
  const initialValue = useRef(getValue()).current
  const [value, setValue] = useState(initialValue || undefined)

  const onChangeValue = (val: string) => {
    setValue(val)
    table.options.meta?.updateData?.(row.index, column.id, val)
  }

  return (
    <div className="absolute inset-0 flex size-full">
      <Select value={value} onValueChange={onChangeValue}>
        <SelectTrigger
          className={classNames(
            'h-full rounded-none border-none bg-white outline-1 outline-sky-600 !ring-0 !ring-transparent focus:outline',
            {
              '!bg-sky-100': value !== initialValue,
            },
          )}
        >
          <SelectValue className="outline-none" />
        </SelectTrigger>
        <SelectContent>
          {options.items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
