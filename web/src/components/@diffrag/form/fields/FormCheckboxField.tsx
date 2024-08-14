import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormCheckboxType } from './type'
import { Checkbox } from '@/components/ui/checkbox'

export const FormCheckboxField = ({
  data,
}: FormFieldProps<FormCheckboxType>) => {
  const context = useContext(FormContext)

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem className="pt-2">
          <FormLabel className="mb-1 block" onClick={(e) => e.preventDefault()}>
            {data.label}
          </FormLabel>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="size-5"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
