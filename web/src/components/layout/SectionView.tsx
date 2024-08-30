import classNames from 'classnames'
import React from 'react'

export type ActionProps = {
  render?: () => React.ReactNode
}

type Props = {
  children: React.ReactNode
  title?: React.ReactNode
  className?: string
  actions?: ActionProps[]
}

export const SectionView = ({ title, children, className, actions }: Props) => {
  return (
    <section className="flex flex-col rounded-md bg-white">
      {title && (
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="font-semibold">{title}</h2>
          <div className="flex shrink-0 items-center justify-end gap-3">
            {actions?.map((action) => action.render?.())}
          </div>
        </div>
      )}
      <div className={classNames('flex-1', className)}>{children}</div>
    </section>
  )
}
