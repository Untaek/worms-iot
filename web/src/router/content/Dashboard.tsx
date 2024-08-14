import { ContentView } from '@/components/layout/ContentView'
import { SectionView } from '@/components/layout/SectionView'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartTooltip } from '@/components/ui/chart'
import dayjs from 'dayjs'

export const Dashboard = () => {
  const [data, setData] = useState({})

  const formattedData = useMemo(() => {
    return data.dataset?.map(d => {
      return data.columns.reduce((obj, c, i) => {
        obj[c.name] = d[i]
        return obj
      }, {})
    })
  }, [data])

  useEffect(() => {
    axios.get('/data').then(res => setData(res.data))

    const interval = setInterval(() => {
      axios.get('/data').then(res => setData(res.data))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <ContentView title="테스트">
      <SectionView>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={formattedData}>
            <Line dataKey="temperature" dot={false} isAnimationActive={false}></Line>
            <Line dataKey="humidity" dot={false} isAnimationActive={false}></Line>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <ChartTooltip isAnimationActive={false} labelFormatter={(v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss')} />
          </LineChart>
        </ResponsiveContainer>
      </SectionView>
    </ContentView>
  )
}
