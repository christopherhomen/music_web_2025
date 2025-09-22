/**
 * Web Worker para Búsquedas Ultra Rápidas
 * Procesa búsquedas en paralelo sin bloquear el hilo principal
 */

// Listener para mensajes del hilo principal
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'SEARCH_LOCAL':
      searchLocalImages(data.words, data.strategies)
        .then(result => {
          self.postMessage({ type: 'SEARCH_LOCAL_RESULT', result });
        })
        .catch(error => {
          self.postMessage({ type: 'SEARCH_LOCAL_ERROR', error: error.message });
        });
      break;
      
    case 'SEARCH_EXTERNAL':
      searchExternalAPIs(data.words, data.token)
        .then(result => {
          self.postMessage({ type: 'SEARCH_EXTERNAL_RESULT', result });
        })
        .catch(error => {
          self.postMessage({ type: 'SEARCH_EXTERNAL_ERROR', error: error.message });
        });
      break;
      
    case 'CLEAN_TEXT':
      const cleaned = cleanText(data.text, data.badWords);
      self.postMessage({ type: 'CLEAN_TEXT_RESULT', result: cleaned });
      break;
  }
};

// Búsqueda local en paralelo
async function searchLocalImages(words, strategies) {
  const searchPromises = strategies.map(async (strategy) => {
    const imagePath = `assets/img/locutor/${strategy}.JPG`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300); // 300ms timeout
      
      const response = await fetch(imagePath, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return imagePath;
      }
    } catch (e) {
      // Continuar con siguiente estrategia
    }
    
    return null;
  });
  
  // Esperar la primera respuesta exitosa
  const results = await Promise.allSettled(searchPromises);
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }
  
  return null;
}

// Búsqueda externa en paralelo
async function searchExternalAPIs(words, token) {
  if (!token) return null;
  
  const query = words.slice(0, 2).join(' ');
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        if (track.album && track.album.images && track.album.images.length > 0) {
          return track.album.images[0].url;
        }
      }
    }
  } catch (error) {
    // Error silencioso
  }
  
  return null;
}

// Limpieza de texto optimizada
function cleanText(text, badWords) {
  if (!text) return 'Performance Radio';
  
  const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const parts = normalized.split(/\s*[-–—:|]\s*/);
  
  const cleanParts = parts.filter(part => {
    const lowerPart = part.toLowerCase().trim();
    return !badWords.has(lowerPart) && lowerPart.length > 0;
  });
  
  let result = cleanParts.join(' - ').trim();
  result = result.replace(/^[-–—:\s]+/, '').replace(/[-–—:\s]+$/, '');
  
  return result || 'Performance Radio';
}

console.log('⚡ Web Worker de búsquedas ultra rápidas inicializado');









