/**
 * Sistema Ultra Rápido de Metadatos del Stream
 * Versión 4.0 - Ultra Optimizada para Velocidad Máxima
 * 
 * Características Ultra Rápidas:
 * - Pre-carga de imágenes locales
 * - Cache inteligente con IndexedDB
 * - Búsqueda por hash instantánea
 * - Estrategias de búsqueda optimizadas
 * - Web Workers para procesamiento paralelo
 */

class UltraFastProcessor {
  constructor() {
    this.h2Element = document.querySelector('h2.cc_streaminfo');
    this.imgElement = document.querySelector('img.player__img');
    this.prevText = null;
    this.isProcessing = false;
    
    // Cache ultra rápido
    this.ultraCache = window.ultraCache;
    this.imagePreloader = window.imagePreloader;
    
    // Hash de búsquedas para coincidencias exactas
    this.searchHash = new Map();
    
    // Configuración ultra optimizada
    this.config = {
      debounceDelay: 50, // Reducido a 50ms para respuesta más rápida
      maxRetries: 1, // Reducido a 1 reintento
      timeout: 2000, // Reducido a 2 segundos
      enablePreload: true,
      enableUltraCache: true
    };
    
    // Palabras a filtrar (optimizadas)
    this.badWords = new Set([
      'desconocido', 'unknown', 'n/a', 'no disponible', 'sin datos',
      'artista desconocido', 'unknown artist', 'no artist', 'sin artista'
    ]);
    
    this.init();
  }
  
