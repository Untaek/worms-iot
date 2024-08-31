import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { SectionView } from './layout/SectionView'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { toast } from 'sonner'
import classNames from 'classnames'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Control = () => {
  const loading = useRef(false)
  const [control, setControl] = useState({ light: false, himidity: 70 })
  const [initalized, setInitalized] = useState(false)

  useEffect(() => {
    axios.get('/control').then((res) => {
      setControl(res.data)
      setInitalized(true)
    })
  }, [])

  const onClickControl = async (value: Partial<typeof control>) => {
    if (loading.current) {
      return
    }

    loading.current = true

    try {
      const res = await axios.post('/control', value)
      setControl(res.data)
    } catch (e) {
      toast.error(e.toString())
    } finally {
      loading.current = false
    }
  }

  const onClickLight = async () => {
    onClickControl({ light: !control.light })
  }

  const onClickHumidity = async (value: number) => {
    if (value > 100) {
      return
    }

    if (value < 0) {
      return
    }

    onClickControl({ himidity: value })
  }

  return (
    <SectionView title="Control">
      <div
        className={classNames('p-4 flex gap-8 items-center', {
          'opacity-0': !initalized,
        })}
      >
        <div className="flex items-center space-x-2" onClick={onClickLight}>
          <Switch id="light-on" checked={control.light} />
          <Label htmlFor="light-on">조명</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => onClickHumidity(control.himidity - 5)}
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex w-20 items-center justify-center gap-2">
            <Label>습도</Label>
            <p>{control.himidity ?? '?'}%</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => onClickHumidity(control.himidity + 5)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </SectionView>
  )
}
