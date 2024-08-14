import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormStringType } from './type'

export const FormStringField = ({ data }: FormFieldProps<FormStringType>) => {
  const context = useContext(FormContext)

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
              className="disabled:opacity-100"
              disabled={data.readOnly}
              placeholder={data.placeholder?.toString() || data.label}
              defaultValue={
                typeof data.default === 'function'
                  ? data.default()
                  : data.default
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
