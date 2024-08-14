import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useContext, useState } from 'react'
import { FormContext } from '../FormProvider'
import { FormColorType, FormFieldProps } from './type'
import { HexColorPicker } from 'react-colorful'

export const FormColorField = ({ data }: FormFieldProps<FormColorType>) => {
  const context = useContext(FormContext)
  const [color, setColor] = useState(
    context.formProps.form?.getValues()[data.key],
  )

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{data.label}</FormLabel>
          <FormControl>
            <div className="w-min space-y-2">
              <HexColorPicker
                color={color}
                onChange={(c) => {
                  field.onChange(c)
                  setColor(c)
                }}
              />
              <Input
                {...field}
                value={color}
                onChange={(e) => {
                  field.onChange(e.target.value)
                  setColor(e.target.value)
                }}
                className="disabled:opacity-100"
                disabled={data.readOnly}
                placeholder={data.label}
                defaultValue={
                  typeof data.default === 'function'
                    ? data.default()
                    : data.default
                }
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
