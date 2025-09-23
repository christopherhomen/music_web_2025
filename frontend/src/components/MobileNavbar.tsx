import { useEffect } from 'react'
import './MobileNavbar.css'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const LINKS: Array<{ id: string; label: string }> = [
  { id: 'hero', label: 'Inicio' },
  { id: 'services', label: 'Servicios' },
  { id: 'locutores', label: 'Locutores' },
  { id: 'top5', label: 'Top 5' },
  { id: 'movie', label: 'Película' },
  { id: 'testimonials', label: 'Testimonios' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contacto' }
]

export default function MobileNavbar({ isOpen, onClose }: Props){
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (!section) return
    const player = document.querySelector('.fixed-player') as HTMLElement | null
    const header = document.querySelector('.site-header') as HTMLElement | null
    const baseY = section.getBoundingClientRect().top + window.pageYOffset
    const offset = (player?.offsetHeight || 0) + (header?.offsetHeight || 0) + 8
    onClose()
    setTimeout(() => {
      window.scrollTo({ top: Math.max(0, baseY - offset), behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className={`mobile-nav ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
      <div className="mobile-nav__backdrop" onClick={onClose} />
      <nav className="mobile-nav__panel" onClick={(e) => e.stopPropagation()}>
        <header className="mobile-nav__header">
          <span>Menú</span>
          <button className="mobile-nav__close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <ul className="mobile-nav__list">
          {LINKS.map(link => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection(link.id) }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

