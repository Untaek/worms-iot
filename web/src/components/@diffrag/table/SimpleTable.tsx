import { Button } from '../../ui/button'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '../../ui/table'
import { useCallback, useContext, useMemo } from 'react'
import { SearchBar } from '../SearchBar'
import { FormContext } from '../form/FormProvider'
import { Icon, IconName } from '../Icon'
import classNames from 'classnames'
import { SimpleTableCellRenderer } from './SimpleTableCellRenderer'
import { Column } from './type'

type ActionButton<T> = {
  icon?: IconName
  label?: string
  onClick?: (row: T) => void
}

type Props<T> = {
  columns: Column<T>[]
  data?: T[]
  rowButtons?: ActionButton<T>[]
  options?: {
    disableNew?: boolean
    disableSearch?: boolean
    disableEdit?: boolean
  }
  rowStyle?: {
    background?: ((v: T) => string | undefined) | string | undefined
  }
}

export const SimpleTable = <T,>({
  columns,
  options = { disableNew: false, disableSearch: false },
  rowButtons = [],
  data = [],
  rowStyle = {},
}: Props<T>) => {
  const context = useContext(FormContext)

  const fields = context.formProps.fields
  const isShowForm = fields.length > 0

  const onClickEdit = useCallback(
    (row: T) => {
      context.showDialog(true, row)
    },
    [context],
  )

  const onClickCreate = () => {
    context.showDialog(true)
  }

  const realButtons: ActionButton<T>[] = useMemo(() => {
    if (!isShowForm) {
      return rowButtons
    }

    if (options.disableEdit) {
      return rowButtons
    }

    return [{ icon: 'pencil', onClick: onClickEdit }, ...rowButtons]
  }, [isShowForm, rowButtons, onClickEdit, options.disableEdit])

  const rowBackground = (row: T) => {
    return typeof rowStyle.background === 'string'
      ? rowStyle.background
      : rowStyle.background?.(row)
  }

  const isShowCreateNew = !options.disableNew && isShowForm
  const isShowActionBar = !options.disableSearch || isShowCreateNew

  return (
    <div className="space-y-3">
      {isShowActionBar && (
        <div className="relative flex w-full items-center justify-between gap-3">
          {!options.disableSearch && <SearchBar />}
          {isShowCreateNew && (
            <div className="-my-4">
              <Button onClick={onClickCreate}>새로 만들기</Button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => {
                return (
                  <TableHead
                    key={c.key.toString()}
                    className="h-11 whitespace-nowrap font-medium"
                  >
                    {c.label}
                  </TableHead>
                )
              })}
              {isShowForm && (
                <TableHead className="h-11 whitespace-nowrap font-medium" />
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data?.length ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="space-x-2 py-16 text-center text-muted-foreground"
                >
                  <Icon
                    name="info"
                    className="mx-auto -mt-1 inline size-5 align-middle"
                  />
                  <span className="text-base">검색 결과가 없습니다.</span>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    style={{
                      background: rowBackground(row),
                    }}
                  >
                    {columns.map((c) => {
                      return (
                        <SimpleTableCellRenderer
                          key={c.key.toString()}
                          data={row}
                          column={c}
                        />
                      )
                    })}
                    {realButtons.length > 0 && (
                      <TableCell className="space-x-2 whitespace-nowrap py-0 text-right">
                        {realButtons.map((button, i) => {
                          return (
                            <Button
                              key={i}
                              variant="outline"
                              size="icon"
                              type="button"
                              className={classNames(
                                `size-9 text-muted-foreground`,
                                {
                                  'w-fit px-2 gap-0.5': !!button.label,
                                },
                              )}
                              onClick={() => button.onClick?.(row)}
                            >
                              {button.icon && (
                                <Icon name={button.icon} size={14} />
                              )}
                              {button.label && (
                                <span className="text-xs">{button.label}</span>
                              )}
                            </Button>
                          )
                        })}
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
