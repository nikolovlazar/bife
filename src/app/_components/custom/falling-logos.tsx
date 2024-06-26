'use client'

import Matter from 'matter-js'
import { useCallback, useEffect, useState } from 'react'

const logos = [
  'behance',
  'bluesky',
  'discord',
  'dribbble',
  'facebook-messenger',
  'facebook',
  'github',
  'gmail',
  'google-docs',
  'google-drive',
  'google-meet',
  'gumroad',
  'instagram',
  'linkedin',
  'medium',
  'reddit',
  'shopify',
  'slack',
  'soundcloud',
  'spotify',
  'substack',
  'telegram',
  'tiktok',
  'tumblr',
  'twitch',
  'twitter',
  'viber',
  'vimeo',
  'wechat',
  'whatsapp',
  'youtube',
]

export function FallingLogos() {
  const [scene, setScene] = useState<HTMLDivElement>()
  const [cw, setCw] = useState<number>()
  const [ch, setCh] = useState<number>()

  const [world, setWorld] = useState<Matter.World | null>()

  const onSceneRefChange = useCallback<(ref: HTMLDivElement) => void>((ref) => {
    if (ref) {
      setScene(ref)
      setCw(ref.offsetWidth)
      setCh(ref.offsetHeight)
    }
  }, [])

  useEffect(() => {
    if (scene && cw && ch) {
      const engine = Matter.Engine.create()
      const engineWorld = engine.world
      setWorld(engine.world)
      const render = Matter.Render.create({
        element: scene,
        engine: engine,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: 'transparent',
        },
      })

      Matter.Render.run(render)

      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)

      engineWorld.bodies = []

      const thickness = 100
      const offset = -1 * (thickness / 1.8)
      const options = {
        isStatic: true,
        render: { strokeStyle: 'transparent' },
      }

      Matter.Composite.add(engineWorld, [
        Matter.Bodies.rectangle(offset, ch / 2, thickness, ch, options),
        Matter.Bodies.rectangle(cw / 2, offset, cw, thickness, options),
        Matter.Bodies.rectangle(cw - offset, ch / 2, thickness, ch, options),
        Matter.Bodies.rectangle(cw / 2, ch - offset, cw, thickness, options),
      ])

      const mouse = Matter.Mouse.create(render.canvas)
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      })

      mouseConstraint.mouse.element.removeEventListener(
        'mousewheel',
        // @ts-ignore - mousewheel does exist on mouse
        mouseConstraint.mouse.mousewheel
      )
      mouseConstraint.mouse.element.removeEventListener(
        'DOMMouseScroll',
        // @ts-ignore - mousewheel does exist on mouse
        mouseConstraint.mouse.mousewheel
      )

      Matter.Composite.add(engineWorld, mouseConstraint)

      render.mouse = mouse

      Matter.Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: cw, y: ch },
      })
    }
  }, [scene, ch, cw])

  useEffect(() => {
    if (world && cw && ch && world.bodies.length === 4) {
      const magicNumber = Math.floor(Math.abs(100 - (100 * ch) / cw))
      let numLogos = magicNumber // a magic number that defines the number of logos and their radius based on the available container width and height
      const addRandomLogo = () => {
        Matter.Composite.add(
          world,
          Matter.Bodies.circle(
            Matter.Common.random(50, cw - 50),
            30,
            magicNumber,
            {
              density: 0.15,
              restitution: 0.4,
              slop: 0,
              friction: 0.3,
              render: {
                sprite: {
                  texture: `/${logos[numLogos % logos.length]}.svg`,
                  xScale: 1.75,
                  yScale: 1.75,
                },
              },
            }
          )
        )
      }
      const interval = setInterval(() => {
        requestAnimationFrame(addRandomLogo)
        numLogos--
        if (numLogos === 0) {
          clearInterval(interval)
        }
      }, 100)
    }
  }, [world, cw, ch])

  return (
    <div
      ref={onSceneRefChange}
      className="absolute inset-0 h-full w-full overflow-hidden opacity-40 max-lg:hidden"
    />
  )
}
