/**
 * Cache Ultra Rápido con IndexedDB
 * Almacena imágenes y metadatos para acceso instantáneo
 */

class UltraCache {
  constructor() {
    this.dbName = 'PerformanceRadioCache';
    this.dbVersion = 1;
    this.db = null;
    this.memoryCache = new Map(); // Cache en memoria para acceso ultra rápido
    this.maxMemoryItems = 100; // Máximo 100 items en memoria
    
    this.init();
  }
  
  async init() {
    try {
      this.db = await this.openDB();
      console.log('💾 Cache ultra rápido inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando cache:', error);
    }
  }
  
  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store para imágenes
        if (!db.objectStoreNames.contains('images')) {
          const imageStore = db.createObjectStore('images', { keyPath: 'key' });
          imageStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store para metadatos
        if (!db.objectStoreNames.contains('metadata')) {
          const metaStore = db.createObjectStore('metadata', { keyPath: 'key' });
          metaStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }
  
  // Obtener imagen del cache (ultra rápido)
  async getImage(key) {
    // 1. Buscar en memoria primero (más rápido)
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (this.isValid(item)) {
        console.log('⚡ Cache hit (memoria):', key);
        return item.data;
      } else {
        this.memoryCache.delete(key);
      }
    }
    
    // 2. Buscar en IndexedDB
    try {
      const transaction = this.db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(key);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result && this.isValid(result)) {
            // Mover a memoria para acceso más rápido
            this.addToMemory(key, result);
            console.log('💾 Cache hit (IndexedDB):', key);
            resolve(result.data);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('Error accediendo a IndexedDB:', error);
      return null;
    }
  }
  
  // Guardar imagen en cache
  async setImage(key, data, source = 'unknown') {
    const item = {
      key: key,
      data: data,
      source: source,
      timestamp: Date.now(),
      expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    // Guardar en memoria
    this.addToMemory(key, item);
    
    // Guardar en IndexedDB (asíncrono)
    try {
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      await store.put(item);
    } catch (error) {
      console.warn('Error guardando en IndexedDB:', error);
    }
  }
  
  // Agregar a memoria con límite
  addToMemory(key, item) {
    // Si excede el límite, remover el más antiguo
    if (this.memoryCache.size >= this.maxMemoryItems) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }
    
    this.memoryCache.set(key, item);
  }
  
  // Verificar si el item es válido
  isValid(item) {
    return item && item.expiry > Date.now();
  }
  
  // Limpiar cache expirado
  async cleanExpired() {
    const now = Date.now();
    
    // Limpiar memoria
    for (const [key, item] of this.memoryCache.entries()) {
      if (!this.isValid(item)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Limpiar IndexedDB
    try {
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(now - (24 * 60 * 60 * 1000));
      
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.warn('Error limpiando cache:', error);
    }
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      maxMemoryItems: this.maxMemoryItems,
      memoryKeys: Array.from(this.memoryCache.keys())
    };
  }
}

// Crear instancia global
window.ultraCache = new UltraCache();

console.log('💾 Cache ultra rápido inicializado');






