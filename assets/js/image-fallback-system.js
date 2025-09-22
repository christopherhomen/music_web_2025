/**
 * Sistema de Fallback Inteligente para Imágenes
 * Maneja casos donde no se encuentran imágenes específicas
 */

class ImageFallbackSystem {
  constructor() {
    this.fallbackStrategies = [
      new GenreBasedFallback(),
      new TimeBasedFallback(),
      new RandomFallback(),
      new DefaultFallback()
    ];
    
    this.currentStrategy = 0;
    this.fallbackHistory = [];
    this.maxHistorySize = 50;
  }
  
  async getFallbackImage(text, context = {}) {
    console.log('🔄 Aplicando estrategia de fallback para:', text);
    
    for (let i = this.currentStrategy; i < this.fallbackStrategies.length; i++) {
      const strategy = this.fallbackStrategies[i];
      
      try {
        const image = await strategy.getImage(text, context);
        if (image) {
          this.recordFallback(strategy.name, image, text);
          return image;
        }
      } catch (error) {
        console.warn(`Estrategia ${strategy.name} falló:`, error);
      }
    }
    
    // Si todas las estrategias fallan, usar imagen por defecto
    return 'assets/img/locutor/default.JPG';
  }
  
  recordFallback(strategyName, imageUrl, originalText) {
    this.fallbackHistory.push({
      strategy: strategyName,
      image: imageUrl,
      text: originalText,
      timestamp: Date.now()
    });
    
    // Mantener solo los últimos registros
    if (this.fallbackHistory.length > this.maxHistorySize) {
      this.fallbackHistory = this.fallbackHistory.slice(-this.maxHistorySize);
    }
  }
  
  getFallbackStats() {
    const stats = {};
    this.fallbackHistory.forEach(entry => {
      stats[entry.strategy] = (stats[entry.strategy] || 0) + 1;
    });
    return stats;
  }
}

class GenreBasedFallback {
  constructor() {
    this.name = 'GenreBased';
    this.genreImages = {
      rock: ['assets/img/locutor/rock1.JPG', 'assets/img/locutor/rock2.JPG'],
      pop: ['assets/img/locutor/pop1.JPG', 'assets/img/locutor/pop2.JPG'],
      jazz: ['assets/img/locutor/jazz1.JPG', 'assets/img/locutor/jazz2.JPG'],
      classical: ['assets/img/locutor/classical1.JPG', 'assets/img/locutor/classical2.JPG'],
      electronic: ['assets/img/locutor/electronic1.JPG', 'assets/img/locutor/electronic2.JPG'],
      latin: ['assets/img/locutor/latin1.JPG', 'assets/img/locutor/latin2.JPG'],
      country: ['assets/img/locutor/country1.JPG', 'assets/img/locutor/country2.JPG'],
      blues: ['assets/img/locutor/blues1.JPG', 'assets/img/locutor/blues2.JPG']
    };
    
    this.genreKeywords = {
      rock: ['rock', 'metal', 'punk', 'grunge', 'alternative'],
      pop: ['pop', 'dance', 'disco', 'funk', 'soul'],
      jazz: ['jazz', 'blues', 'swing', 'bebop', 'fusion'],
      classical: ['classical', 'orchestra', 'symphony', 'chamber', 'opera'],
      electronic: ['electronic', 'techno', 'house', 'ambient', 'synth'],
      latin: ['latin', 'salsa', 'merengue', 'reggaeton', 'bachata'],
      country: ['country', 'folk', 'bluegrass', 'americana'],
      blues: ['blues', 'rhythm', 'soul', 'gospel']
    };
  }
  
  async getImage(text, context) {
    const detectedGenre = this.detectGenre(text);
    if (detectedGenre && this.genreImages[detectedGenre]) {
      const images = this.genreImages[detectedGenre];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      
      // Verificar que la imagen existe
      if (await this.imageExists(randomImage)) {
        return randomImage;
      }
    }
    
    return null;
  }
  
  detectGenre(text) {
    const lowerText = text.toLowerCase();
    
    for (const [genre, keywords] of Object.entries(this.genreKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return genre;
      }
    }
    
    return null;
  }
  
  async imageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

class TimeBasedFallback {
  constructor() {
    this.name = 'TimeBased';
    this.timeImages = {
      morning: ['assets/img/locutor/morning1.JPG', 'assets/img/locutor/morning2.JPG'],
      afternoon: ['assets/img/locutor/afternoon1.JPG', 'assets/img/locutor/afternoon2.JPG'],
      evening: ['assets/img/locutor/evening1.JPG', 'assets/img/locutor/evening2.JPG'],
      night: ['assets/img/locutor/night1.JPG', 'assets/img/locutor/night2.JPG']
    };
  }
  
  async getImage(text, context) {
    const timeOfDay = this.getTimeOfDay();
    const images = this.timeImages[timeOfDay];
    
    if (images) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      if (await this.imageExists(randomImage)) {
        return randomImage;
      }
    }
    
    return null;
  }
  
  getTimeOfDay() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }
  
  async imageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

class RandomFallback {
  constructor() {
    this.name = 'Random';
    this.randomImages = [
      'assets/img/locutor/random1.JPG',
      'assets/img/locutor/random2.JPG',
      'assets/img/locutor/random3.JPG',
      'assets/img/locutor/random4.JPG',
      'assets/img/locutor/random5.JPG'
    ];
  }
  
  async getImage(text, context) {
    const shuffledImages = [...this.randomImages].sort(() => Math.random() - 0.5);
    
    for (const image of shuffledImages) {
      if (await this.imageExists(image)) {
        return image;
      }
    }
    
    return null;
  }
  
  async imageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

class DefaultFallback {
  constructor() {
    this.name = 'Default';
    this.defaultImages = [
      'assets/img/locutor/default.JPG',
      'assets/img/logo/logo1.png',
      'assets/img/logo/logo2.png'
    ];
  }
  
  async getImage(text, context) {
    for (const image of this.defaultImages) {
      if (await this.imageExists(image)) {
        return image;
      }
    }
    
    return 'assets/img/locutor/default.JPG';
  }
  
  async imageExists(imageUrl) {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Sistema de análisis de contexto
class ContextAnalyzer {
  constructor() {
    this.contextData = {
      timeOfDay: null,
      dayOfWeek: null,
      season: null,
      weather: null,
      userPreferences: null
    };
  }
  
  analyzeContext() {
    const now = new Date();
    
    this.contextData.timeOfDay = this.getTimeOfDay(now);
    this.contextData.dayOfWeek = now.getDay();
    this.contextData.season = this.getSeason(now);
    
    return this.contextData;
  }
  
  getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }
  
  getSeason(date) {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }
}

// Exportar clases
window.ImageFallbackSystem = ImageFallbackSystem;
window.ContextAnalyzer = ContextAnalyzer;











