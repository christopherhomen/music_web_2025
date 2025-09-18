// Align Swiper progressbar width to the active (center) slide
(function(){
  'use strict';

  function alignToActive(cont){
    try{
      if(!cont || !cont.shadowRoot) return;
      const root = cont.shadowRoot;
      const wrapper = root.querySelector('.swiper');
      const active = root.querySelector('.swiper-slide-active');
      if(!wrapper || !active) return;
      const rWrap = wrapper.getBoundingClientRect();
      const rAct  = active.getBoundingClientRect();
      let left  = Math.max(0, Math.round(rAct.left - rWrap.left));
      let right = Math.max(0, Math.round(rWrap.right - rAct.right));
      cont.style.setProperty('--progress-left', left + 'px');
      cont.style.setProperty('--progress-right', right + 'px');
    }catch(e){ /* noop */ }
  }

  function hook(cont){
    // Align after the web component is ready and on slide changes
    const setup = () => {
      alignToActive(cont);
      // marcar listo para evitar flicker
      cont.classList.add('is-ready');
      const sw = cont.swiper;
      if(sw && !sw.__alignedHooked){
        sw.__alignedHooked = true;
        const cb = () => requestAnimationFrame(()=>alignToActive(cont));
        sw.on('slideChangeTransitionStart', cb);
        sw.on('resize', cb);
        window.addEventListener('resize', cb);
      }
    };
    if (cont.swiper) {
      setup();
    } else {
      cont.addEventListener('ready', setup, { once:true });
    }
  }

  function init(){
    document.querySelectorAll('swiper-container#mySwiperDesktop, swiper-container#mySwiperMobile')
      .forEach(hook);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