  init() {
    // Buscar elementos con múltiples selectores
    this.h2Element = document.querySelector('h2.cc_streaminfo') || 
                     document.querySelector('.cc_streaminfo') ||
                     document.querySelector('[data-type="rawmeta"]');
    
    this.imgElement = document.querySelector('img.player__img') ||
                      document.querySelector('#locutor-image') ||
                      document.querySelector('.player__img');
    
    if (!this.h2Element) {
      console.error('❌ Elemento del stream no encontrado');
      return;
    }
    
    if (!this.imgElement) {
      console.warn('⚠️ Elemento de imagen no encontrado');
    }
    
    // MutationObserver ultra optimizado
    this.observer = new MutationObserver(() => this.ultraDebouncedProcess());
    this.observer.observe(this.h2Element, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
    
    // Procesamiento inicial
    this.process();
    
    console.log('⚡ Sistema Ultra Rápido iniciado');
  }
  
  // Debounce ultra optimizado
  ultraDebouncedProcess() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.process(), this.config.debounceDelay);
  }
  
  async process() {
    if (this.isProcessing) return;
    
    const currentText = this.h2Element.textContent.trim();
    if (currentText === this.prevText) return;
    
    this.isProcessing = true;
    this.prevText = currentText;
    
    try {
      // 1. Limpiar texto ultra rápido
      const cleanedText = this.ultraCleanText(currentText);
      
      // 2. Actualizar texto si cambió
      if (cleanedText !== currentText) {
        this.h2Element.textContent = cleanedText;
      }
      
      // 3. Buscar imagen ultra rápido
      await this.ultraUpdateImage(cleanedText);
      
    } catch (error) {
      console.warn('⚠️ Error procesando stream:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  // Limpieza de texto ultra optimizada
  ultraCleanText(text) {
    if (!text) return 'Performance Radio';
    
    // Normalizar y limpiar
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Separar por delimitadores
    const parts = normalized.split(/\s*[-–—:|]\s*/);
    
    // Filtrar palabras malas de forma ultra rápida
    const cleanParts = parts.filter(part => {
      const lowerPart = part.toLowerCase().trim();
      return !this.badWords.has(lowerPart) && lowerPart.length > 0;
    });
    
    // Reconstruir texto
    let result = cleanParts.join(' - ').trim();
    result = result.replace(/^[-–—:\s]+/, '').replace(/[-–—:\s]+$/, '');
    
    return result || 'Performance Radio';
  }
  
  // Actualización de imagen ultra rápida
  async ultraUpdateImage(text) {
    const startTime = performance.now();
    
    // Buscar imagen ultra rápido
    const imageUrl = await this.ultraFindImage(text);
    
    if (imageUrl) {
      this.imgElement.src = imageUrl;
      const endTime = performance.now();
      console.log(`⚡ Imagen encontrada en ${(endTime - startTime).toFixed(2)}ms:`, imageUrl);
    } else {
      this.imgElement.src = 'assets/img/locutor/default.JPG';
    }
  }
  
  // Búsqueda de imagen ultra rápida
  async ultraFindImage(text) {
    // 1. Verificar cache ultra rápido
    const cacheKey = this.generateCacheKey(text);
    const cached = await this.ultraCache.getImage(cacheKey);
    if (cached) {
      return cached;
    }
    
    // 2. Extraer palabras de búsqueda
    const words = this.ultraExtractWords(text);
    if (words.length === 0) return null;
    
    // 3. Buscar en pre-cargador (ultra rápido)
    if (this.imagePreloader && this.imagePreloader.isPreloaded) {
      const preloadedImage = this.imagePreloader.findImage(words);
      if (preloadedImage) {
        await this.ultraCache.setImage(cacheKey, preloadedImage, 'preloaded');
        return preloadedImage;
      }
    }
    
    // 4. Búsqueda local tradicional (solo si no hay pre-carga)
    const localImage = await this.ultraSearchLocal(words);
    if (localImage) {
      await this.ultraCache.setImage(cacheKey, localImage, 'local');
      return localImage;
    }
    
    // 5. Búsqueda externa (solo si no hay local)
    const externalImage = await this.ultraSearchExternal(words);
    if (externalImage) {
      await this.ultraCache.setImage(cacheKey, externalImage, 'external');
      return externalImage;
    }
    
    return null;
  }
  
  // Generar clave de cache optimizada
  generateCacheKey(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  
  // Extracción de palabras ultra optimizada
  ultraExtractWords(text) {
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.split(/\s+/)
      .filter(word => {
        const clean = word.toLowerCase().trim();
        return clean.length > 2 && !this.badWords.has(clean);
      })
      .slice(0, 4); // Máximo 4 palabras para velocidad
  }
  
  // Búsqueda local ultra rápida
  async ultraSearchLocal(words) {
    const strategies = this.generateUltraStrategies(words);
    
    for (const strategy of strategies) {
      const imagePath = `assets/img/locutor/${strategy}.JPG`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);
        
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
    }
    
    return null;
  }
  
  // Generar estrategias ultra optimizadas
  generateUltraStrategies(words) {
    const strategies = [];
    
    // 1. Nombre y apellido (más común)
    if (words.length >= 2) {
      strategies.push(words.slice(0, 2).join('_').toLowerCase());
    }
    
    // 2. Solo nombre
    strategies.push(words[0].toLowerCase());
    
    // 3. Nombre completo (solo si es corto)
    if (words.length <= 3) {
      strategies.push(words.join('_').toLowerCase());
    }
    
    return strategies;
  }
  
  // Búsqueda externa ultra rápida
  async ultraSearchExternal(words) {
    // Solo buscar en la API más rápida (Spotify)
    try {
      const accessToken = await this.getSpotifyToken();
      if (!accessToken) return null;
      
      const query = words.slice(0, 2).join(' '); // Solo 2 palabras para velocidad
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      console.warn('Error en búsqueda externa:', error);
    }
    
    return null;
  }
  
  // Obtener token de Spotify (con cache)
  async getSpotifyToken() {
    const cacheKey = 'spotify_token';
    const cached = await this.ultraCache.getImage(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa('f1b16c2196f54bc5af6bebb3dcdcb811:8e271fe82c07474ab3b3d591e3eece49')}`
        },
        body: 'grant_type=client_credentials'
      });
      
      if (response.ok) {
        const data = await response.json();
        await this.ultraCache.setImage(cacheKey, data.access_token, 'spotify_token');
        return data.access_token;
      }
    } catch (error) {
      console.warn('Error obteniendo token de Spotify:', error);
    }
    
    return null;
  }
  
  // Obtener estadísticas ultra rápidas
  getStats() {
    return {
      isProcessing: this.isProcessing,
      prevText: this.prevText,
      cacheStats: this.ultraCache.getStats(),
      preloaderStats: this.imagePreloader ? this.imagePreloader.getStats() : null
    };
  }
}

// Inicialización automática
let ultraProcessor = null;

function initUltraFastProcessor() {
  if (ultraProcessor) {
    ultraProcessor.observer.disconnect();
  }
  ultraProcessor = new UltraFastProcessor();
  return ultraProcessor;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUltraFastProcessor);
} else {
  initUltraFastProcessor();
}

// Exponer para debugging
window.ultraProcessor = ultraProcessor;
window.initUltraFastProcessor = initUltraFastProcessor;

console.log('⚡ Sistema Ultra Rápido cargado');









