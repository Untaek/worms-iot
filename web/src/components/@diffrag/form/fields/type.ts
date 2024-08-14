import React from 'react'
import { CheckboxOption, SelectOption } from '../type'
import { FileWrapper } from './FormFileField'

export type FormFieldProps<F extends FormFieldData> = {
  data: F
}

export enum FormFieldType {
  NUMBER,
  STRING,
  TEXT,
  DATE,
  SELECT,
  CHECKBOXGROUP,
  CHECKBOX,
  FILE,
  CUSTOM_READ_ONLY,
  EMBED,
  COLOR,
  KEYWORDS,
}

export type FormFieldCommon<T = any, R = any> = {
  label: string
  key: string
  readOnly?: boolean
  resolver?: (data: T) => R | undefined
}

export type FormDateType<T = any> = FormFieldCommon<T, Date | string> & {
  type: FormFieldType.DATE
  timePicker?: boolean
  defaultHours?: number
  defaultMinutes?: number
  default?: Date | string
}
export type FormNumberType<T = any> = FormFieldCommon<T, number> & {
  type: FormFieldType.NUMBER
  default?: number
  placeholder?: number | string
}
export type FormStringType<T = any> = FormFieldCommon<T, string> & {
  type: FormFieldType.STRING
  default?: string | (() => string)
  placeholder?: number | string
}
export type FormTextType<T = any> = FormFieldCommon<T, string> & {
  type: FormFieldType.TEXT
  height?: number
  default?: string
}
export type FormSelectType<T = any> = FormFieldCommon<T, string | number> & {
  type: FormFieldType.SELECT
  options: SelectOption[]
  default?: string | number | (() => string | number | undefined)
  placeholder?: string
}
export type FormCheckboxGroupType<T = any> = FormFieldCommon<T> & {
  type: FormFieldType.CHECKBOXGROUP
  options: CheckboxOption[]
  default?: any
}
export type FormCheckboxType<T = any> = FormFieldCommon<T, boolean> & {
  type: FormFieldType.CHECKBOX
  default?: boolean
}
export type FormFileType<T = any> = FormFieldCommon<T> & {
  type: FormFieldType.FILE
  multiple?: boolean
  accept?: string
  default?: any
  crop?: {
    autoOpen?: boolean
    aspectRatio?: number
  }
  uploadHandler?: (file: FileWrapper) => Promise<any>
}
export type FormCustomReadOnlyType<T = any> = FormFieldCommon<
  T,
  React.ReactNode
> & {
  type: FormFieldType.CUSTOM_READ_ONLY
  isHidden?: (data: T) => any | Promise<any>
  render: (data?: T) => React.ReactNode
}
export type FormEmbedType<T = any> = FormFieldCommon<T> & {
  type: FormFieldType.EMBED
  src: string
  className?: string
  on?: (
    message: any,
    iframe: HTMLIFrameElement,
    state: T,
  ) => any | Promise<any> | undefined
}
export type FormColorType<T = any> = FormFieldCommon<T, string> & {
  type: FormFieldType.COLOR
  default?: string | (() => string)
}
export type FormKeywordsType<T = any> = FormFieldCommon<T, string[]> & {
  type: FormFieldType.KEYWORDS
}

export type FormFieldData<T = any> =
  | FormDateType<T>
  | FormNumberType<T>
  | FormStringType<T>
  | FormTextType<T>
  | FormSelectType<T>
  | FormCheckboxGroupType<T>
  | FormCheckboxType<T>
  | FormFileType<T>
  | FormCustomReadOnlyType<T>
  | FormEmbedType<T>
  | FormColorType<T>
  | FormKeywordsType<T>
