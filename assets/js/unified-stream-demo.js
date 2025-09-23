/**
 * Demo del Sistema Unificado de Stream
 * Muestra las mejoras de rendimiento y funcionalidades
 */

class UnifiedStreamDemo {
  constructor() {
    this.stats = {
      startTime: Date.now(),
      textChanges: 0,
      imageChanges: 0,
      cacheHits: 0,
      apiCalls: 0,
      errors: 0
    };
    
    this.init();
  }
  
  init() {
    // Crear panel de estadísticas
    this.createStatsPanel();
    
    // Interceptar logs del sistema unificado
    this.interceptLogs();
    
    // Mostrar información del sistema
    this.showSystemInfo();
  }
  
  createStatsPanel() {
    const panel = document.createElement('div');
    panel.id = 'unified-stream-demo';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      border: 1px solid #00ff00;
    `;
    
    panel.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #00ff00;">🎵 Sistema Unificado</h3>
      <div id="demo-stats">
        <div>⏱️ Tiempo activo: <span id="uptime">0s</span></div>
        <div>📝 Cambios de texto: <span id="text-changes">0</span></div>
        <div>🖼️ Cambios de imagen: <span id="image-changes">0</span></div>
        <div>💾 Cache hits: <span id="cache-hits">0</span></div>
        <div>🌐 API calls: <span id="api-calls">0</span></div>
        <div>❌ Errores: <span id="errors">0</span></div>
      </div>
      <button onclick="this.parentElement.style.display='none'" style="margin-top: 10px; background: #00ff00; color: #000; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Cerrar</button>
    `;
    
    document.body.appendChild(panel);
    
    // Actualizar estadísticas cada segundo
    setInterval(() => this.updateStats(), 1000);
  }
  
  updateStats() {
    const uptime = Math.floor((Date.now() - this.stats.startTime) / 1000);
    document.getElementById('uptime').textContent = uptime + 's';
    document.getElementById('text-changes').textContent = this.stats.textChanges;
    document.getElementById('image-changes').textContent = this.stats.imageChanges;
    document.getElementById('cache-hits').textContent = this.stats.cacheHits;
    document.getElementById('api-calls').textContent = this.stats.apiCalls;
    document.getElementById('errors').textContent = this.stats.errors;
  }
  
  interceptLogs() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('📝 Texto limpiado:')) this.stats.textChanges++;
      if (message.includes('🖼️ Imagen encontrada:')) this.stats.imageChanges++;
      if (message.includes('💾 Cache hit:')) this.stats.cacheHits++;
      if (message.includes('✅ Imagen encontrada en')) this.stats.apiCalls++;
      originalLog.apply(console, args);
    };
    
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('⚠️ Error')) this.stats.errors++;
      originalWarn.apply(console, args);
    };
  }
  
  showSystemInfo() {
    setTimeout(() => {
      console.log('🎵 Sistema Unificado de Stream - Demo iniciado');
      console.log('📊 Panel de estadísticas visible en la esquina superior derecha');
      console.log('⚙️ Configuración:', window.UNIFIED_STREAM_CONFIG);
      
      if (window.streamProcessor) {
        console.log('🔧 Estadísticas del procesador:', window.streamProcessor.getStats());
      }
    }, 1000);
  }
}

// Inicializar demo cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new UnifiedStreamDemo());
} else {
  new UnifiedStreamDemo();
}











