import { BarChartIcon, PieChart } from 'lucide-react'

export const navs: Nav[] = [
  {
    icon: <BarChartIcon className="size-4" />,
    label: '기본',
    header: true,
  },
  {
    to: '/',
    label: '대시보드',
    icon: <PieChart className="size-4" />,
  },
]

type Nav = {
  icon?: React.ReactNode
  to?: string
  label: string
  header?: boolean
}
