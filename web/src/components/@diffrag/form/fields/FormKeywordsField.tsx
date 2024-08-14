import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useContext, useRef, useState } from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormKeywordsType } from './type'
import { Badge } from '@/components/ui/badge'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { XIcon } from 'lucide-react'

export const FormKeywordsField = ({
  data,
}: FormFieldProps<FormKeywordsType>) => {
  const context = useContext(FormContext)
  const textInput = useRef<HTMLInputElement>(null)
  const [text, setText] = useState('')

  const onAdd = (field: ControllerRenderProps<FieldValues, string>) => {
    const trimed = text.trim()
    if (field.value?.includes(trimed)) {
      toast.info('이미 존재하는 키워드입니다.')
      return
    }

    if (!trimed) {
      textInput.current?.focus()
      setText(trimed)
      return
    }

    field.onChange([...(field.value || []), trimed])
    setText('')
    textInput.current?.focus()
  }

  const onRemove = (
    field: ControllerRenderProps<FieldValues, string>,
    keyword: string,
  ) => {
    field.onChange([
      ...(field.value || []).filter((k: string) => k !== keyword),
    ])
  }

  return (
    <FormField
      control={context.formProps.form?.control}
      key={data.key}
      name={data.key}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{data.label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1 bg-gray-50 p-4">
                {!field.value?.length ? (
                  <span className="text-sm text-gray-600">
                    내용이 없습니다.
                  </span>
                ) : (
                  field.value?.map((keyword: string) => {
                    return (
                      <Badge key={keyword} variant="outline">
                        <span className="mr-1">{keyword}</span>
                        <XIcon
                          size={14}
                          onClick={() => onRemove(field, keyword)}
                          className="cursor-pointer"
                        />
                      </Badge>
                    )
                  })
                )}
              </div>
              {!data.readOnly && (
                <div className="flex w-52 gap-1">
                  <Input
                    ref={textInput}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="disabled:opacity-100"
                    placeholder={data.label}
                    onKeyDown={(e) => {
                      if (!e.nativeEvent.isComposing && e.key === 'Enter') {
                        e.preventDefault()
                        onAdd(field)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onAdd(field)}
                  >
                    추가
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
