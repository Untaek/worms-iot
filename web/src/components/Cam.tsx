import { memo } from "react"

let endpoint = '/stream'

if (process.env.NODE_ENV === 'development') {
  endpoint = 'http://localhost:3000/stream'
}

export const Cam = memo(() => {
    return <div className="flex bg-black items-center h-full">
      <img draggable="false" src={endpoint} />
    </div>
})