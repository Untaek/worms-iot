import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormSelectType } from './type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const FormSelectField = ({ data }: FormFieldProps<FormSelectType>) => {
  const context = useContext(FormContext)

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{data.label}</FormLabel>
          <Select
            onValueChange={(v) => {
              let _v: any = v
              if (typeof data.options[0].value === 'number') {
                _v = Number(v)
              }
              field.onChange(_v)
            }}
            defaultValue={
              field.value?.toString() ||
              (typeof data.default === 'function'
                ? data.default?.(context.modifyTarget)
                : data.default
              )?.toString()
            }
            disabled={data.readOnly}
          >
            <FormControl>
              <SelectTrigger className="w-[180px] disabled:opacity-75">
                <SelectValue placeholder={data.placeholder || data.label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.options.map((option) => {
                return (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label || option.value}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
