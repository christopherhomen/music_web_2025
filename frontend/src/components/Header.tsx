import './Header.css'

export default function Header() {
  return (
    <header className="site-header">
      <a href="/" className="logo">Performance</a>
      <button className="mobile-nav-toggle" aria-label="Abrir menú">☰</button>
    </header>
  )
}


