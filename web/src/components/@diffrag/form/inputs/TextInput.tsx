import { Input, InputProps } from '@/components/ui/input'
import classNames from 'classnames'

type Props = InputProps & {
  postfix?: string
}

export const TextInput = ({ postfix, className, ...props }: Props) => {
  return (
    <div className="relative flex rounded-md border bg-white">
      <Input
        className={classNames('z-[1] border-none bg-transparent', className)}
        {...props}
      />
      {postfix && (
        <div className="flex items-center justify-start rounded-r-md border-l bg-gray-50 px-3 font-medium text-gray-500">
          {postfix}
        </div>
      )}
    </div>
  )
}
