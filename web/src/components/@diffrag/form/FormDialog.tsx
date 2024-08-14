import { Button, ButtonProps } from '@/components/ui/button'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useContext, useLayoutEffect } from 'react'
import { FormContext, FormContextType } from './FormProvider'
import { FormNumberField } from './fields/FormNumberField'
import { FormStringField } from './fields/FormStringField'
import { FormFieldData, FormFieldType } from './fields/type'
import { FormTextField } from './fields/FormTextField'
import { FormDateField } from './fields/FormDateField'
import { FormSelectField } from './fields/FormSelectField'
import { FormCheckboxField } from './fields/FormCheckboxField'
import { FormCheckboxGroupField } from './fields/FormCheckboxGroupField'
import { FormFileField } from './fields/FormFileField'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { FormCustomReadOnlyField } from './fields/FormCustomReadOnlyField'
import { FormEmbedField } from './fields/FormEmbedField'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { FormColorField } from './fields/FormColorField'
import { FormKeywordsField } from './fields/FormKeywordsField'

type FormDialogButton = {
  text: string
  id: string
  variant?: ButtonProps['variant']
}

type Props<T, S extends z.Schema<any, any>> = {
  title: string
  fields: FormFieldData<T>[]
  data?: T[]
  schema?: S
  actions?: {
    create?: (data: z.TypeOf<S>) => Promise<void>
    update?: (data: z.TypeOf<S>, id: any) => Promise<void>
    delete?: (id: any) => Promise<void>
    onButton?: (buttonId: string, data: T) => Promise<void>
  }
  buttons?: FormDialogButton[]
  Context?: React.Context<FormContextType<any>>
  modal?: boolean
}

export const FormDialog = <T, S extends z.Schema<any, any> = any>({
  fields = [],
  schema = z.object({}),
  title = '편집',
  actions,
  buttons,
  Context = FormContext,
  modal = true,
}: Props<T, S>) => {
  const context = useContext(Context)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const isCreate = !context.modifyTarget

  const onClickDelete = async () => {
    await actions?.delete?.(context.modifyTarget.id)
    toast.success('삭제 되었습니다.', { dismissible: true })
    context.showDialog(false)
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    // const data = form.getValues()

    const data = values

    console.log(values)

    const fields = context.formProps.fields

    for (const field of fields) {
      const fieldData = data[field.key]

      if (field.type === FormFieldType.FILE) {
        if (field.uploadHandler && fieldData) {
          console.log(field.key, data[field.key])
          if (fieldData[0] && 'file' in fieldData[0]) {
            const [asset] = await field.uploadHandler(fieldData[0])
            data[field.key] = asset
            console.log(asset)
          }
        }
      }
    }

    if (isCreate) {
      await actions?.create?.(data)
      toast.success('생성 되었습니다.', { dismissible: true })
    } else {
      await actions?.update?.(data, context.modifyTarget.id)
      toast.success('수정 되었습니다.', { dismissible: true })
    }
    context.showDialog(false)
  }

  const onError = async (values: z.infer<typeof schema>) => {
    console.log(values)
    toast.error(JSON.stringify(values, null, 2))
  }

  useLayoutEffect(() => {
    context.setFormProps({ fields, form })
  }, [fields])

  return (
    <Dialog
      open={context.isShowDialog}
      onOpenChange={context.showDialog}
      modal={modal}
    >
      <DialogContent
        className="gap-0 px-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b px-5 pb-5">
          <DialogTitle>{isCreate ? '새로 만들기' : title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <ScrollArea className="h-[70vh]">
              <div className="space-y-3 p-5">
                {fields.map((fieldData) => {
                  return (
                    <Fragment key={fieldData.key}>
                      {(function () {
                        switch (fieldData.type) {
                          case FormFieldType.NUMBER:
                            return <FormNumberField data={fieldData} />
                          case FormFieldType.STRING:
                            return <FormStringField data={fieldData} />
                          case FormFieldType.TEXT:
                            return <FormTextField data={fieldData} />
                          case FormFieldType.DATE:
                            return <FormDateField data={fieldData} />
                          case FormFieldType.SELECT:
                            return <FormSelectField data={fieldData} />
                          case FormFieldType.CHECKBOX:
                            return <FormCheckboxField data={fieldData} />
                          case FormFieldType.CHECKBOXGROUP:
                            return <FormCheckboxGroupField data={fieldData} />
                          case FormFieldType.FILE:
                            return <FormFileField data={fieldData} />
                          case FormFieldType.CUSTOM_READ_ONLY:
                            return <FormCustomReadOnlyField data={fieldData} />
                          case FormFieldType.EMBED:
                            return <FormEmbedField data={fieldData} />
                          case FormFieldType.COLOR:
                            return <FormColorField data={fieldData} />
                          case FormFieldType.KEYWORDS:
                            return <FormKeywordsField data={fieldData} />
                          default:
                            throw new Error(
                              `UnknownFieldTypeError ${JSON.stringify(fieldData, null, 2)}`,
                            )
                        }
                      })()}
                    </Fragment>
                  )
                })}
              </div>
            </ScrollArea>
            <DialogFooter className="!mt-0 gap-3 border-t px-5 pt-5 sm:gap-0">
              {!isCreate && actions?.delete && (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      variant="destructive"
                      className="mr-auto"
                    >
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        정말로 삭제하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        삭제 후 되돌릴 수 없을 수도 있습니다. 정말로
                        삭제하시겠습니까?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={onClickDelete}>
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <DialogClose asChild>
                <Button type="reset" variant="outline">
                  닫기
                </Button>
              </DialogClose>
              {buttons?.map((button) => {
                return (
                  <Button
                    key={button.id}
                    type="button"
                    variant={button.variant}
                    disabled={form.formState.isSubmitting}
                    onClick={async () => {
                      await actions?.onButton?.(button.id, context.modifyTarget)
                      context.showDialog(false)
                    }}
                  >
                    {button.text}
                  </Button>
                )
              })}
              {(actions?.update || actions?.create) && (
                <Button
                  type="submit"
                  variant="default"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : isCreate ? (
                    '생성'
                  ) : (
                    '수정'
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
