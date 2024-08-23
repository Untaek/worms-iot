import axios from "axios"
import { memo, useEffect, useState } from "react"

export const Cam = memo(() => {
    const [base64, setBase64] = useState('')

    useEffect(() => {
        axios.get('/image').then(res => setBase64(res.data.base64))
    
        const interval = setInterval(() => {
          axios.get('/image').then(res => setBase64(res.data.base64))
        }, 500)
    
        return () => {
          clearInterval(interval)
        }
      }, [])

      return <div className="flex bg-black items-center h-full">
        {base64 && <img src={`data:image/jpeg;base64,${base64}`} />}
      </div>
})