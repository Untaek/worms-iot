import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormDateType } from './type'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { DateInput } from '../inputs/DateInput'

export const FormDateField = ({ data }: FormFieldProps<FormDateType>) => {
  const context = useContext(FormContext)

  const getDateObject = (field: ControllerRenderProps<FieldValues, string>) => {
    let date = new Date()

    if (field.value) {
      date = new Date(field.value)
    }

    if (typeof data.defaultHours === 'number') {
      date.setHours(data.defaultHours)
    }

    if (typeof data.defaultMinutes === 'number') {
      date.setMinutes(data.defaultMinutes)
    }

    return date
  }

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => {
        const dateObject = getDateObject(field)

        return (
          <FormItem className="grid w-[180px] gap-1 pb-1">
            <FormLabel>{data.label}</FormLabel>
            <DateInput
              value={field.value ? dateObject : undefined}
              onChange={(date) => field.onChange(date.toISOString())}
              timePicker={data.timePicker}
              isFormField
            />
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
