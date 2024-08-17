import { ContentView } from '@/components/layout/ContentView'
import { SectionView } from '@/components/layout/SectionView'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis,  ResponsiveContainer, YAxis, CartesianGrid, PieChart, Pie, Cell, Sector } from 'recharts'
import { ChartLegend, ChartTooltip } from '@/components/ui/chart'
import dayjs from 'dayjs'

type GraphData = {
  temperature: number
  humidity: number
}

export const Dashboard = () => {
  const [formattedData, setData] = useState<GraphData[]>([])

  const setFormattedData = (data: any) => {
    setData(
     data.dataset?.map(d => {
      return data.columns.reduce((obj, c, i) => {
        obj[c.name] = d[i]
        return obj
      }, {})
    }))
  }

  useEffect(() => {
    axios.get('/data').then(res => setFormattedData(res.data))

    const interval = setInterval(() => {
      axios.get('/data').then(res => setFormattedData(res.data))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const temperature = formattedData.at(-1)?.temperature
  const humidity = formattedData.at(-1)?.humidity

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;

    return (
      <g>
        <text x={cx} y={cy} dy={0} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ContentView title="테스트">
      <SectionView title="온도/습도 데이터">
        <ResponsiveContainer width='100%' height={320}>
          <LineChart data={formattedData} margin={{top: 16, right: 32, bottom: 12}}>
            <ChartLegend verticalAlign="top" height={44} />
            <Line dataKey="temperature" dot={false} isAnimationActive={false} stroke='#42a4f5' strokeWidth={2} name="온도"></Line>
            <Line dataKey="humidity" dot={false} isAnimationActive={false} stroke='#82ca9d' strokeWidth={2} name="습도"></Line>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" fontSize={12} tickFormatter={(v) => dayjs(v).format('HH:mm:ss')} />
            <YAxis fontSize={12} />
            <ChartTooltip isAnimationActive={false} labelFormatter={(v) => dayjs(v).format('YYYY-MM-DD HH:mm:ss')} formatter={(v) => v.toFixed(1)} />
          </LineChart>
        </ResponsiveContainer>
      </SectionView>
      <div className='grid grid-cols-4 gap-4'>
      <SectionView title="현재 온도" className='-mb-24'>
        <ResponsiveContainer width='100%' height={320}>
          <PieChart>
            <Pie
              startAngle={180}
              endAngle={0}
              innerRadius="56%"
              data={[{ value: temperature, name: `${temperature?.toFixed(1)}°C` }, { value: 40 - temperature }]}
              dataKey="value"
              labelLine={false}
              blendStroke
              activeIndex={0}
              activeShape={renderActiveShape}
            >
              <Cell fill="#42a4f5" />
              <Cell fill="#eaeaea" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </SectionView>
      <SectionView title="현재 습도" className='-mb-24'>
      <ResponsiveContainer width='100%' height={320}>
          <PieChart>
            <Pie
              startAngle={180}
              endAngle={0}
              innerRadius="56%"
              data={[{ value: humidity, name: `${humidity?.toFixed(1)}%` }, { value: 100 - humidity }]}
              dataKey="value"
              labelLine={false}
              blendStroke
              activeIndex={0}
              activeShape={renderActiveShape}
            >
              <Cell fill="#82ca9d" />
              <Cell fill="#eaeaea" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </SectionView>
      </div>
    </ContentView>
  )
}
