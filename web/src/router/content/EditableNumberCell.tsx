import { CellContext } from '@tanstack/react-table'
import classNames from 'classnames'
import { useCallback, useRef, useState } from 'react'

type EditableNumberCellOptions = {
  postfix?: string
  placeholder?: string
}

export const EditableNumberCell = (options?: EditableNumberCellOptions) => {
  return useCallback(
    (props: CellContext<any, any>) => (
      <EditableNumberCellComponent {...props} options={options} />
    ),
    [options],
  )
}

type Props = CellContext<any, any> & {
  options?: EditableNumberCellOptions
}

export const EditableNumberCellComponent = ({
  getValue,
  options,
  table,
  row,
  column,
}: Props) => {
  const initialValue = useRef(getValue()).current
  const [value, setValue] = useState(initialValue)

  const { placeholder, postfix } = options || {}

  const onChangeValue = (val: string) => {
    if (!val) {
      setValue(undefined)
      updateData(undefined)
      return
    }

    const num = Number(val)

    if (isNaN(num)) {
      setValue(value)
      updateData(value)
      return
    }

    setValue(num)
    updateData(num)
  }

  const updateData = (val?: number) => {
    table.options.meta?.updateData?.(row.index, column.id, val)
  }

  return (
    <div
      className={classNames('absolute inset-0 flex size-full bg-white', {
        '!bg-sky-100': initialValue !== value,
      })}
    >
      <input
        className="z-10 min-w-0 flex-1 bg-transparent p-3 pr-0 focus:outline"
        value={value}
        type="number"
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
      />

      {postfix && (
        <div className="flex items-center justify-center border-l bg-gray-50 px-2 text-gray-500">
          {postfix}
        </div>
      )}
    </div>
  )
}
