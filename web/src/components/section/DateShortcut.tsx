import { Button } from '../ui/button'

type Props = {
  onChange: (dates: [Date | undefined, Date]) => void
}

export const DateShortcut = ({ onChange }: Props) => {
  const getDateRange = (dateDiff: number): [Date | undefined, Date] => {
    const from = new Date()
    from.setDate(from.getDate() - dateDiff)
    return [from, new Date()]
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const range = getDateRange(0)
          onChange(range)
        }}
      >
        오늘
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const range = getDateRange(30)
          onChange(range)
        }}
      >
        1개월
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const range = getDateRange(90)
          onChange(range)
        }}
      >
        3개월
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const range = getDateRange(180)
          onChange(range)
        }}
      >
        6개월
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const range = getDateRange(365)
          onChange(range)
        }}
      >
        1년
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onChange([undefined, new Date()])
        }}
      >
        전체
      </Button>
    </div>
  )
}
