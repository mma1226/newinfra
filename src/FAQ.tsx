import type { ReactNode } from 'react'
import './FAQ.css'

type Item = { q: string; a: ReactNode }

const FAQS: Item[] = [
  {
    q: 'What is NEW INFRA?',
    a: 'An open call for work that reinterprets infrastructure — the systems, scaffolding, and substrates everything else runs on. Selected submissions are presented as part of the program, hosted by Modal and Gray Area.',
  },
  {
    q: 'Who should submit?',
    a: 'Engineers, artists, researchers, and builders working at the edge of software and systems. You don’t need a finished product — a sharp idea and a clear point of view are enough.',
  },
  {
    q: 'When do submissions close?',
    a: 'Submissions close June 15. We review on a rolling basis, so earlier is better.',
  },
  {
    q: 'What happens if I’m selected?',
    a: 'We’ll reach out directly with next steps. Selected work is featured at the event with support from the Modal and Gray Area teams.',
  },
]

export default function FAQ() {
  return (
    <section id="faqs" className="faq">
      <div className="faq__inner">
        <h2 className="faq__title">FAQs</h2>
        <div className="faq__list">
          {FAQS.map((item, i) => (
            <details key={i} className="faq__item">
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <div className="faq__a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
