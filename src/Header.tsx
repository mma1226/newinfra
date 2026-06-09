import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      {/* The Modal mark is drawn via a CSS mask + backdrop-filter (see Header.css)
          so it can stay fixed AND still reflect the background like luminosity. */}
      <span className="site-logo site-logo--modal" role="img" aria-label="Modal" />
    </header>
  )
}
