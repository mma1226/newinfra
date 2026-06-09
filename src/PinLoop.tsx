import { useEffect, useState } from 'react'
import type { RefObject } from 'react'
import { loopImages } from './loopImages'
import './PinLoop.css'

// All looping images (self-hosted in public/loop/, hand-maintained).
// Prefix with Vite's base so paths resolve under a sub-path deploy
// (e.g. /newinfra/loop/… on GitHub Pages, /loop/… in dev).
const images = loopImages.map(
  (p) => import.meta.env.BASE_URL + p.replace(/^\//, '')
)

type Props = {
  // Element whose width the image should mirror (live, on resize).
  widthRef: RefObject<HTMLElement | null>
}

// Cycles through the images, crossfading: the previous image sits underneath at
// full opacity while the current fades in on top, so the background never shows.
export default function PinLoop({ widthRef }: Props) {
  const [pair, setPair] = useState<{ curr: number; prev: number | null }>({
    curr: 0,
    prev: null,
  })
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setPair((p) => ({ prev: p.curr, curr: (p.curr + 1) % images.length }))
    }, 3000)
    return () => clearInterval(id)
  }, [])

  // Desktop: mirror the target element's width. Mobile (≤640px): leave width
  // unset so CSS can let the image fill the top of the screen.
  // (useEffect, not useLayoutEffect: the target is a later sibling, so its ref
  // isn't attached yet during PinLoop's layout phase.)
  useEffect(() => {
    const el = widthRef.current
    if (!el) return
    const mq = window.matchMedia('(max-width: 640px)')
    const measure = () =>
      setWidth(mq.matches ? null : el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    mq.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', measure)
    }
  }, [widthRef])

  if (images.length === 0) return null

  const sizeStyle = width ? { width: `${width}px` } : undefined

  return (
    <div className="pin-loop">
      {/* Previous image stays solid underneath so no background shows through */}
      {pair.prev !== null && (
        <img
          className="pin-loop__img pin-loop__img--under"
          src={images[pair.prev]}
          alt=""
          aria-hidden="true"
        />
      )}
      {/* Current image fades in on top; it also sizes the container */}
      <img
        key={pair.curr}
        className="pin-loop__img pin-loop__img--over"
        src={images[pair.curr]}
        alt=""
        loading="eager"
        style={sizeStyle}
      />
    </div>
  )
}
