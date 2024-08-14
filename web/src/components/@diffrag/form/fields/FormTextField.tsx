import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormTextType } from './type'
import { Textarea } from '@/components/ui/textarea'

export const FormTextField = ({ data }: FormFieldProps<FormTextType>) => {
  const context = useContext(FormContext)

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem className="pb-1">
          <FormLabel>{data.label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className="disabled:opacity-75"
              disabled={data.readOnly}
              placeholder={data.label}
              style={{
                height: data.height,
              }}
              defaultValue={data.default}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
