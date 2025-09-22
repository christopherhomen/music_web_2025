/**
 * Configuración del Sistema Unificado de Stream
 * Versión 3.0
 */

window.UNIFIED_STREAM_CONFIG = {
  // Configuración general
  general: {
    debounceDelay: 100,        // Tiempo de espera antes de procesar cambios (ms)
    maxRetries: 2,             // Número máximo de reintentos
    timeout: 3000,             // Timeout para requests HTTP (ms)
    enableEnrichment: false,   // Habilitar enriquecimiento con APIs externas
    cacheExpiry: 24 * 60 * 60 * 1000, // Expiración del cache (24 horas)
    maxSearchWords: 4         // Máximo número de palabras para búsqueda
  },
  
  // Palabras a filtrar (expandibles)
  badWords: [
    'intérprete desconocido',
    'interprete desconocido',
    'artista desconocido',
    'desconocido',
    'unknown artist',
    'unknown',
    'n/a',
    'no disponible',
    'not available',
    'sin datos',
    'no data',
    'título desconocido',
    'title unknown',
    'artist unknown',
    'no artist',
    'sin artista',
    'no title',
    'sin título',
    'track unknown',
    'canción desconocida',
    'song unknown'
  ],
  
  // Configuración de APIs
  apis: {
    spotify: {
      clientId: 'f1b16c2196f54bc5af6bebb3dcdcb811',
      clientSecret: '8e271fe82c07474ab3b3d591e3eece49',
      enabled: true,
      priority: 2 // Segundo en orden - mejores imágenes
    },
    appleMusic: {
      enabled: true,
      priority: 3
    },
    lastFm: {
      apiKey: '21f84fcdb8652dccff838fbbb408d91e',
      enabled: true,
      priority: 4 // Bajado de prioridad
    },
    youtubeMusic: {
      apiKey: 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA',
      enabled: true,
      priority: 3 // YouTube Music tiene mejor prioridad
    },
    youtube: {
      apiKey: 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA',
      enabled: true,
      priority: 6 // YouTube normal como último recurso
    },
    local: {
      enabled: true,
      priority: 1 // Más rápido - búsqueda local
    }
  },
  
  // Configuración de logging
  logging: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    showCacheHits: true,
    showImageFound: true,
    showTextCleaned: true
  },
  
  // Configuración de fallback
  fallback: {
    defaultImage: 'assets/img/locutor/default.JPG',
    defaultText: 'Performance Radio',
    enableImageFallback: true,
    enableTextFallback: true
  },
  
  // Configuración de rendimiento
  performance: {
    enableWebWorkers: false,    // Para futuras implementaciones
    enableServiceWorker: false, // Para futuras implementaciones
    maxConcurrentRequests: 3,
    enableRequestDeduplication: true
  }
};

// Función para actualizar configuración en tiempo de ejecución
window.updateStreamConfig = function(newConfig) {
  Object.assign(window.UNIFIED_STREAM_CONFIG, newConfig);
  console.log('🔧 Configuración del stream actualizada:', newConfig);
};

// Función para obtener configuración actual
window.getStreamConfig = function() {
  return window.UNIFIED_STREAM_CONFIG;
};

// Función para resetear configuración a valores por defecto
window.resetStreamConfig = function() {
  // Recargar la configuración desde el archivo
  const script = document.createElement('script');
  script.src = 'assets/js/unified-stream-config.js';
  script.onload = () => {
    console.log('🔄 Configuración del stream reseteada');
  };
  document.head.appendChild(script);
};

console.log('⚙️ Configuración del Sistema Unificado de Stream cargada');
