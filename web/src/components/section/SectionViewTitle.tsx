type Props = {
  title?: string
  count?: number
}

export const SectionViewTitle = ({ title, count }: Props) => {
  return (
    <div className="flex gap-1">
      <strong>{title}</strong>
      <span className="font-normal">
        (총 <strong>{count || 0}</strong>개)
      </span>
    </div>
  )
}
