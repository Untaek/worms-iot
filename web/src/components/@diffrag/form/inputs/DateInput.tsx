import { FormControl } from '@/components/ui/form'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import { ko } from 'date-fns/locale'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { TimePicker } from '../../TimePicker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useMemo } from 'react'
import classNames from 'classnames'

type Props = {
  className?: string
  timePicker?: boolean
  value?: Date
  onChange?: (value: Date) => void
  isFormField?: boolean
}

export const DateInput = ({
  className,
  timePicker,
  value,
  isFormField,
  onChange,
}: Props) => {
  const button = useMemo(() => {
    const content = (
      <Button
        variant="outline"
        className={classNames('justify-normal gap-3', className)}
      >
        <CalendarIcon className="size-4 text-muted-foreground" />
        {value ? (
          dayjs(value).format(timePicker ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD')
        ) : (
          <span className="text-muted-foreground">날짜 선택</span>
        )}
      </Button>
    )

    if (isFormField) {
      return <FormControl>{content}</FormControl>
    }

    return content
  }, [isFormField, value, timePicker])

  return (
    <Popover>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent
        className={classNames('mt-2 w-auto rounded border bg-white p-0')}
        align="start"
      >
        <Calendar
          initialFocus
          locale={ko}
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(d) => {
            if (d) {
              const date = new Date(d)
              date.setHours(value?.getHours() ?? 0, value?.getMinutes() ?? 0)
              onChange?.(date)
            }
          }}
        />
        {timePicker && (
          <div className="border-t">
            <TimePicker
              hours={value?.getHours() ?? 0}
              minutes={value?.getMinutes() ?? 0}
              onChange={(hours, minutes) => {
                const date = value ? new Date(value) : new Date()
                date.setHours(hours, minutes)
                onChange?.(date)
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
