/**
 * Sistema Unificado de Metadatos del Stream
 * Versión 3.0 - Optimizada y Eficiente
 * 
 * Características:
 * - Un solo sistema para limpieza de texto y búsqueda de imágenes
 * - Cache inteligente unificado
 * - Debounce optimizado
 * - Búsqueda eficiente por orden de velocidad
 * - Gestión de memoria mejorada
 * - Compatible con APIs existentes (Spotify, Apple Music, Last.fm, YouTube)
 */

class UnifiedStreamProcessor {
  constructor() {
    this.h2Element = document.querySelector('h2.cc_streaminfo');
    this.imgElement = document.querySelector('img.player__img');
    this.prevText = null;
    this.isProcessing = false;
    
    // Cache unificado
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
    
    // Usar configuración externa si está disponible
    if (window.UnifiedStreamConfig) {
      this.config = window.UnifiedStreamConfig.general;
      this.badWords = new Set(window.UnifiedStreamConfig.badWords);
      this.apis = window.UnifiedStreamConfig.apis;
      this.cacheExpiry = window.UnifiedStreamConfig.cache.expiry;
      console.log('✅ Usando configuración externa de UnifiedStreamConfig');
    } else {
      // Configuración por defecto si no hay configuración externa
      this.config = {
        debounceDelay: 100,
        maxRetries: 2,
        timeout: 3000,
        enableEnrichment: false
      };
      this.badWords = new Set([
        'intérprete desconocido', 'interprete desconocido',
        'artista desconocido', 'desconocido', 'unknown artist',
        'unknown', 'n/a', 'no disponible', 'not available',
        'sin datos', 'no data', 'título desconocido', 'title unknown',
        'artist unknown', 'no artist', 'sin artista'
      ]);
      this.apis = {
        spotify: { clientId: 'f1b16c2196f54bc5af6bebb3dcdcb811', clientSecret: '8e271fe82c07474ab3b3d591e3eece49', enabled: true },
        appleMusic: { enabled: true },
        lastFm: { apiKey: '21f84fcdb8652dccff838fbbb408d91e', enabled: true },
        youtube: { apiKey: 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA', enabled: true }
      };
      console.log('⚠️ Usando configuración por defecto (UnifiedStreamConfig no encontrado)');
    }
    
    // Lista de nombres de locutores conocidos
    this.knownLocutors = [
      'david', 'flores', 'david flores',
      'maria', 'jose', 'carlos', 'ana', 'luis', 'patricia',
      'ricardo', 'fernando', 'alejandra', 'miguel', 'sofia',
      'andres', 'carolina', 'juan', 'valentina', 'sebastian',
      'camila', 'diego', 'natalia', 'alejandro', 'isabella'
    ];
    
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
      console.warn('⚠️ Elemento h2.cc_streaminfo no encontrado. Buscando alternativas...');
      // Buscar cualquier elemento que contenga texto del stream
      const possibleElements = document.querySelectorAll('h2, h3, h4, .radio-text, .stream-info');
      for (const el of possibleElements) {
        if (el.textContent && el.textContent.includes('Performance Radio')) {
          this.h2Element = el;
          console.log('✅ Elemento del stream encontrado:', el);
          break;
        }
      }
    }
    
    if (!this.h2Element) {
      console.error('❌ No se pudo encontrar el elemento del stream');
      return;
    }
    
    if (!this.imgElement) {
      console.warn('⚠️ Elemento de imagen no encontrado');
    }
    
    console.log('🎯 Elementos encontrados:', {
      textElement: this.h2Element,
      imageElement: this.imgElement,
      currentText: this.h2Element.textContent
    });
    
    // Un solo MutationObserver
    this.observer = new MutationObserver(() => this.debouncedProcess());
    this.observer.observe(this.h2Element, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
    
    // Procesamiento inicial
    this.process();
    
    // Limpieza inmediata del texto actual
    this.cleanCurrentText();
    
    console.log('🎵 Sistema Unificado de Stream iniciado');
  }
  
  // Limpieza inmediata del texto actual
  cleanCurrentText() {
    if (!this.h2Element) return;
    
    const currentText = this.h2Element.textContent.trim();
    const cleanedText = this.cleanText(currentText);
    
    if (cleanedText !== currentText) {
      this.h2Element.textContent = cleanedText;
      console.log('🚀 Limpieza inmediata aplicada:', currentText, '→', cleanedText);
    }
  }
  
  // Debounce optimizado
  debouncedProcess() {
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
      // 1. Limpiar texto
      const cleanedText = this.cleanText(currentText);
      
      // 2. Actualizar texto si cambió
      if (cleanedText !== currentText) {
        this.h2Element.textContent = cleanedText;
        console.log('📝 Texto limpiado:', currentText, '→', cleanedText);
      }
      
      // 3. Buscar imagen
      await this.updateImage(cleanedText);
      
    } catch (error) {
      console.warn('⚠️ Error procesando stream:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  cleanText(text) {
    if (!text) return 'Performance Radio';
    
    console.log('🧹 Limpiando texto:', text);
    
    // Normalizar y limpiar
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    // Separar por múltiples delimitadores
    const parts = normalized.split(/\s*[-–—:|]\s*/);
    
    // Filtrar palabras malas de manera más agresiva
    const cleanParts = parts.filter(part => {
      const lowerPart = part.toLowerCase().trim();
      
      // Verificar si contiene alguna palabra mala
      const containsBadWord = Array.from(this.badWords).some(badWord => 
        lowerPart.includes(badWord) || badWord.includes(lowerPart)
      );
      
      const isValid = !containsBadWord && lowerPart.length > 0 && lowerPart !== 'desconocido';
      
      if (!isValid) {
        console.log('🚫 Palabra filtrada:', lowerPart);
      }
      
      return isValid;
    });
    
    // Reconstruir texto
    let result = cleanParts.join(' - ').trim();
    
    // Limpieza adicional para casos específicos
    result = result.replace(/^[-–—:\s]+/, ''); // Quitar separadores al inicio
    result = result.replace(/[-–—:\s]+$/, ''); // Quitar separadores al final
    result = result.replace(/\s*[-–—:]\s*[-–—:]\s*/, ' - '); // Limpiar separadores dobles
    
    const finalResult = result || 'Performance Radio';
    console.log('✅ Texto limpio:', text, '→', finalResult);
    
    return finalResult;
  }
  
  async updateImage(text) {
    // Mostrar imagen por defecto inmediatamente
    this.imgElement.src = 'assets/img/locutor/default.JPG';
    
    // Buscar imagen optimizada
    const imageUrl = await this.findImage(text);
    if (imageUrl) {
      this.imgElement.src = imageUrl;
      console.log('🖼️ Imagen encontrada:', imageUrl);
    }
  }
  
  async findImage(text) {
    // Cache check - pero solo para imágenes externas, no para locutores
    const cacheKey = text.toLowerCase();
    const cached = this.cache.get(cacheKey);
    
    // Si detectamos nombres de locutores, no usar cache para forzar búsqueda local
    const locutorNames = this.detectLocutorNames(text);
    if (locutorNames.length > 0) {
      console.log('🎤 Detectados locutores, saltando cache para búsqueda local');
    } else if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      console.log('💾 Cache hit:', cacheKey);
      return cached.url;
    }
    
    // Búsqueda optimizada
    const words = this.extractSearchWords(text);
    if (words.length === 0) return null;
    
    // Buscar en orden de prioridad (configurable)
    const sources = this.getSourcesByPriority();
    
    for (const source of sources) {
      try {
        const url = await this.searchInSource(source, words);
        if (url) {
          // Cache result
          this.cache.set(cacheKey, {
            url: url,
            timestamp: Date.now()
          });
          console.log('✅ Imagen encontrada en', source, ':', url);
          return url;
        }
      } catch (error) {
        console.warn(`❌ Error en ${source}:`, error);
      }
    }
    
    return null;
  }
  
  extractSearchWords(text) {
    // Detectar nombres de locutores comunes
    const locutorNames = this.detectLocutorNames(text);
    if (locutorNames.length > 0) {
      console.log('🎤 Nombres de locutores detectados:', locutorNames);
      return locutorNames;
    }
    
    // Extracción normal de palabras
    return text.split(' ')
      .filter(word => {
        const clean = word.toLowerCase().trim();
        return clean.length > 2 && !this.badWords.has(clean);
      })
      .slice(0, 4); // Limitar a 4 palabras para eficiencia
  }
  
  detectLocutorNames(text) {
    const words = text.toLowerCase().split(/\s+/);
    const detectedNames = [];
    
    // Buscar nombres individuales
    for (const word of words) {
      const cleanWord = word.replace(/[^a-záéíóúñ]/g, '');
      if (this.knownLocutors.includes(cleanWord) && cleanWord.length > 2) {
        detectedNames.push(cleanWord);
      }
    }
    
    // Buscar combinaciones de nombres (ej: "david flores")
    for (let i = 0; i < words.length - 1; i++) {
      const combination = words[i] + ' ' + words[i + 1];
      const cleanCombination = combination.replace(/[^a-záéíóúñ\s]/g, '');
      if (this.knownLocutors.includes(cleanCombination)) {
        // Agregar tanto la combinación con espacio como con guión bajo
        detectedNames.push(cleanCombination);
        detectedNames.push(cleanCombination.replace(' ', '_'));
      }
    }
    
    // Priorizar nombres más largos (más específicos)
    return detectedNames.sort((a, b) => b.length - a.length);
  }
  
  // Obtener fuentes ordenadas por prioridad
  getSourcesByPriority() {
    const sourceMap = {
      'local': 'local',
      'spotify': 'spotify', 
      'apple': 'apple',
      'lastfm': 'lastfm',
      'youtubeMusic': 'youtubeMusic',
      'youtube': 'youtube'
    };
    
    // Ordenar por prioridad (menor número = mayor prioridad)
    return Object.entries(this.apis)
      .filter(([name, config]) => config.enabled)
      .sort((a, b) => (a[1].priority || 999) - (b[1].priority || 999))
      .map(([name]) => sourceMap[name])
      .filter(Boolean);
  }
  
  async searchInSource(source, words) {
    // Implementación optimizada por fuente
    switch (source) {
      case 'local':
        return this.searchLocalImages(words);
      case 'spotify':
        return this.searchSpotify(words);
      case 'apple':
        return this.searchAppleMusic(words);
      case 'youtubeMusic':
        return this.searchYouTubeMusic(words);
      case 'lastfm':
        return this.searchLastFm(words);
      case 'youtube':
        return this.searchYouTube(words);
      default:
        return null;
    }
  }
  
  // Búsqueda en imágenes locales optimizada
  async searchLocalImages(words) {
    console.log('🔍 Buscando imágenes locales para:', words);
    
    // Estrategia 1: Búsqueda directa por nombres de locutores
    for (const word of words) {
      // Limpiar el nombre para búsqueda
      const cleanWord = word.toLowerCase().replace(/[^a-záéíóúñ_]/g, '');
      const imagePath = `assets/img/locutor/${cleanWord}.JPG`;
      console.log('🎤 Probando imagen de locutor:', imagePath);
      
      try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (response.ok) {
          console.log('✅ Imagen de locutor encontrada:', imagePath);
          return imagePath;
        } else {
          console.log(`   ❌ No existe: ${imagePath} (${response.status})`);
        }
      } catch (e) {
        console.log(`   ❌ Error verificando: ${imagePath}`);
      }
    }
    
    // Estrategia 2: Búsqueda por combinaciones (método original)
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j <= words.length; j++) {
        const combination = words.slice(i, j).join('_').toLowerCase();
        const imagePath = `assets/img/locutor/${combination}.JPG`;
        
        // Verificar existencia sin cargar imagen
        try {
          const response = await fetch(imagePath, { method: 'HEAD' });
          if (response.ok) {
            console.log('✅ Imagen local encontrada:', imagePath);
            return imagePath;
          }
        } catch (e) {
          // Continuar con siguiente combinación
        }
      }
    }
    
    console.log('❌ No se encontraron imágenes locales');
    return null;
  }
  
  // Búsqueda en Last.fm
  async searchLastFm(words) {
    if (!this.apis.lastFm.enabled) return null;
    
    const query = words.join(' ');
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${this.apis.lastFm.apiKey}&format=json`;
    
    const response = await fetch(url, { 
      method: 'GET',
      timeout: this.config.timeout 
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.trackmatches && data.results.trackmatches.track) {
      const track = Array.isArray(data.results.trackmatches.track) 
        ? data.results.trackmatches.track[0] 
        : data.results.trackmatches.track;
      
      if (track && track.image && track.image[2]) {
        return track.image[2]['#text'];
      }
    }
    
    return null;
  }
  
  // Búsqueda en Apple Music
  async searchAppleMusic(words) {
    if (!this.apis.appleMusic.enabled) return null;
    
    const query = words.join(' ');
    const url = `https://itunes.apple.com/search?entity=song&limit=1&term=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, { 
      method: 'GET',
      timeout: this.config.timeout 
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return result.artworkUrl100 || result.artworkUrl60 || null;
    }
    
    return null;
  }
  
  // Búsqueda en YouTube Music (optimizada para música)
  async searchYouTubeMusic(words) {
    if (!this.apis.youtubeMusic.enabled) return null;
    
    try {
      const query = words.join(' ') + ' music official';
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=5&key=${this.apis.youtubeMusic.apiKey}`;
      
      const response = await fetch(url, { 
        method: 'GET',
        timeout: this.config.timeout 
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        // Buscar el mejor resultado musical
        for (const item of data.items) {
          if (item.snippet && item.snippet.thumbnails) {
            // Preferir thumbnail de alta calidad
            const thumbnail = item.snippet.thumbnails.maxres || 
                            item.snippet.thumbnails.high || 
                            item.snippet.thumbnails.medium;
            
            if (thumbnail && thumbnail.url) {
              console.log('🎵 YouTube Music: Imagen encontrada para', item.snippet.title);
              return thumbnail.url;
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('❌ Error en búsqueda de YouTube Music:', error);
      return null;
    }
  }
  
  // Búsqueda en Spotify (mejorada)
  async searchSpotify(words) {
    if (!this.apis.spotify.enabled) return null;
    
    try {
      const accessToken = await this.getSpotifyAccessToken();
      if (!accessToken) return null;
      
      // Intentar diferentes estrategias de búsqueda
      const searchStrategies = [
        words.join(' '), // Búsqueda completa
        words.slice(0, 2).join(' '), // Solo primeras 2 palabras
        words[0] // Solo primera palabra
      ];
      
      for (const query of searchStrategies) {
        if (!query.trim()) continue;
        
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          timeout: this.config.timeout
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
          // Buscar la mejor imagen disponible
          for (const track of data.tracks.items) {
            if (track.album && track.album.images && track.album.images.length > 0) {
              // Preferir imagen grande (640x640) o mediana (300x300)
              const bestImage = track.album.images.find(img => img.width >= 300) || track.album.images[0];
              if (bestImage) {
                console.log('🎵 Spotify: Imagen encontrada para', track.name, 'por', track.artists[0].name);
                return bestImage.url;
              }
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('❌ Error en búsqueda de Spotify:', error);
      return null;
    }
  }
  
  // Búsqueda en YouTube normal (último recurso)
  async searchYouTube(words) {
    if (!this.apis.youtube.enabled) return null;
    
    try {
      const query = words.join(' ');
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${this.apis.youtube.apiKey}`;
      
      const response = await fetch(url, { 
        method: 'GET',
        timeout: this.config.timeout 
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        if (item.snippet && item.snippet.thumbnails) {
          const thumbnail = item.snippet.thumbnails.high || 
                          item.snippet.thumbnails.medium;
          if (thumbnail && thumbnail.url) {
            console.log('📺 YouTube: Imagen encontrada para', item.snippet.title);
            return thumbnail.url;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.warn('❌ Error en búsqueda de YouTube:', error);
      return null;
    }
  }
  
  // Obtener token de acceso de Spotify
  async getSpotifyAccessToken() {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(this.apis.spotify.clientId + ':' + this.apis.spotify.clientSecret)}`
        },
        body: 'grant_type=client_credentials'
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.warn('Error obteniendo token de Spotify:', error);
      return null;
    }
  }
  
  // Destruir observador y limpiar recursos
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.cache.clear();
    console.log('🧹 Sistema Unificado destruido');
  }
  
  // Función para agregar nombres de locutores
  addLocutorNames(names) {
    if (Array.isArray(names)) {
      this.knownLocutors = [...this.knownLocutors, ...names.map(name => name.toLowerCase())];
      console.log('🎤 Nombres de locutores agregados:', names);
    }
  }
  
  // Función para obtener lista de locutores conocidos
  getKnownLocutors() {
    return this.knownLocutors;
  }
  
  // Función para limpiar cache de locutores
  clearLocutorCache() {
    const keysToDelete = [];
    for (const [key, value] of this.cache.entries()) {
      // Si la clave contiene nombres de locutores conocidos, eliminar del cache
      for (const locutor of this.knownLocutors) {
        if (key.includes(locutor.toLowerCase())) {
          keysToDelete.push(key);
          break;
        }
      }
    }
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log('🗑️ Cache eliminado para locutor:', key);
    });
    
    console.log(`🧹 Cache limpiado: ${keysToDelete.length} entradas de locutores eliminadas`);
  }
  
  // Método para obtener estadísticas
  getStats() {
    return {
      cacheSize: this.cache.size,
      isProcessing: this.isProcessing,
      prevText: this.prevText,
      searchOrder: this.getSourcesByPriority(),
      apisEnabled: {
        spotify: this.apis.spotify.enabled,
        appleMusic: this.apis.appleMusic.enabled,
        youtubeMusic: this.apis.youtubeMusic.enabled,
        lastFm: this.apis.lastFm.enabled,
        youtube: this.apis.youtube.enabled,
        local: this.apis.local.enabled
      }
    };
  }
}

// Inicialización automática
let streamProcessor = null;

function initUnifiedStreamProcessor() {
  if (streamProcessor) {
    streamProcessor.destroy();
  }
  streamProcessor = new UnifiedStreamProcessor();
  return streamProcessor;
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUnifiedStreamProcessor);
} else {
  initUnifiedStreamProcessor();
}

// Exponer para debugging
window.streamProcessor = streamProcessor;
window.initUnifiedStreamProcessor = initUnifiedStreamProcessor;

// Función para limpiar texto manualmente
window.cleanStreamText = function() {
  if (streamProcessor) {
    streamProcessor.cleanCurrentText();
    console.log('🧹 Limpieza manual ejecutada');
  } else {
    console.error('❌ Sistema unificado no está inicializado');
  }
};

// Función para forzar limpieza de texto específico
window.forceCleanText = function(text) {
  if (streamProcessor) {
    const cleaned = streamProcessor.cleanText(text);
    console.log('🧹 Texto forzado:', text, '→', cleaned);
    return cleaned;
  } else {
    console.error('❌ Sistema unificado no está inicializado');
    return text;
  }
};

// Función para mostrar el orden de búsqueda actual
window.showSearchOrder = function() {
  if (streamProcessor) {
    const stats = streamProcessor.getStats();
    console.log('🔍 Orden de búsqueda de imágenes:');
    stats.searchOrder.forEach((source, index) => {
      const emoji = {
        'local': '📁',
        'spotify': '🎵',
        'apple': '🍎',
        'youtubeMusic': '🎶',
        'lastfm': '🎧',
        'youtube': '📺'
      }[source] || '❓';
      console.log(`   ${index + 1}. ${emoji} ${source.toUpperCase()}`);
    });
    return stats.searchOrder;
  } else {
    console.error('❌ Sistema unificado no está inicializado');
    return [];
  }
};

// Funciones para gestionar nombres de locutores
window.addLocutorNames = function(names) {
  if (streamProcessor) {
    streamProcessor.addLocutorNames(names);
    console.log('🎤 Nombres agregados. Lista actual:', streamProcessor.getKnownLocutors());
  } else {
    console.error('❌ Sistema unificado no está inicializado');
  }
};

window.getKnownLocutors = function() {
  if (streamProcessor) {
    const locutors = streamProcessor.getKnownLocutors();
    console.log('🎤 Locutores conocidos:', locutors);
    return locutors;
  } else {
    console.error('❌ Sistema unificado no está inicializado');
    return [];
  }
};

// Función para probar detección de locutores
window.testLocutorDetection = function(text) {
  if (streamProcessor) {
    const detected = streamProcessor.detectLocutorNames(text);
    console.log(`🎤 Texto: "${text}"`);
    console.log(`🎤 Locutores detectados:`, detected);
    return detected;
  } else {
    console.error('❌ Sistema unificado no está inicializado');
    return [];
  }
};

// Función para limpiar cache de locutores
window.clearLocutorCache = function() {
  if (streamProcessor) {
    streamProcessor.clearLocutorCache();
    console.log('🧹 Cache de locutores limpiado');
  } else {
    console.error('❌ Sistema unificado no está inicializado');
  }
};

// Función para forzar búsqueda de imagen (sin cache)
window.forceImageSearch = function(text) {
  if (streamProcessor) {
    console.log(`🔍 Forzando búsqueda de imagen para: "${text}"`);
    return streamProcessor.findImage(text);
  } else {
    console.error('❌ Sistema unificado no está inicializado');
    return null;
  }
};
