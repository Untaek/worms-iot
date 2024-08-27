import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { SectionView } from "./layout/SectionView"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { toast } from "sonner"
import classNames from "classnames"

export const Control = () => {
  const loading = useRef(false)
  const [control, setControl] = useState({ light: false })
  const [initalized, setInitalized] = useState(false)

  useEffect(() => {
    axios.get('/control').then(res => {
      setControl(res.data)
      setInitalized(true)
    })
  }, [])

  const onClickLight = async () => {
    if (loading.current) {
      return
    }

    loading.current = true

    try {
      const res = await axios.post('/control', { light: !control.light })
      setControl(res.data)
    } catch (e) {
      toast.error(e.toString())
    } finally {
      loading.current = false
    }
  }

  return <SectionView title="Control">
  <div className={classNames('p-4 flex items-start', { 'opacity-0': !initalized })}>
    <div className="flex items-center space-x-2" onClick={onClickLight}>
      <Switch id="light-on" checked={control.light} />
      <Label htmlFor="light-on">조명</Label>
    </div>
  </div>
</SectionView>
}