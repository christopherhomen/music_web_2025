import './App.css'
import Header from './components/Header'
import BannerHorizontal from './components/BannerHorizontal'
import Hero from './components/Hero'
import Services from './components/Services'
import Locutores from './components/Locutores'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import FixedPlayer from './components/FixedPlayer'
import Top5 from './components/Top5'
import MovieRecommended from './components/MovieRecommended'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <>
      <FixedPlayer />
      <Header />
      <main>
        <section id="hero"><Hero /></section>
        <section id="top5"><Top5 /></section>
        <section id="movie"><MovieRecommended /></section>
        <section id="banner"><BannerHorizontal /></section>
        <section id="services"><Services /></section>
        <section id="locutores"><Locutores /></section>
        <section id="testimonials"><Testimonials /></section>
        <section id="faq"><FAQ /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App
