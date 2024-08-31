import { ContentView } from '@/components/layout/ContentView'
import { SectionView } from '@/components/layout/SectionView'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
import { ChartLegend, ChartTooltip } from '@/components/ui/chart'
import dayjs from 'dayjs'
import { Cam } from '@/components/Cam'
import { Toggle } from '@/components/ui/toggle'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Control } from '@/components/Control'

import { EChartsType, init } from 'echarts'
import { LineChart } from 'echarts/charts'

type GraphData = {
  temperature: number
  humidity: number
  timestamp: string
}

export const Dashboard = () => {
  const chartContainer = useRef<HTMLDivElement>(null)
  const chart = useRef<EChartsType>()
  const [formattedData, setData] = useState<GraphData[]>([])

  const setFormattedData = (data: any) => {
    setData(
      data.dataset?.map((d) => {
        return data.columns.reduce((obj, c, i) => {
          obj[c.name] = d[i]
          return obj
        }, {})
      }),
    )
  }

  const initChart = () => {
    const lineChart = init(chartContainer.current, null)
    lineChart.setOption({
      animation: false,
      grid: {
        left: 24,
        containLabel: true,
        bottom: 24,
        top: 48,
        right: 24,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        valueFormatter: (value: number, dataIndex: number) => {
          return `${value.toFixed(1)}`
        },
        // formatter: function (params) {
        //   const [temperature, humidity] = params
        //   const date = new Date(temperature.name)
        //   return (
        //     date.getDate() +
        //     '/' +
        //     (date.getMonth() + 1) +
        //     '/' +
        //     date.getFullYear() +
        //     ' : ' +
        //     `${temperature.value.toFixed(1)}°C`
        //   )
        // },
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          formatter: function (v: string) {
            return dayjs(v).format('YYYY/MM/DD HH:mm:ss')
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '온도',
          min: 0,
          max: 40,
          position: 'left',
          axisLabel: {
            formatter: '{value}°C',
          },
        },
        {
          type: 'value',
          name: '습도',
          min: 20,
          max: 100,
          position: 'right',
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          type: 'line',
          smooth: false,
          showSymbol: false,
          yAxisIndex: 0,
        },
        {
          type: 'line',
          smooth: false,
          showSymbol: false,
          yAxisIndex: 1,
        },
      ],
    })

    chart.current = lineChart
  }

  useLayoutEffect(() => {
    initChart()
  }, [])

  useEffect(() => {
    if (formattedData.length) {
      chart.current?.setOption({
        xAxis: {
          data: formattedData.map((d) => d.timestamp),
        },
        series: [
          {
            data: formattedData.map((d) => d.temperature),
          },
          {
            data: formattedData.map((d) => d.humidity),
          },
        ],
      })
    }
  }, [formattedData])

  useEffect(() => {
    axios.get('/data').then((res) => setFormattedData(res.data))

    const interval = setInterval(() => {
      axios.get('/data').then((res) => setFormattedData(res.data))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const temperature = formattedData.at(-1)?.temperature
  const humidity = formattedData.at(-1)?.humidity

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin

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
    )
  }

  return (
    <ContentView title="테스트">
      <Control />
      <SectionView title="온도/습도 데이터">
        <div ref={chartContainer} className="h-[400px]"></div>
      </SectionView>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <SectionView title="현재 온도" className="-mb-24">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                startAngle={180}
                endAngle={0}
                innerRadius="56%"
                data={[
                  { value: temperature, name: `${temperature?.toFixed(1)}°C` },
                  { value: 40 - temperature },
                ]}
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
        <SectionView title="현재 습도" className="-mb-24">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                startAngle={180}
                endAngle={0}
                innerRadius="56%"
                data={[
                  { value: humidity, name: `${humidity?.toFixed(1)}%` },
                  { value: 100 - humidity },
                ]}
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
        <Cam />
      </div>
    </ContentView>
  )
}
