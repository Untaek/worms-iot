import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useContext } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormCheckboxGroupType } from './type'
import { Checkbox } from '@/components/ui/checkbox'

export const FormCheckboxGroupField = ({
  data,
}: FormFieldProps<FormCheckboxGroupType>) => {
  const context = useContext(FormContext)

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={() => (
        <FormItem>
          <FormLabel>{data.label}</FormLabel>
          {data.options.map((option) => {
            return (
              <FormField
                key={option.key}
                control={context.formProps.form?.control}
                name={data.key}
                render={({ field }) => (
                  <FormItem
                    key={option.key}
                    className="flex flex-row items-start space-x-2 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.key)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.key])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option.key,
                                ),
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel>{option.label || option.key}</FormLabel>
                  </FormItem>
                )}
              />
            )
          })}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
