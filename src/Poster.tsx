import './Poster.css'
import modalWordmark from './assets/poster/modal-wordmark.svg'
import grayArea from './assets/poster/grayarea.svg'

export default function Poster() {
  return (
    <div className="overlay">
      {/* Fades the shader into the FAQ background at the bottom of the hero
          (behind the text, so the type stays crisp) */}
      <div className="hero-fade" />

      {/* Headlines — one row sharing the same baseline, spread left→right so
          they never overlap. The logos sit directly beneath "NEW INFRA". */}
      <div className="headline-row">
        <div className="headline-col">
          <p className="headline headline--nowrap">“NEW INFRA”</p>
          <div className="poster-logos">
            <img
              className="poster-logo poster-logo--modal"
              src={modalWordmark}
              alt="Modal"
            />
            <img
              className="poster-logo poster-logo--gray"
              src={grayArea}
              alt="Gray Area"
            />
          </div>
        </div>
        <p className="headline">
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
