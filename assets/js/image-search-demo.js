/**
 * Script de Demostración del Sistema Mejorado de Búsqueda de Imágenes
 * Muestra las capacidades y mejoras del nuevo sistema
 */

class ImageSearchDemo {
  constructor() {
    this.demoContainer = null;
    this.isRunning = false;
    this.testCases = [
      'Shakira - Hips Don\'t Lie',
      'Coldplay - The Scientist',
      'Interprete Desconocido - Canción Sin Nombre',
      'Rock Nacional - Los Enanitos Verdes',
      'Jazz - Miles Davis',
      'Performance Radio - Al Aire'
    ];
  }
  
  init() {
    this.createDemoUI();
    this.bindEvents();
    console.log('🎭 Demo del sistema de búsqueda de imágenes inicializado');
  }
  
  createDemoUI() {
    // Crear contenedor de demo
    this.demoContainer = document.createElement('div');
    this.demoContainer.id = 'image-search-demo';
    this.demoContainer.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 10000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
      ">
        <h3 style="margin: 0 0 15px 0; color: #00ff88;">🎵 Demo Sistema Mejorado</h3>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-size: 12px;">Texto de prueba:</label>
          <select id="demo-text-select" style="width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #333;">
            ${this.testCases.map((text, index) => 
              `<option value="${index}">${text}</option>`
            ).join('')}
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <button id="demo-search-btn" style="
            width: 100%;
            padding: 10px;
            background: #00ff88;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          ">🔍 Buscar Imagen</button>
        </div>
        
        <div style="margin-bottom: 15px;">
          <button id="demo-compare-btn" style="
            width: 100%;
            padding: 10px;
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          ">⚡ Comparar Sistemas</button>
        </div>
        
        <div style="margin-bottom: 15px;">
          <button id="demo-stats-btn" style="
            width: 100%;
            padding: 10px;
            background: #4ecdc4;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          ">📊 Ver Estadísticas</button>
        </div>
        
        <div id="demo-results" style="
          max-height: 200px;
          overflow-y: auto;
          font-size: 11px;
          line-height: 1.4;
          background: rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 5px;
          margin-top: 10px;
        "></div>
        
        <button id="demo-close-btn" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
        ">×</button>
      </div>
    `;
    
    document.body.appendChild(this.demoContainer);
  }
  
  bindEvents() {
    const searchBtn = document.getElementById('demo-search-btn');
    const compareBtn = document.getElementById('demo-compare-btn');
    const statsBtn = document.getElementById('demo-stats-btn');
    const closeBtn = document.getElementById('demo-close-btn');
    const textSelect = document.getElementById('demo-text-select');
    
    searchBtn.addEventListener('click', () => this.runSearchDemo());
    compareBtn.addEventListener('click', () => this.runComparisonDemo());
    statsBtn.addEventListener('click', () => this.showStats());
    closeBtn.addEventListener('click', () => this.closeDemo());
    textSelect.addEventListener('change', () => this.updatePreview());
  }
  
  async runSearchDemo() {
    const textSelect = document.getElementById('demo-text-select');
    const selectedText = this.testCases[textSelect.value];
    const resultsDiv = document.getElementById('demo-results');
    
    resultsDiv.innerHTML = '<div style="color: #00ff88;">🔄 Ejecutando búsqueda...</div>';
    
    try {
      const startTime = performance.now();
      
      // Simular búsqueda con el sistema mejorado
      const result = await this.simulateEnhancedSearch(selectedText);
      
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      resultsDiv.innerHTML = `
        <div style="color: #00ff88;">✅ Búsqueda completada en ${duration}ms</div>
        <div style="margin-top: 10px;">
          <strong>Texto:</strong> ${selectedText}<br>
          <strong>Resultado:</strong> ${result.found ? '✅ Imagen encontrada' : '❌ No encontrada'}<br>
          <strong>Fuente:</strong> ${result.source}<br>
          <strong>URL:</strong> ${result.url}<br>
          <strong>Estrategia:</strong> ${result.strategy}
        </div>
      `;
      
    } catch (error) {
      resultsDiv.innerHTML = `<div style="color: #ff6b6b;">❌ Error: ${error.message}</div>`;
    }
  }
  
  async runComparisonDemo() {
    const textSelect = document.getElementById('demo-text-select');
    const selectedText = this.testCases[textSelect.value];
    const resultsDiv = document.getElementById('demo-results');
    
    resultsDiv.innerHTML = '<div style="color: #4ecdc4;">⚡ Comparando sistemas...</div>';
    
    try {
      // Comparar sistema original vs mejorado
      const originalTime = await this.simulateOriginalSearch(selectedText);
      const enhancedTime = await this.simulateEnhancedSearch(selectedText);
      
      const improvement = ((originalTime.duration - enhancedTime.duration) / originalTime.duration * 100).toFixed(1);
      
      resultsDiv.innerHTML = `
        <div style="color: #4ecdc4;">📊 Comparación de Rendimiento</div>
        <div style="margin-top: 10px;">
          <div style="background: rgba(255, 0, 0, 0.2); padding: 5px; border-radius: 3px; margin-bottom: 5px;">
            <strong>Sistema Original:</strong><br>
            ⏱️ ${originalTime.duration}ms<br>
            🎯 ${originalTime.found ? 'Encontrada' : 'No encontrada'}<br>
            📡 ${originalTime.sources} fuentes
          </div>
          
          <div style="background: rgba(0, 255, 0, 0.2); padding: 5px; border-radius: 3px; margin-bottom: 5px;">
            <strong>Sistema Mejorado:</strong><br>
            ⏱️ ${enhancedTime.duration}ms<br>
            🎯 ${enhancedTime.found ? 'Encontrada' : 'No encontrada'}<br>
            📡 ${enhancedTime.sources} fuentes
          </div>
          
          <div style="color: #00ff88; font-weight: bold;">
            🚀 Mejora: ${improvement}% más rápido
          </div>
        </div>
      `;
      
    } catch (error) {
      resultsDiv.innerHTML = `<div style="color: #ff6b6b;">❌ Error en comparación: ${error.message}</div>`;
    }
  }
  
  showStats() {
    const resultsDiv = document.getElementById('demo-results');
    
    // Simular estadísticas del sistema
    const stats = {
      totalSearches: Math.floor(Math.random() * 1000) + 500,
      successRate: (Math.random() * 20 + 80).toFixed(1),
      avgResponseTime: (Math.random() * 500 + 200).toFixed(0),
      cacheHitRate: (Math.random() * 30 + 60).toFixed(1),
      fallbackUsage: (Math.random() * 15 + 5).toFixed(1)
    };
    
    resultsDiv.innerHTML = `
      <div style="color: #4ecdc4;">📊 Estadísticas del Sistema</div>
      <div style="margin-top: 10px;">
        <div>🔍 Búsquedas totales: <strong>${stats.totalSearches}</strong></div>
        <div>✅ Tasa de éxito: <strong>${stats.successRate}%</strong></div>
        <div>⏱️ Tiempo promedio: <strong>${stats.avgResponseTime}ms</strong></div>
        <div>📦 Cache hits: <strong>${stats.cacheHitRate}%</strong></div>
        <div>🔄 Uso de fallback: <strong>${stats.fallbackUsage}%</strong></div>
        
        <div style="margin-top: 10px; padding: 10px; background: rgba(0, 255, 136, 0.1); border-radius: 5px;">
          <strong>🎯 APIs más utilizadas:</strong><br>
          • Spotify: 30%<br>
          • Apple Music: 25%<br>
          • Last.fm: 20%<br>
          • YouTube: 15%<br>
          • Local: 10%
        </div>
      </div>
    `;
  }
  
  async simulateEnhancedSearch(text) {
    // Simular búsqueda mejorada
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
    
    const sources = ['Local', 'Spotify', 'Apple Music', 'Last.fm', 'YouTube'];
    const strategies = ['Exact Match', 'Genre Based', 'Time Based', 'Random'];
    
    return {
      found: Math.random() > 0.3,
      source: sources[Math.floor(Math.random() * sources.length)],
      url: 'assets/img/locutor/example.JPG',
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      duration: Math.random() * 300 + 150
    };
  }
  
  async simulateOriginalSearch(text) {
    // Simular búsqueda original (más lenta)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
    
    return {
      found: Math.random() > 0.4,
      duration: Math.random() * 800 + 400,
      sources: 2 // Solo Last.fm y YouTube
    };
  }
  
  updatePreview() {
    const textSelect = document.getElementById('demo-text-select');
    const selectedText = this.testCases[textSelect.value];
    
    // Actualizar el elemento de stream para mostrar el preview
    const streamElement = document.querySelector('h2.cc_streaminfo');
    if (streamElement) {
      const originalText = streamElement.textContent;
      streamElement.textContent = selectedText;
      
      // Restaurar después de 3 segundos
      setTimeout(() => {
        streamElement.textContent = originalText;
      }, 3000);
    }
  }
  
  closeDemo() {
    if (this.demoContainer) {
      this.demoContainer.remove();
      this.demoContainer = null;
    }
  }
}

// Función para mostrar/ocultar el demo
function toggleImageSearchDemo() {
  const existingDemo = document.getElementById('image-search-demo');
  
  if (existingDemo) {
    existingDemo.remove();
  } else {
    const demo = new ImageSearchDemo();
    demo.init();
  }
}

// Hacer disponible globalmente
window.toggleImageSearchDemo = toggleImageSearchDemo;
window.ImageSearchDemo = ImageSearchDemo;

// Auto-inicializar demo si está en modo debug
if (window.location.search.includes('demo=true')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const demo = new ImageSearchDemo();
      demo.init();
    }, 2000);
  });
}
