/**
 * Configuración del Sistema de Búsqueda de Imágenes
 * Centraliza todas las configuraciones y APIs
 */

const ImageSearchConfig = {
  // Configuración de APIs
  apis: {
    spotify: {
      clientId: 'f1b16c2196f54bc5af6bebb3dcdcb811',
      clientSecret: '8e271fe82c07474ab3b3d591e3eece49',
      enabled: true, // Habilitado con las credenciales configuradas
      scopes: ['user-read-currently-playing', 'user-read-playback-state']
    },
    appleMusic: {
      enabled: true,
      baseUrl: 'https://itunes.apple.com/search',
      timeout: 3000
    },
    lastFm: {
      apiKey: '21f84fcdb8652dccff838fbbb408d91e',
      enabled: true,
      baseUrl: 'https://ws.audioscrobbler.com/2.0/',
      timeout: 3000
    },
    youtube: {
      apiKey: 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA',
      enabled: true,
      baseUrl: 'https://www.googleapis.com/youtube/v3/search',
      timeout: 3000
    },
    deezer: {
      enabled: false, // Futura implementación
      baseUrl: 'https://api.deezer.com/search',
      timeout: 3000
    }
  },
  
  // Configuración de búsqueda
  search: {
    timeout: 5000,
    maxConcurrent: 3,
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 horas
    similarityThreshold: 0.7,
    retryAttempts: 3,
    retryDelay: 2000
  },
  
  // Configuración de cache
  cache: {
    maxSize: 1000,
    cleanupInterval: 60 * 60 * 1000, // 1 hora
    compressionEnabled: true
  },
  
  // Configuración de imágenes locales
  localImages: {
    basePath: 'assets/img/locutor/',
    defaultImage: 'assets/img/locutor/default.JPG',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    fallbackImages: [
      'assets/img/locutor/default.JPG',
      'assets/img/logo/logo1.png'
    ]
  },
  
  // Palabras a filtrar
  filterWords: [
    'desconocido', 'unknown', 'interprete', 'artista', 'n/a',
    'performance radio', 'al aire', 'en vivo', 'streaming',
    'radio', 'fm', 'am', 'online', 'live'
  ],
  
  // Separadores para detectar artista-título
  separators: /[-–—:|,]/,
  
  // Configuración de logging
  logging: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    showTimings: true
  }
};

// Función para validar configuración
function validateConfig() {
  const errors = [];
  
  // Validar APIs habilitadas
  const enabledApis = Object.entries(ImageSearchConfig.apis)
    .filter(([_, config]) => config.enabled);
  
  if (enabledApis.length === 0) {
    errors.push('No hay APIs habilitadas para búsqueda de imágenes');
  }
  
  // Validar claves de API
  if (ImageSearchConfig.apis.youtube.enabled && !ImageSearchConfig.apis.youtube.apiKey) {
    errors.push('YouTube API key no configurada');
  }
  
  if (ImageSearchConfig.apis.lastFm.enabled && !ImageSearchConfig.apis.lastFm.apiKey) {
    errors.push('Last.fm API key no configurada');
  }
  
  if (ImageSearchConfig.apis.spotify.enabled && !ImageSearchConfig.apis.spotify.clientId) {
    errors.push('Spotify Client ID no configurado');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Función para obtener configuración de API específica
function getApiConfig(apiName) {
  return ImageSearchConfig.apis[apiName] || null;
}

// Función para habilitar/deshabilitar APIs
function toggleApi(apiName, enabled) {
  if (ImageSearchConfig.apis[apiName]) {
    ImageSearchConfig.apis[apiName].enabled = enabled;
    console.log(`API ${apiName} ${enabled ? 'habilitada' : 'deshabilitada'}`);
  }
}

// Exportar configuración
window.ImageSearchConfig = ImageSearchConfig;
window.validateImageSearchConfig = validateConfig;
window.getApiConfig = getApiConfig;
window.toggleImageSearchApi = toggleApi;

// Validar configuración al cargar
document.addEventListener('DOMContentLoaded', () => {
  const validation = validateConfig();
  if (!validation.isValid) {
    console.warn('⚠️ Configuración de búsqueda de imágenes tiene problemas:', validation.errors);
  } else {
    console.log('✅ Configuración de búsqueda de imágenes válida');
  }
});
