'use client'

import Autoplay from 'embla-carousel-autoplay'
import ClassNames from 'embla-carousel-class-names'
import Image from 'next/image'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

export interface SlideItem {
  title: string
  description?: string
  bg: string
  content?: React.ReactNode
}

interface BaseCarouselProps {
  slides: SlideItem[]
  autoplayDelay?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
  renderSlide?: (slide: SlideItem, index: number) => React.ReactNode
  height?: string // Tailwind class: h-*, e.g., h-64, h-96, h-[500px]
}

export function BaseCarousel({
  slides,
  autoplayDelay = 10000,
  showDots = true,
  showArrows = true,
  className,
  height = 'h-[500px]', // <--- default height
}: BaseCarouselProps) {
  const autoplay = React.useRef(
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  )

  const [api, setApi] = React.useState<CarouselApi | null>(null)

  return (
    <Carousel
      className={cn('group relative w-full', height, className)}
      plugins={[autoplay.current, ClassNames()]}
      opts={{
        align: 'start',
        containScroll: 'trimSnaps',
        loop: true,
      }}
      setApi={setApi}
    >
      <CarouselContent>
        {slides.map((slide, idx) => (
          <CarouselItem key={idx} className="w-full">
            <div className={cn('relative flex w-full items-center justify-center', height)}>
              {/* Background */}
              <Image
                src={slide.bg}
                alt={slide.title}
                fill
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              {/* Overlay */}
              <div className="absolute inset-0 -z-10 bg-black/40 dark:bg-black/60" />

              <div className="relative z-10 flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
                  {slide.title}
                </h2>
                <p className="mb-2 text-lg text-white/90 drop-shadow md:text-xl">
                  {slide.description}
                </p>
                <div className="mt-2 flex w-full flex-col justify-center gap-4 sm:flex-row">
                  <Button variant="secondary" size="lg">
                    Liên hệ tư vấn
                  </Button>
                  <Button variant="outline" size="lg">
                    Xem dự án
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showArrows && (
        <>
          <CarouselPrevious className="pointer-events-auto absolute top-1/2 left-2 z-20 -translate-y-1/2 scale-90 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />
          <CarouselNext className="pointer-events-auto absolute top-1/2 right-2 z-20 -translate-y-1/2 scale-90 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100" />
        </>
      )}

      {showDots && <CarouselDots slides={slides} api={api} />}
    </Carousel>
  )
}

/* Component Dots Indicator */
function CarouselDots({ slides, api }: { slides: { title: string }[]; api: CarouselApi | null }) {
  const [selected, setSelected] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setSelected(api.selectedScrollSnap())

    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="absolute right-0 bottom-4 left-0 z-20 flex justify-center gap-2">
      {slides.map((_, idx) => (
        <button
          key={idx}
          onClick={() => api && api.scrollTo(idx)}
          className={`h-2 w-2 rounded-full transition-all ${
            selected === idx ? 'w-6 bg-white' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
  )
}
