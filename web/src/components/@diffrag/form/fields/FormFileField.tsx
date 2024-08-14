import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FormContext } from '../FormProvider'
import { FormFieldProps, FormFileType } from './type'
import { Input } from '@/components/ui/input'
import { IImageRO } from 'api'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button } from '@/components/ui/button'
import { CropIcon, DownloadIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Crop } from '@/type'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

type FilePreview = {
  name: string
  src: string
  mimetype: string
  crop?: Crop
  base64?: string
}

export type FileWrapper = {
  file: File
  crop?: Crop
  base64?: string
}

export const FormFileField = React.memo(
  ({ data }: FormFieldProps<FormFileType>) => {
    const context = useContext(FormContext)
    const __DEV_EFFEECT_CALLED_ONCE__ = useRef(false)

    const [preview, setPreview] = useState<FilePreview[]>([])

    const [openCropper, setOpenCropper] = useState(false)
    const cropperRef = useRef<ReactCropperElement>(null)
    const onCrop = async () => {
      const crop = cropperRef.current!.cropper.getData()
      const res = await fetch(preview[0].src)
      const blob = await res.blob()
      const file = new File([blob], preview[0].name, {
        type: preview[0].mimetype,
      })

      const base64 = cropperRef
        .current!.cropper.getCroppedCanvas()
        .toDataURL('base64')

      context.formProps.form?.setValue(data.key, [{ file, crop, base64 }])

      setOpenCropper(false)
    }

    const onOpenCropper = (preview: FilePreview) => {
      setOpenCropper(true)
      setTimeout(() => {
        if (preview.crop) {
          cropperRef.current?.cropper.setData({
            x: preview.crop.x,
            y: preview.crop.y,
            width: preview.crop.width,
            height: preview.crop.height,
          })
        }
      }, 10)
    }

    const onChange = (
      field: ControllerRenderProps<FieldValues, string>,
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const files: FileWrapper[] = [...event.target.files!].map((f) => ({
        file: f,
      }))

      const values = data.multiple ? [...field.value, ...files] : [files[0]]

      field.onChange(values)

      if (data.crop?.autoOpen) {
        onOpenCropper(values[0])
      }
    }

    const loadPreview = async (
      value: (IImageRO | FileWrapper)[] | IImageRO,
    ) => {
      if (!value) {
        return
      }

      const handleAsset = (asset: IImageRO) => {
        arr.push({
          name: asset.id.toString(),
          mimetype: 'image/jpeg',
          src: asset.path,
        })
      }

      const handleFile = ({ file, crop, base64 }: FileWrapper) => {
        arr.push({
          name: file.name,
          mimetype: file.type,
          src: URL.createObjectURL(file),
          crop,
          base64,
        })
      }

      const arr: FilePreview[] = []
      if (Array.isArray(value)) {
        value.map((fileWrapper) => {
          if ('file' in fileWrapper) {
            handleFile(fileWrapper)
          } else {
            handleAsset(fileWrapper)
          }
        })
      } else {
        handleAsset(value)
      }

      setPreview(arr)
    }

    useEffect(() => {
      const subscription = context.formProps.form?.watch(
        (value, { name, type }) => {
          if (name === data.key) {
            loadPreview(value[name])
          }
        },
      )

      return () => subscription?.unsubscribe()
    }, [context.formProps.form, data.key])

    useEffect(() => {
      if (__DEV_EFFEECT_CALLED_ONCE__.current) {
        return
      }

      __DEV_EFFEECT_CALLED_ONCE__.current = true

      const form = context.formProps.form?.getValues()

      if (form) {
        loadPreview(form[data.key])
      }
    }, [context.formProps.form, data])

    return (
      <FormField
        control={context.formProps.form?.control}
        key={data.key}
        name={data.key}
        render={({ field, formState: { errors } }) => (
          <FormItem>
            <FormLabel>{data.label}</FormLabel>
            <FormControl>
              {!data.readOnly && (
                <Input
                  className="cursor-pointer"
                  type="file"
                  name={field.name}
                  placeholder={data.label}
                  multiple={data.multiple}
                  accept={data.accept}
                  onChange={(e) => {
                    onChange(field, e)
                  }}
                />
              )}
            </FormControl>
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {preview.map((p) => {
                  return (
                    <div className="relative block border" key={p.src}>
                      {p.mimetype?.startsWith('image') ? (
                        <>
                          <img src={p.base64 || p.src} draggable="false" />
                          <div className="absolute bottom-2 right-2 z-10 flex gap-2">
                            {!data.readOnly && (
                              <div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="flex h-auto p-1"
                                  onClick={() => onOpenCropper(p)}
                                >
                                  <CropIcon size={12} />
                                </Button>
                              </div>
                            )}
                            <a download={p.name} href={p.src}>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="flex h-auto p-1"
                              >
                                <DownloadIcon size={12} />
                              </Button>
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="select-none overflow-hidden break-all p-2 text-xs text-muted-foreground">
                          <span className="line-clamp-6 block h-32">
                            {p.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            <FormMessage />
            <Dialog
              open={openCropper}
              onOpenChange={setOpenCropper}
              modal={false}
            >
              <DialogContent className="h-[700px] max-h-[80vh] min-w-[700px]">
                <DialogHeader>
                  <DialogTitle>이미지 편집</DialogTitle>
                </DialogHeader>
                {preview.length > 0 && (
                  <Cropper
                    className="row-span-12 min-h-0"
                    viewMode={1}
                    ref={cropperRef}
                    src={preview[0].src}
                    aspectRatio={data.crop?.aspectRatio}
                    autoCropArea={1}
                    rotatable={false}
                    scalable={false}
                    guides={false}
                    zoomable={false}
                  />
                )}
                <DialogFooter>
                  <Button onClick={onCrop}>크롭하기</Button>
                  <Button
                    onClick={() => setOpenCropper(false)}
                    variant="outline"
                  >
                    닫기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </FormItem>
        )}
      />
    )
  },
)
