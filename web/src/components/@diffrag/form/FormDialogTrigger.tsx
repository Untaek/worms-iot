import { Button } from '@/components/ui/button'
import React, { useContext } from 'react'
import { FormContext } from './FormProvider'

type Props<T> = {
  children: React.ReactNode
  target?: T | Promise<T>
}

export const FormDialogTriggerButton = <T,>({ children, target }: Props<T>) => {
  const context = useContext(FormContext)

  const onClickButton = async () => {
    if (typeof target === 'function') {
      context.showDialog(true, await target())
    } else {
      context.showDialog(true, target)
    }
  }

  return (
    <Button type="button" onClick={onClickButton}>
      {children}
    </Button>
  )
}
