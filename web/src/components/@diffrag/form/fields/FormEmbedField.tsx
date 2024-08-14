import { FormItem, FormLabel } from '@/components/ui/form'
import { useContext, useEffect, useRef } from 'react'
import { FormContext } from '../FormProvider'
import { FormEmbedType, FormFieldProps } from './type'

export const FormEmbedField = ({ data }: FormFieldProps<FormEmbedType>) => {
  const { modifyTarget, formProps } = useContext(FormContext)
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (data.on) {
      const onEvent = async (event: MessageEvent) => {
        const res = await data.on?.(event.data, ref.current!, modifyTarget)

        if (typeof res !== 'undefined') {
          formProps.form?.setValue(data.key, res)
        }
      }

      window.addEventListener('message', onEvent)

      return () => {
        window.removeEventListener('message', onEvent)
      }
    }
  }, [data, formProps])

  return (
    <FormItem className="">
      <FormLabel>{data.label}</FormLabel>
      <iframe ref={ref} src={data.src} className={data.className} />
    </FormItem>
  )
}
