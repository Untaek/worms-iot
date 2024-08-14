import React, { useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'

import './TimePicker.css'

const CIRCLE_DEGREES = 360
const WHEEL_ITEM_SIZE = 28
const WHEEL_ITEM_COUNT = 18
const WHEEL_ITEMS_IN_VIEW = 2

const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
const WHEEL_RADIUS = Math.round(
  WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT),
)

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

const setSlideStyles = (
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  slideCount: number,
  totalRadius: number,
): void => {
  const slideNode = emblaApi.slideNodes()[index]
  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS

  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
  }

  if (inView) {
    slideNode.style.opacity = '1'
    slideNode.style.transform = `translateY(-${
      index * 100
    }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
  } else {
    slideNode.style.opacity = '0'
    slideNode.style.transform = 'none'
  }
}

export const setContainerStyles = (
  emblaApi: EmblaCarouselType,
  wheelRotation: number,
): void => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
}

type PropType = {
  loop?: boolean
  label: string
  slideCount: number
  perspective: 'left' | 'right'
  value: number
  onChange: (value: number) => void
}

export const IosPickerItem: React.FC<PropType> = (props) => {
  const {
    slideCount,
    perspective,
    label,
    loop = false,
    value = 0,
    onChange,
  } = props
  const onChangeRef = useRef(onChange)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: 'y',
    dragFree: true,
    containScroll: false,
    watchSlides: false,
  })
  const rootNodeRef = useRef<HTMLDivElement>(null)
  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS
  const slides = Array.from(Array(slideCount).keys())

  const inactivateEmblaTransform = useCallback(
    (emblaApi: EmblaCarouselType) => {
      if (!emblaApi) return
      const { translate, slideLooper } = emblaApi.internalEngine()
      translate.clear()
      translate.toggleActive(false)
      slideLooper.loopPoints.forEach(({ translate }) => {
        translate.clear()
        translate.toggleActive(false)
      })
    },
    [],
  )

  const rotateWheel = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })
    },
    [slideCount, rotationOffset, totalRadius],
  )

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerUp', (emblaApi) => {
      const engine = emblaApi.internalEngine()
      const diffToTarget = engine.target.get() - engine.location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      engine.scrollTo.distance(distance, true)

      const index = engine.index.get()
      const prev = engine.indexPrevious.get()
      if (prev !== index) {
        onChangeRef.current?.(index)
      }
    })

    emblaApi.on('scroll', rotateWheel)

    emblaApi.on('reInit', (emblaApi) => {
      inactivateEmblaTransform(emblaApi)
      rotateWheel(emblaApi)
    })

    inactivateEmblaTransform(emblaApi)
    rotateWheel(emblaApi)
  }, [emblaApi, inactivateEmblaTransform, rotateWheel])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(value, true)
  }, [emblaApi])

  useLayoutEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  return (
    <div className="embla__ios-picker">
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-14 w-full"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(255,255,255,255) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-14 w-full"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,255) 100%)',
        }}
      />
      <div className="embla__ios-picker__scene" ref={rootNodeRef}>
        <div
          className={`embla__ios-picker__viewport embla__ios-picker__viewport--perspective-${perspective}`}
          ref={emblaRef}
        >
          <div className="embla__ios-picker__container">
            {slides.map((_, index) => (
              <div className="embla__ios-picker__slide" key={index}>
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="embla__ios-picker__label">{label}</div>
    </div>
  )
}

type Props = {
  hours: number
  minutes: number
  onChange: (hours: number, minutes: number) => void
}

export const TimePicker = ({ hours = 0, minutes = 0, onChange }: Props) => {
  return (
    <div className="embla">
      <IosPickerItem
        value={hours}
        onChange={(v) => onChange(v, minutes)}
        slideCount={24}
        perspective="left"
        label="시"
      />
      <IosPickerItem
        value={minutes}
        onChange={(v) => onChange(hours, v)}
        slideCount={60}
        perspective="right"
        label="분"
      />
    </div>
  )
}
