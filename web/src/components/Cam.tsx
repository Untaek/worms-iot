import { memo, useState } from 'react'
import { SectionView } from './layout/SectionView'
import { Button } from './ui/button'
import { FullscreenIcon, Minimize2Icon } from 'lucide-react'
import classNames from 'classnames'

let endpoint = '/stream'

if (process.env.NODE_ENV === 'development') {
  endpoint = 'http://localhost:3000/stream'
}

export const Cam = memo(() => {
  const [fullscreen, setFullscreen] = useState(false)

  const onClickFullScreen = () => {
    setFullscreen((prev) => !prev)
  }

  return (
    <SectionView
      title="카메라"
      className="overflow-hidden rounded-b-md"
      actions={[
        {
          render() {
            return (
              <Button
                onClick={onClickFullScreen}
                variant="ghost"
                className="-mx-2 -my-4"
              >
                <FullscreenIcon />
              </Button>
            )
          },
        },
      ]}
    >
      <div
        className={classNames(
          'flex h-full items-center justify-center bg-black',
          {
            'fixed inset-0 z-50': fullscreen,
          },
        )}
      >
        {fullscreen && (
          <div className="absolute right-4 top-4 md:right-8 md:top-8 xl:right-12 xl:top-12">
            <Button onClick={onClickFullScreen}>
              <Minimize2Icon />
            </Button>
          </div>
        )}
        <img draggable="false" src={endpoint} />
      </div>
    </SectionView>
  )
})
