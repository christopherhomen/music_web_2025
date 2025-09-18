                    // Número total de imágenes
const totalImages = 28;

// Generar una lista del 1 al total de imágenes, y luego mezclar el orden aleatoriamente
const imageOrder = Array.from({ length: totalImages }, (_, i) => i + 1);
imageOrder.sort(() => Math.random() - 0.5); // Mezclar aleatoriamente las imágenes

// Obtener contenedores de Swiper para escritorio y móvil
const swiperDesktop = document.getElementById('mySwiperDesktop');
const swiperMobile = document.getElementById('mySwiperMobile');

// Añadir las imágenes al swiper de escritorio (slides-per-view=3)
imageOrder.forEach(number => {
    const swiperSlide = document.createElement('swiper-slide');
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = `./assets/img/programas/${number}.webp`;

    swiperSlide.appendChild(img);
    swiperDesktop.appendChild(swiperSlide);
});

// Añadir las imágenes al swiper de móvil (slides-per-view=1)
imageOrder.forEach(number => {
    const swiperSlide = document.createElement('swiper-slide');
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = `./assets/img/programas/${number}.webp`;

    swiperSlide.appendChild(img);
    swiperMobile.appendChild(swiperSlide);
});

// Ocultar o mostrar swipers dependiendo del tamaño de la pantalla
function adjustSwiperVisibility() {
    if (window.innerWidth <= 768) {
        swiperDesktop.style.display = 'none';
        swiperMobile.style.display = 'block';
    } else {
        swiperDesktop.style.display = 'block';
        swiperMobile.style.display = 'none';
    }
}




