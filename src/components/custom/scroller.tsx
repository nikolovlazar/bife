'use client'

import React, { type PropsWithChildren, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export const Scroller = (
  {
    children,
    direction = 'left',
    speed = 'fast',
    pauseOnHover = true,
    className,
  }: PropsWithChildren<{
    direction?: 'left' | 'right'
    speed?: 'fast' | 'normal' | 'slow'
    pauseOnHover?: boolean
    className?: string
  }>
) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    addAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [start, setStart] = useState(false)
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStart(true)
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        )
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        )
      }
    }
  }
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s')
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '80s')
      } else {
        containerRef.current.style.setProperty('--animation-duration', '160s')
      }
    }
  }
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          ' flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-2',
          start && 'animate-scroll ',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </ul>
    </div>
  )
}
