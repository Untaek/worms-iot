import React, { useLayoutEffect } from 'react'
import { FormProvider } from '../@diffrag/form/FormProvider'
import classNames from 'classnames'
import { twMerge } from 'tailwind-merge'
import { useRouteInfo } from '@/router'

type Props = {
  children?: React.ReactNode
  title: string
  className?: string
}

export const ContentView = ({ children, title, className }: Props) => {
  useLayoutEffect(() => {
    useRouteInfo.setState({ title })
  }, [title])

  return (
    <FormProvider>
      <div
        className={twMerge(
          classNames(
            className,
            'flex flex-1 flex-col gap-4 bg-gray-200 p-4 lg:w-auto lg:gap-4 lg:p-6',
          ),
        )}
      >
        {children}
      </div>
    </FormProvider>
  )
}
