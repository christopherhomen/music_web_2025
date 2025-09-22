import "./BannerHorizontal.css";

export default function BannerHorizontal(){
  return (
    <section className="banner-horizontal">
      <div className="container">
        <img src="/assets/img/logo/brands/pelipup.png" alt="Pelipup" className="pelipup"/>
        <div className="text">
          <h2 className="heading">Activa aquí tus plataformas favoritas</h2>
          <div className="logos">
            <img loading="lazy" src="/assets/img/logo/brands/netflix.png" alt="Netflix"/>
            <img loading="lazy" src="/assets/img/logo/brands/amazon.png" alt="Amazon Prime Video"/>
            <img loading="lazy" src="/assets/img/logo/brands/disney.png" alt="Disney+"/>
            <img loading="lazy" src="/assets/img/logo/brands/hbo.png" alt="HBO Max"/>
            <img loading="lazy" src="/assets/img/logo/brands/youtube.png" alt="YouTube Premium"/>
          </div>
          <div>
            <a href="https://wa.me/573126725787" className="cta"><span className="spark"></span> Click Aquí</a>
            <a className="wa" href="https://wa.me/573126725787" target="_blank" rel="noopener">
              <img className="icon" src="/assets/img/logo/brands/whatsapp.svg" alt="WhatsApp"/>
              Escríbenos al 3126725787
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


