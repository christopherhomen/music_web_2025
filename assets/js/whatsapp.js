window.addEventListener("scroll", function() {
  // Obtener referencia al botón de WhatsApp (nuevo selector)
  var whatsappButton = document.querySelector(".whatsapp-btn");
  
  // Verificar que el botón existe antes de continuar
  if (!whatsappButton) {
    return; // Salir si no existe el botón
  }
  
  // Obtener posición de desplazamiento vertical
  var scrollPosition = window.scrollY || document.documentElement.scrollTop;

  if (scrollPosition > 0) {
    // Si el desplazamiento es mayor a 0, mostrar gradualmente el botón
    whatsappButton.style.display = "block";
    whatsappButton.style.opacity = 1; // Establecer opacidad a 1 para mostrar gradualmente
  } else {
    // Si el desplazamiento es igual a 0, ocultar gradualmente el botón
    whatsappButton.style.opacity = 0; // Establecer opacidad a 0 para ocultar gradualmente
    
    // Ocultar el botón después de 0.5 segundos (500 milisegundos)
    setTimeout(function() {
      whatsappButton.style.display = "none";
    }, 500);
  }
});
