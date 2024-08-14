import { api } from '@/api'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { ImageOffIcon } from 'lucide-react'
import React from 'react'

interface FormatterOptions {
  fallback?: React.ReactNode
}

interface FormatDateOptions extends FormatterOptions {
  /**
   * @param format default: YYYY-MM-DD HH:mm
   */
  format?: string
}

interface FormatThumbnailOptions extends FormatterOptions {
  width?: number | string
  height?: number | string
  aspectRatio?: number | string
}

interface FormatTrimOptions extends FormatterOptions {
  length?: number
  ellipsis?: boolean
}

interface FormatBadgeOptions extends FormatterOptions {
  type?:
    | 'default'
    | 'outline'
    | 'disabled'
    | 'warning'
    | 'green'
    | 'yellow'
    | 'red'
  matcher?: Record<any, FormatBadgeOptions['type']>
}

// format: string = 'YYYY-MM-DD HH:mm'
export const TableFormatter = {
  datetime: (options?: FormatDateOptions) => (value: any, rawValue?: any) => {
    return dayjs(value).format(options?.format ?? 'YYYY-MM-DD HH:mm')
  },

  thumbnail:
    (options?: FormatThumbnailOptions) =>
    async (value: any, rawValue?: any) => {
      const assetUrlOrId = value?.url || value

      if (!assetUrlOrId) {
        return (
          options?.fallback || (
            <div style={{ height: 'inherit' }} className="aspect-square p-0.5">
              <div className="flex size-full items-center justify-center bg-gray-100 text-muted-foreground">
                <ImageOffIcon className="size-5" />
              </div>
            </div>
          )
        )
      }

      let url = ''

      if (typeof assetUrlOrId === 'number') {
        const asset = await api().assets.getAsset(assetUrlOrId)
        url = asset.url
      }

      if (typeof assetUrlOrId === 'string') {
        url = assetUrlOrId
      }

      return (
        <div
          style={{
            height: options?.height || 'inherit',
            aspectRatio: options?.aspectRatio,
            width: options?.width,
          }}
          className="aspect-square p-0.5"
        >
          <img src={url} className="size-full object-cover" />
        </div>
      )
    },

  trim: (options?: FormatTrimOptions) => async (value: any, rawValue?: any) => {
    const length = options?.length || 10

    const str = String(value).trim()

    if (str.length > length) {
      const trimmed = str.slice(0, length)

      if (options?.ellipsis) {
        return `${trimmed}...`
      }

      return trimmed
    }

    return str
  },

  badge: (options?: FormatBadgeOptions) => (value: any, rawValue?: any) => {
    let type = options?.type || 'default'
    const matcher = options?.matcher || {}

    let _value = value

    if (typeof value === 'object') {
      _value = JSON.stringify(value)
    }

    if (matcher[rawValue]) {
      type = matcher[rawValue]!
    }

    return (
      <span
        className={classNames(
          'rounded-full px-1.5 py-1 leading-none inline-flex justify-center items-center',
          {
            'bg-black text-white': type === 'default',
            'border text-gray-600': type === 'outline',
            'bg-gray-200 text-gray-600': type === 'disabled',
            'bg-green-600 text-white': type === 'green',
            'bg-yellow-600 text-white': type === 'yellow',
            'bg-red-600 text-white': type === 'red',
          },
        )}
      >
        {_value}
      </span>
    )
  },
}
