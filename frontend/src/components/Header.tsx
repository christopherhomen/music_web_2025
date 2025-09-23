import { useState, useCallback } from 'react'
import './Header.css'
import MobileNavbar from './MobileNavbar'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const open = useCallback(() => setIsMenuOpen(true), [])
  const close = useCallback(() => setIsMenuOpen(false), [])

  return (
    <>
      <header className="site-header">
        <a href="#hero" className="logo">Performance</a>
        <button className="mobile-nav-toggle" onClick={open} aria-label="Abrir menú">☰</button>
      </header>
      <MobileNavbar isOpen={isMenuOpen} onClose={close} />
    </>
  )
}


