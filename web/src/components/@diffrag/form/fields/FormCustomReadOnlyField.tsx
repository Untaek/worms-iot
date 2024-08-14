import { FormItem, FormLabel } from '@/components/ui/form'
import { FormCustomReadOnlyType, FormFieldProps } from './type'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { FormContext } from '../FormProvider'

export const FormCustomReadOnlyField = ({
  data,
}: FormFieldProps<FormCustomReadOnlyType>) => {
  const { modifyTarget } = useContext(FormContext)
  const [isHidden, setIsHidden] = useState(!!data.isHidden)
  const __DEV_EFFEECT_CALLED_ONCE__ = useRef(false)

  useLayoutEffect(() => {
    if (__DEV_EFFEECT_CALLED_ONCE__.current) {
      return
    }

    __DEV_EFFEECT_CALLED_ONCE__.current = true

    const func = async () => {
      if (modifyTarget) {
        if (data.isHidden) {
          const _isHidden = await data.isHidden?.(modifyTarget)
          setIsHidden(!_isHidden)
        }
      }
    }

    func()
  }, [data, modifyTarget])

  if (isHidden) {
    return null
  }

  return (
    <FormItem className="">
      <FormLabel>{data.label}</FormLabel>
      <div>{data?.render?.(modifyTarget)}</div>
    </FormItem>
  )
}
