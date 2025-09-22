/**
 * Pre-cargador de Imágenes Locales Ultra Rápido
 * Carga todas las imágenes locales al inicio para búsquedas instantáneas
 */

class ImagePreloader {
  constructor() {
    this.imageMap = new Map(); // Mapa de imágenes disponibles
    this.loadingPromises = new Map(); // Promesas de carga
    this.isPreloaded = false;
    this.preloadStartTime = 0;
    
    this.init();
  }
  
  async init() {
    this.preloadStartTime = Date.now();
    console.log('🚀 Iniciando pre-carga de imágenes locales...');
    
    try {
      await this.preloadLocalImages();
      const loadTime = Date.now() - this.preloadStartTime;
      console.log(`✅ Pre-carga completada en ${loadTime}ms. ${this.imageMap.size} imágenes disponibles.`);
      this.isPreloaded = true;
    } catch (error) {
      console.warn('⚠️ Error en pre-carga:', error);
      this.isPreloaded = false;
    }
  }
  
  async preloadLocalImages() {
    // Lista de nombres comunes de locutores y artistas
    const commonNames = [
      // Locutores comunes
      'elsa_krauss', 'juan_perez', 'maria_gonzalez', 'carlos_rodriguez', 'ana_martinez',
      'david_lopez', 'laura_sanchez', 'pedro_martinez', 'sofia_hernandez', 'miguel_torres',
      
      // Artistas populares
      'ricardo_arjona', 'shakira', 'bad_bunny', 'taylor_swift', 'ed_sheeran',
      'maluma', 'j_balvin', 'karol_g', 'ozuna', 'daddy_yankee',
      'latin_artists', 'reggaeton', 'pop_artists', 'rock_artists',
      
      // Variaciones comunes
      'elsa', 'juan', 'maria', 'carlos', 'ana', 'david', 'laura', 'pedro', 'sofia', 'miguel',
      'ricardo', 'shakira', 'bad', 'bunny', 'taylor', 'swift', 'ed', 'sheeran'
    ];
    
    // Cargar imágenes en paralelo con límite de concurrencia
    const concurrency = 10; // Máximo 10 requests simultáneos
    const chunks = this.chunkArray(commonNames, concurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(name => this.checkImageExists(name));
      await Promise.allSettled(promises);
    }
  }
  
  async checkImageExists(name) {
    const imagePath = `assets/img/locutor/${name}.JPG`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500); // 500ms timeout
      
      const response = await fetch(imagePath, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.imageMap.set(name, imagePath);
        return true;
      }
    } catch (error) {
      // Imagen no existe, continuar
    }
    
    return false;
  }
  
  // Buscar imagen de forma instantánea
  findImage(words) {
    if (!this.isPreloaded) {
      console.warn('⚠️ Pre-carga no completada, usando búsqueda tradicional');
      return null;
    }
    
    // Estrategias de búsqueda optimizadas
    const strategies = this.generateSearchStrategies(words);
    
    for (const strategy of strategies) {
      if (this.imageMap.has(strategy)) {
        console.log(`⚡ Imagen encontrada instantáneamente: ${strategy}`);
        return this.imageMap.get(strategy);
      }
    }
    
    return null;
  }
  
  generateSearchStrategies(words) {
    const strategies = [];
    
    // 1. Nombre completo
    strategies.push(words.join('_').toLowerCase());
    
    // 2. Solo nombre y apellido
    if (words.length >= 2) {
      strategies.push(words.slice(0, 2).join('_').toLowerCase());
    }
    
    // 3. Solo nombre
    strategies.push(words[0].toLowerCase());
    
    // 4. Primeras 3 palabras
    if (words.length >= 3) {
      strategies.push(words.slice(0, 3).join('_').toLowerCase());
    }
    
    // 5. Buscar por palabras individuales
    for (const word of words) {
      strategies.push(word.toLowerCase());
    }
    
    return [...new Set(strategies)].filter(s => s && s.length > 0);
  }
  
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
  
  // Obtener estadísticas
  getStats() {
    return {
      isPreloaded: this.isPreloaded,
      imageCount: this.imageMap.size,
      loadTime: this.preloadStartTime ? Date.now() - this.preloadStartTime : 0,
      availableImages: Array.from(this.imageMap.keys())
    };
  }
}

// Crear instancia global
window.imagePreloader = new ImagePreloader();

console.log('⚡ Pre-cargador de imágenes inicializado');






