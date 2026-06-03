import './Header.css'
import modalWordmark from './assets/poster/modal-wordmark.svg'
import grayArea from './assets/poster/grayarea.svg'

export default function Header() {
  return (
    <header className="site-header">
      <img
        className="site-logo site-logo--modal"
        src={modalWordmark}
        alt="Modal"
      />
      <img
        className="site-logo site-logo--gray"
        src={grayArea}
        alt="Gray Area"
      />
    </header>
  )
}
