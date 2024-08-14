import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useContext, useLayoutEffect } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormNumberType } from './type'

export const FormNumberField = ({ data }: FormFieldProps<FormNumberType>) => {
  const context = useContext(FormContext)

  useLayoutEffect(() => {
    if (typeof data.default === 'number') {
      context.formProps.form?.setValue(data.key, data.default)
    }
  }, [])

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{data.label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={data.readOnly}
              className="disabled:opacity-75"
              placeholder={data.placeholder?.toString() || data.label}
              defaultValue={data.default}
              onChange={(e) => {
                if (!e.target.value) {
                  field.onChange(undefined)
                  return
                }

                const val = Number(e.target.value)

                if (isNaN(val)) {
                  field.onChange(field.value)
                  return
                }

                field.onChange(val)
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
