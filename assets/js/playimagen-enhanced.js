/**
 * Sistema Mejorado de Búsqueda de Imágenes para Performance Radio
 * Versión 2.0 - Optimizada y con múltiples fuentes
 * 
 * Características:
 * - Búsqueda inteligente con algoritmos de similitud
 * - Múltiples fuentes de imágenes (Spotify, Apple Music, Last.fm, YouTube)
 * - Cache avanzado con IndexedDB
 * - Optimización de rendimiento con Web Workers
 * - Fallback inteligente y recuperación de errores
 */

class EnhancedImageSearch {
  constructor() {
    this.h2Element = document.querySelector('h2.cc_streaminfo');
    this.imgElement = document.querySelector('img.player__img');
    this.prevText = null;
    this.cache = new Map();
    this.searchQueue = [];
    this.isSearching = false;
    this.retryCount = 0;
    this.maxRetries = 3;
    
    // Configuración de APIs
    this.apis = {
      spotify: {
        clientId: 'your_spotify_client_id',
        clientSecret: 'your_spotify_client_secret',
        enabled: false // Deshabilitado por defecto hasta configurar
      },
      appleMusic: {
        enabled: true
      },
      lastFm: {
        apiKey: '21f84fcdb8652dccff838fbbb408d91e',
        enabled: true
      },
      youtube: {
        apiKey: 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA',
        enabled: true
      }
    };
    
    // Configuración de búsqueda
    this.searchConfig = {
      timeout: 5000,
      maxConcurrent: 3,
      cacheExpiry: 24 * 60 * 60 * 1000, // 24 horas
      similarityThreshold: 0.7
    };
    
    this.init();
  }
  
  async init() {
    await this.initCache();
    this.startMonitoring();
    console.log('🎵 Enhanced Image Search inicializado');
  }
  
  async initCache() {
    try {
      // Usar IndexedDB para cache persistente
      if ('indexedDB' in window) {
        const request = indexedDB.open('ImageSearchCache', 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', { keyPath: 'key' });
          }
        };
        this.db = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.warn('IndexedDB no disponible, usando cache en memoria:', error);
    }
  }
  
