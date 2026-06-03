import ShaderBackground from './ShaderBackground'
import Poster from './Poster'
import FAQ from './FAQ'

export default function App() {
  return (
    <>
      <ShaderBackground />
      <main className="page">
        <Poster />
        <FAQ />
      </main>
    </>
  )
}
