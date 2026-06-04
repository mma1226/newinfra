import { useRef } from 'react'
import './Poster.css'
import PinLoop from './PinLoop'

export default function Poster() {
  // The center image mirrors the live width of the "CALL FOR SUBMISSION" block.
  const ctaRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className="overlay">
      {/* Fades the shader into the FAQ background at the bottom of the hero
          (behind the text, so the type stays crisp) */}
      <div className="hero-fade" />

      {/* "NEW INFRA" Pinterest board, cycling one image every 5s in the center.
          Its width tracks the CALL FOR SUBMISSION headline. */}
      <PinLoop widthRef={ctaRef} />

      {/* Headlines — one row sharing the same baseline, spread left→right so
          they never overlap. */}
      <div className="headline-row">
        <p className="headline headline--nowrap">“NEW INFRA”</p>
        <p className="headline" ref={ctaRef}>
          CALL FOR
          <br />
          SUBMISSION
        </p>
        <p className="headline headline--right">
          APPLY{' '}
          <a className="headline__link" href="#apply">
            HERE
          </a>{' '}
          BY
          <br />
          JUNE 15
        </p>
      </div>
    </div>
  )
}