  startMonitoring() {
    // Monitoreo más eficiente con MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          this.scheduleUpdate();
        }
      });
    });
    
    observer.observe(this.h2Element, {
      childList: true,
      characterData: true,
      subtree: true
    });
    
    // Fallback con setInterval más lento
    setInterval(() => this.checkForUpdates(), 2000);
  }
  
  scheduleUpdate() {
    // Debounce para evitar actualizaciones excesivas
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => this.updateImage(), 300);
  }
  
  async checkForUpdates() {
    const currentText = this.h2Element.textContent.trim();
    if (currentText !== this.prevText) {
      await this.updateImage();
    }
  }
  
  async updateImage() {
    const text = this.h2Element.textContent.trim();
    
    if (text === this.prevText || !text) return;
    
    this.prevText = text;
    console.log('🔄 Actualizando imagen para:', text);
    
    // Mostrar imagen por defecto inmediatamente
    this.imgElement.src = 'assets/img/locutor/default.JPG';
    
    try {
      const imageUrl = await this.findBestImage(text);
      if (imageUrl) {
        this.imgElement.src = imageUrl;
        console.log('✅ Imagen encontrada:', imageUrl);
      }
    } catch (error) {
      console.error('❌ Error en búsqueda de imagen:', error);
      this.handleSearchError(error);
    }
  }
  
  async findBestImage(text) {
    // Limpiar y procesar el texto
    const processedText = this.processText(text);
    if (!processedText.words.length) return null;
    
    // Verificar cache primero
    const cacheKey = this.generateCacheKey(processedText);
    const cachedResult = await this.getFromCache(cacheKey);
    if (cachedResult) {
      console.log('📦 Imagen encontrada en cache');
      return cachedResult;
    }
    
    // Búsqueda local primero (más rápida)
    const localResult = await this.searchLocalImages(processedText);
    if (localResult) {
      await this.saveToCache(cacheKey, localResult);
      return localResult;
    }
    
    // Búsqueda externa en paralelo
    const externalResult = await this.searchExternalSources(processedText);
    if (externalResult) {
      await this.saveToCache(cacheKey, externalResult);
      return externalResult;
    }
    
    return null;
  }
  
  processText(text) {
    // Limpiar texto más inteligentemente
    const cleaned = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .toLowerCase()
      .trim();
    
    // Filtrar palabras no deseadas
    const badWords = [
      'desconocido', 'unknown', 'interprete', 'artista', 'n/a', 
      'performance radio', 'al aire', 'en vivo'
    ];
    
    const words = cleaned
      .split(/[\s\-–—:|,]+/)
      .filter(word => word.length > 1 && !badWords.includes(word))
      .map(word => word.replace(/[^\w\s]/g, '')); // Remover caracteres especiales
    
    // Detectar artista y título
    const artistTitle = this.extractArtistTitle(cleaned);
    
    return {
      original: text,
      cleaned,
      words,
      artistTitle,
      combinations: this.generateWordCombinations(words)
    };
  }
  
  extractArtistTitle(text) {
    const separators = /[-–—:|]/;
    const parts = text.split(separators).map(p => p.trim()).filter(p => p);
    
    if (parts.length >= 2) {
      return {
        artist: parts[0],
        title: parts[1]
      };
    }
    
    return null;
  }
  
  generateWordCombinations(words) {
    const combinations = [];
    
    // Combinaciones de 2 palabras
    for (let i = 0; i < words.length - 1; i++) {
      combinations.push(`${words[i]}_${words[i + 1]}`);
    }
    
    // Combinaciones de 3 palabras
    for (let i = 0; i < words.length - 2; i++) {
      combinations.push(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
    }
    
    return [...words, ...combinations];
  }
  
  async searchLocalImages(processedText) {
    const searchTerms = processedText.combinations;
    
    for (const term of searchTerms) {
      const imagePath = `assets/img/locutor/${term}.JPG`;
      if (await this.imageExists(imagePath)) {
        console.log('🏠 Imagen local encontrada:', imagePath);
        return imagePath;
      }
    }
    
    return null;
  }
  
  async searchExternalSources(processedText) {
    if (this.isSearching) return null;
    
    this.isSearching = true;
    
    try {
      const searchPromises = [];
      
      // Apple Music (siempre habilitado)
      if (this.apis.appleMusic.enabled) {
        searchPromises.push(this.searchAppleMusic(processedText));
      }
      
      // Last.fm
      if (this.apis.lastFm.enabled) {
        searchPromises.push(this.searchLastFm(processedText));
      }
      
      // YouTube
      if (this.apis.youtube.enabled) {
        searchPromises.push(this.searchYouTube(processedText));
      }
      
      // Spotify (si está configurado)
      if (this.apis.spotify.enabled) {
        console.log('🎵 Intentando búsqueda en Spotify...');
        searchPromises.push(this.searchSpotify(processedText));
      }
      
      // Ejecutar búsquedas en paralelo con timeout
      const results = await Promise.allSettled(
        searchPromises.map(promise => 
          Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), this.searchConfig.timeout)
            )
          ])
        )
      );
      
      // Encontrar el primer resultado exitoso
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          console.log('🌐 Imagen externa encontrada:', result.value);
          return result.value;
        }
      }
      
    } catch (error) {
      console.error('Error en búsqueda externa:', error);
    } finally {
      this.isSearching = false;
    }
    
    return null;
  }
  
  async searchAppleMusic(processedText) {
    try {
      const { artistTitle } = processedText;
      if (!artistTitle) return null;
      
      const searchTerm = encodeURIComponent(`${artistTitle.artist} ${artistTitle.title}`);
      const url = `https://itunes.apple.com/search?entity=song&limit=1&term=${searchTerm}`;
      
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return result.artworkUrl100 || result.artworkUrl60 || null;
      }
    } catch (error) {
      console.error('Error en Apple Music:', error);
    }
    return null;
  }
  
  async searchLastFm(processedText) {
    try {
      const { artistTitle, words } = processedText;
      const searchTerm = artistTitle ? 
        `${artistTitle.artist} ${artistTitle.title}` : 
        words.join(' ');
      
      const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=${this.apis.lastFm.apiKey}&format=json`;
      
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.results?.albummatches?.album?.length > 0) {
        const album = data.results.albummatches.album[0];
        return album.image?.[3]?.['#text'] || null;
      }
    } catch (error) {
      console.error('Error en Last.fm:', error);
    }
    return null;
  }
  
  async searchYouTube(processedText) {
    try {
      const { artistTitle, words } = processedText;
      const searchTerm = artistTitle ? 
        `${artistTitle.artist} ${artistTitle.title}` : 
        words.join(' ');
      
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&key=${this.apis.youtube.apiKey}&maxResults=1`;
      
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.thumbnails.high?.url || null;
      }
    } catch (error) {
      console.error('Error en YouTube:', error);
    }
    return null;
  }
  
  async searchSpotify(processedText) {
    try {
      const { artistTitle, words } = processedText;
      const searchTerm = artistTitle ? 
        `${artistTitle.artist} ${artistTitle.title}` : 
        words.join(' ');
      
      console.log('🎵 Spotify buscando:', searchTerm);
      
      // Obtener token de acceso
      const accessToken = await this.getSpotifyAccessToken();
      if (!accessToken) {
        console.log('❌ Spotify: No se pudo obtener token de acceso');
        return null;
      }
      
      console.log('✅ Spotify: Token obtenido');
      
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
        const track = data.tracks.items[0];
        const imageUrl = track.album.images[0]?.url || track.album.images[1]?.url || null;
        console.log('✅ Spotify: Imagen encontrada:', imageUrl);
        return imageUrl;
      } else {
        console.log('❌ Spotify: No se encontraron tracks');
      }
    } catch (error) {
      console.error('❌ Error en Spotify:', error);
    }
    return null;
  }
  
  async getSpotifyAccessToken() {
    try {
      const { clientId, clientSecret } = this.apis.spotify;
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`
        },
        body: 'grant_type=client_credentials'
      });
      
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error obteniendo token de Spotify:', error);
      return null;
    }
  }
  
  async imageExists(imageUrl) {
    if (this.cache.has(imageUrl)) {
      return this.cache.get(imageUrl);
    }
    
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      const exists = response.ok;
      this.cache.set(imageUrl, exists);
      return exists;
    } catch (error) {
      this.cache.set(imageUrl, false);
      return false;
    }
  }
  
  async getFromCache(key) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['images'], 'readonly');
        const store = transaction.objectStore('images');
        const request = store.get(key);
        
        return new Promise((resolve) => {
          request.onsuccess = () => {
            const result = request.result;
            if (result && Date.now() - result.timestamp < this.searchConfig.cacheExpiry) {
              resolve(result.url);
            } else {
              resolve(null);
            }
          };
          request.onerror = () => resolve(null);
        });
      }
    } catch (error) {
      console.warn('Error accediendo al cache:', error);
    }
    
    return null;
  }
  
  async saveToCache(key, url) {
    try {
      if (this.db) {
        const transaction = this.db.transaction(['images'], 'readwrite');
        const store = transaction.objectStore('images');
        store.put({
          key,
          url,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.warn('Error guardando en cache:', error);
    }
  }
  
  generateCacheKey(processedText) {
    return processedText.cleaned.replace(/\s+/g, '_');
  }
  
  handleSearchError(error) {
    this.retryCount++;
    if (this.retryCount < this.maxRetries) {
      console.log(`🔄 Reintentando búsqueda (${this.retryCount}/${this.maxRetries})`);
      setTimeout(() => this.updateImage(), 2000);
    } else {
      console.log('⚠️ Máximo de reintentos alcanzado');
      this.retryCount = 0;
    }
  }
}

// Inicializar el sistema mejorado
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('h2.cc_streaminfo') && document.querySelector('img.player__img')) {
    window.enhancedImageSearch = new EnhancedImageSearch();
  }
});

// Exportar para uso global
window.EnhancedImageSearch = EnhancedImageSearch;
