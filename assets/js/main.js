/**
* Template Name: Valera - v4.8.1
* Template URL: https://bootstrapmade.com/valera-free-bootstrap-theme/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";


    var vid = document.getElementById("myVideo"); 

    function playVid() { 
        vid.play(); 
    } 

    function pauseVid() { 
        vid.pause(); 
    } 

  
  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    let headerOffset = selectHeader.offsetTop
    let nextElement = selectHeader.nextElementSibling
    const headerFixed = () => {
      if (window.scrollY > headerOffset) {
        selectHeader.classList.add('fixed-top')
        nextElement.classList.add('scrolled-offset')
      } else {
        selectHeader.classList.remove('fixed-top')
        nextElement.classList.remove('scrolled-offset')
      }
    }
    window.addEventListener('load', headerFixed)
    onscroll(document, headerFixed)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle - Simple dropdown
   */
  on('click', '.mobile-nav-toggle', function(e) {
    e.preventDefault()
    // console.log('🔍 HAMBURGUESA CLICKED!')
    
    const navbar = select('#navbar')
    // console.log('📱 Navbar encontrado:', navbar)
    
    const navList = navbar.querySelector('ul')
    // console.log('📋 Lista encontrada:', navList)
    // console.log('📋 Lista classes:', navList.className)
    
    const isActive = navList.classList.contains('active')
    // console.log('✅ ¿Está activo?', isActive)
    
    if (isActive) {
      // console.log('❌ CERRANDO menú...')
      navList.classList.remove('active')
      
      // Restaurar scroll del body
      // console.log('✅ Restaurando scroll del body...')
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      // console.log('✅ Body styles restaurados')
      
      // Aplicar estilos directamente para cerrar
      navList.style.setProperty('position', 'static', 'important')
      navList.style.setProperty('display', 'none', 'important')
      navList.style.setProperty('opacity', '0', 'important')
      navList.style.setProperty('visibility', 'hidden', 'important')
      navList.style.setProperty('transform', 'none', 'important')
      navList.style.setProperty('z-index', 'auto', 'important')
      this.classList.remove('bi-x')
      this.classList.add('bi-list')
      // console.log('❌ Menú cerrado. Classes actuales:', navList.className)
    } else {
      // console.log('✅ ABRIENDO menú...')
      navList.classList.add('active')
      
      // Aplicar estilos directamente para abrir - Menú centrado
      navList.style.setProperty('position', 'fixed', 'important')
      navList.style.setProperty('top', '50%', 'important')
      navList.style.setProperty('left', '50%', 'important')
      navList.style.setProperty('right', 'auto', 'important')
      navList.style.setProperty('width', '90%', 'important')
      navList.style.setProperty('max-width', '400px', 'important')
      navList.style.setProperty('transform', 'translate(-50%, -50%)', 'important')
      navList.style.setProperty('background', 'rgba(0, 0, 0, 0.95)', 'important')
      navList.style.setProperty('backdrop-filter', 'blur(10px)', 'important')
      navList.style.setProperty('-webkit-backdrop-filter', 'blur(10px)', 'important')
      navList.style.setProperty('border-radius', '12px', 'important')
      navList.style.setProperty('box-shadow', '0 20px 60px rgba(0, 0, 0, 0.5)', 'important')
      navList.style.setProperty('padding', '20px 0', 'important')
      navList.style.setProperty('margin', '0', 'important')
      navList.style.setProperty('opacity', '1', 'important')
      navList.style.setProperty('visibility', 'visible', 'important')
      navList.style.setProperty('transition', 'all 0.3s ease', 'important')
      navList.style.setProperty('z-index', '9999', 'important')
      navList.style.setProperty('display', 'block', 'important')
      
      // NO crear overlay por ahora - simplificar
      // console.log('🚫 Sin overlay - menú simple')
      
      // Prevenir scroll del body
      // console.log('🚫 Bloqueando scroll del body...')
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      // console.log('🚫 Body styles aplicados:', {
      //   overflow: document.body.style.overflow,
      //   position: document.body.style.position,
      //   width: document.body.style.width
      // })
      
      // Forzar reflow para asegurar que se aplique
      navList.offsetHeight
      
      this.classList.remove('bi-list')
      this.classList.add('bi-x')
      // console.log('✅ Menú abierto. Classes actuales:', navList.className)
      
      // Verificar que los enlaces están disponibles
      const links = navList.querySelectorAll('a')
      // console.log('🔗 Enlaces encontrados en el menú:', links.length)
      links.forEach((link, index) => {
        // console.log(`🔗 Enlace ${index + 1}:`, link.textContent, 'href:', link.href)
      })
      
      // Verificar que los eventos están funcionando
      // console.log('🎯 Verificando eventos de click...')
      // console.log('🎯 ¿NavList tiene eventos?', navList.outerHTML.substring(0, 100))
      
      // Monitorear cambios en los estilos
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            // console.log('⚠️ ESTILOS CAMBIADOS AUTOMÁTICAMENTE:', navList.style.cssText)
            // console.log('⚠️ Stack trace:', new Error().stack)
          }
        })
      })
      observer.observe(navList, { attributes: true, attributeFilter: ['style'] })
    }
    
    // Verificar estilos aplicados
    const computedStyle = window.getComputedStyle(navList)
    // console.log('🎨 Opacity:', computedStyle.opacity)
    // console.log('🎨 Visibility:', computedStyle.visibility)
    // console.log('🎨 Transform:', computedStyle.transform)
    // console.log('🎨 Z-index:', computedStyle.zIndex)
    // console.log('🎨 Display:', computedStyle.display)
    // console.log('🎨 Position:', computedStyle.position)
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Cerrar menú móvil al hacer clic en enlaces
   */
  on('click', '.navbar ul li a', function(e) {
    // console.log('🔗 ENLACE CLICKED!')
    // console.log('🔗 Elemento clickeado:', this)
    // console.log('🔗 Texto del enlace:', this.textContent)
    // console.log('🔗 href del enlace:', this.href)
    // console.log('🔗 Evento:', e)
    // console.log('🔗 Target:', e.target)
    // console.log('🔗 CurrentTarget:', e.currentTarget)
    
    const navbar = select('#navbar')
    const navList = navbar.querySelector('ul')
    const toggle = select('.mobile-nav-toggle')
    
    // console.log('📋 Lista classes antes:', navList.className)
    // console.log('📋 ¿Lista tiene clase active?', navList.classList.contains('active'))
    
    if (navList.classList.contains('active')) {
      // console.log('❌ Cerrando menú desde enlace...')
      navList.classList.remove('active')
      
      // Restaurar scroll del body
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      
      // Aplicar estilos directamente para cerrar
      // console.log('🎨 Aplicando estilos de cierre...')
      navList.style.setProperty('position', 'static', 'important')
      navList.style.setProperty('display', 'none', 'important')
      navList.style.setProperty('opacity', '0', 'important')
      navList.style.setProperty('visibility', 'hidden', 'important')
      navList.style.setProperty('transform', 'none', 'important')
      navList.style.setProperty('z-index', 'auto', 'important')
      
      if (toggle) {
        // console.log('🔄 Cambiando icono a hamburguesa...')
        toggle.classList.remove('bi-x')
        toggle.classList.add('bi-list')
      }
      
      // console.log('❌ Menú cerrado desde enlace. Classes:', navList.className)
      // console.log('❌ Estilos finales aplicados')
    } else {
      // console.log('⚠️ Lista no tiene clase active, no se cierra')
    }
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    // Excluir enlaces del navbar móvil para evitar conflictos
    if (this.closest('.mobile-navbar')) {
      console.log('🚫 Enlace del navbar móvil detectado, ignorando main.js scrollto');
      return;
    }
    
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  




})()