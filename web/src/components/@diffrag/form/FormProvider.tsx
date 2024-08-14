import React, { createContext, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldData, FormFieldType } from './fields/type'

type FormProps = {
  fields: FormFieldData[]
  form?: UseFormReturn
}

export type FormContextType<T = any> = {
  isShowDialog: boolean
  formProps: FormProps
  modifyTarget?: T
  showDialog: (show: boolean, target?: T) => void
  setFormProps: (props: FormProps) => void
}

export const FormContext = createContext<FormContextType>({
  isShowDialog: false,
  formProps: { fields: [] },
  showDialog() {},
  setFormProps() {},
})

type Props = {
  children: React.ReactNode
}

export const FormProvider = <T,>({ children }: Props) => {
  const [modifyTarget, setTarget] = useState<T>()
  const [isShowDialog, setIsShowDialog] = useState(false)
  const [formProps, __setFormProps] = useState<FormProps>({ fields: [] })

  const showDialog = (show: boolean, target?: T) => {
    setIsShowDialog(show)
    setTarget(target)

    const form = formProps.form

    if (!form) {
      return
    }

    if (target) {
      const copy = structuredClone(target)
      formProps.fields.forEach((field) => {
        if (field.type === FormFieldType.CHECKBOXGROUP) {
          copy[field.key] = []
        } else if (field.type === FormFieldType.CHECKBOX) {
          if (typeof copy[field.key] !== 'boolean') {
            copy[field.key] = false
          }
        }

        if (field.resolver) {
          copy[field.key] = field.resolver(target)
        }
      })
      form.reset(copy)
    } else {
      const clearObject = Object.fromEntries(
        formProps.fields.map((field) => {
          if (field.type === FormFieldType.CHECKBOXGROUP) {
            return [field.key, []]
          }
          if (field.type === FormFieldType.CHECKBOX) {
            return [field.key, false]
          }
          if (field.type === FormFieldType.DATE) {
            if (field.default) {
              return [field.key, new Date(field.default)]
            }
          }
          if (
            field.type === FormFieldType.STRING ||
            field.type === FormFieldType.COLOR ||
            field.type === FormFieldType.SELECT
          ) {
            if (typeof field.default === 'function') {
              return [field.key, field.default()]
            } else if (typeof field.default === 'string') {
              return [field.key, field.default]
            }
          }
          return [field.key, undefined]
        }),
      )
      form.reset(clearObject)
    }
  }

  const setFormProps = (props: FormProps) => {
    __setFormProps(props)
  }

  return (
    <FormContext.Provider
      value={{
        showDialog,
        setFormProps,
        isShowDialog,
        formProps,
        modifyTarget,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
