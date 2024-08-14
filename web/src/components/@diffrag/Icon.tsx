import React, { lazy, Suspense } from 'react'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

const fallback = (size: string | number = 24) => (
  <div
    className="absolute"
    style={{ background: '#f7f8f9', width: size, height: size }}
  />
)

export type IconName = keyof typeof dynamicIconImports

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

export const Icon = React.memo(({ name, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name])

  return (
    <Suspense fallback={fallback(props.size)}>
      <LucideIcon {...props} />
    </Suspense>
  )
})
