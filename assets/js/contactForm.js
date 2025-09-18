// console.log('ContactForm script starting...');

// Función para mostrar popup con animación
function showPopup(elementId) {
  var popup = document.getElementById(elementId);
  var container = document.querySelector('.popup-container');
  
  if (popup && container) {
    // Ocultar otros popups
    var allPopups = container.querySelectorAll('.popup-success, .popup-error');
    allPopups.forEach(function(p) {
      p.style.display = 'none';
    });
    
    // Mostrar el popup seleccionado
    popup.style.display = 'block';
    container.classList.add('show');
    
    // Fade out después de 3 segundos
    setTimeout(function() {
      container.classList.remove('show');
      setTimeout(function() {
        popup.style.display = 'none';
      }, 300);
    }, 3000);
  }
}

// Función para ocultar popup
function hidePopup(elementId) {
  var popup = document.getElementById(elementId);
  var container = document.querySelector('.popup-container');
  
  if (popup && container) {
    popup.style.display = 'none';
    container.classList.remove('show');
  }
}

// Función para serializar formulario
function serializeForm(form) {
  var formData = new FormData(form);
  var params = new URLSearchParams();
  
  for (var pair of formData.entries()) {
    params.append(pair[0], pair[1]);
  }
  
  return params.toString();
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  // console.log('ContactForm script loaded');
  
  // Asegurar que los mensajes estén ocultos al cargar la página
  hidePopup('popup-success');
  hidePopup('popup-error');
  
  var form = document.getElementById('myForm');
  if (form) {
    // console.log('Form found, adding event listener');
    form.addEventListener('submit', function(event) {
      // console.log('Form submitted');
      event.preventDefault(); // Prevenir el envío tradicional del formulario
      
      var url = "https://formspree.io/f/xknalqjn";
      var formData = serializeForm(form);
      var loading = document.getElementById('loading');
      
      // console.log('Form data:', formData);
      
      // Mostrar loading
      if (loading) {
        loading.style.display = 'block';
      }
      
      // Enviar con fetch
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData
      })
      .then(function(response) {
        // console.log('Response received:', response.status);
        
        // Ocultar loading
        if (loading) {
          loading.style.display = 'none';
        }
        
        if (response.ok) {
          // Éxito
          // console.log('Success - showing success popup');
          form.reset();
          hidePopup('popup-error');
          showPopup('popup-success');
        } else {
          // Error
          // console.log('Error - showing error popup');
          hidePopup('popup-success');
          showPopup('popup-error');
        }
      })
      .catch(function(error) {
        // Error de red
        // console.log('Network error:', error);
        if (loading) {
          loading.style.display = 'none';
        }
        hidePopup('popup-success');
        showPopup('popup-error');
      });
    });
  }
});