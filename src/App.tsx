import Header from './Header'
import Poster from './Poster'
import FAQ from './FAQ'

export default function App() {
  return (
    <main className="page">
      <Poster />
      {/* After Poster so it paints over the hero image in the same stacking
          context — lets the logo's luminosity blend composite against it. */}
      <Header />
      <FAQ />
    </main>
  )
}
