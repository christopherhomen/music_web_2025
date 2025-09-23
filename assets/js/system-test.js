/**
 * Script de Prueba Completa del Sistema Unificado
 * Prueba todas las funcionalidades y fuentes de imágenes
 */

class SystemTest {
  constructor() {
    this.testResults = {
      textCleaning: [],
      imageSearch: [],
      apiConnections: [],
      performance: []
    };
    
    this.startTime = Date.now();
    this.init();
  }
  
  init() {
    console.log('🧪 Iniciando prueba completa del sistema...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runAllTests();
    }, 3000);
  }
  
  async runAllTests() {
    console.log('🚀 Ejecutando pruebas del sistema...');
    
    // 1. Prueba de limpieza de texto
    await this.testTextCleaning();
    
    // 2. Prueba de conexiones API
    await this.testApiConnections();
    
    // 3. Prueba de búsqueda de imágenes
    await this.testImageSearch();
    
    // 4. Prueba de rendimiento
    await this.testPerformance();
    
    // 5. Mostrar resultados
    this.showResults();
  }
  
  async testTextCleaning() {
    console.log('📝 Probando limpieza de texto...');
    
    const testCases = [
      'Desconocido - NI TU NI YO Ricardo Arjona',
      'Unknown Artist - Song Title',
      'Intérprete Desconocido - Canción Bonita',
      'N/A - Music Playing',
      'Artista Desconocido - Título de Canción',
      'Unknown - Best Song Ever',
      'Desconocido - Sin Datos - Artista Real'
    ];
    
    for (const testCase of testCases) {
      try {
        const cleaned = window.forceCleanText(testCase);
        const success = !cleaned.includes('Desconocido') && 
                       !cleaned.includes('Unknown') && 
                       !cleaned.includes('N/A');
        
        this.testResults.textCleaning.push({
          input: testCase,
          output: cleaned,
          success: success
        });
        
        console.log(`${success ? '✅' : '❌'} "${testCase}" → "${cleaned}"`);
      } catch (error) {
        console.error('❌ Error en limpieza:', error);
        this.testResults.textCleaning.push({
          input: testCase,
          output: 'ERROR',
          success: false
        });
      }
    }
  }
  
  async testApiConnections() {
    console.log('🌐 Probando conexiones API...');
    
    const apis = [
      { name: 'Spotify', test: () => this.testSpotifyConnection() },
      { name: 'Apple Music', test: () => this.testAppleMusicConnection() },
      { name: 'YouTube Music', test: () => this.testYouTubeMusicConnection() },
      { name: 'Last.fm', test: () => this.testLastFmConnection() },
      { name: 'YouTube', test: () => this.testYouTubeConnection() }
    ];
    
    for (const api of apis) {
      try {
        const result = await api.test();
        this.testResults.apiConnections.push({
          name: api.name,
          success: result.success,
          responseTime: result.responseTime,
          details: result.details
        });
        
        console.log(`${result.success ? '✅' : '❌'} ${api.name}: ${result.details}`);
      } catch (error) {
        console.error(`❌ Error en ${api.name}:`, error);
        this.testResults.apiConnections.push({
          name: api.name,
          success: false,
          responseTime: 0,
          details: 'Error: ' + error.message
        });
      }
    }
  }
  
  async testSpotifyConnection() {
    const startTime = Date.now();
    try {
      if (window.streamProcessor) {
        const token = await window.streamProcessor.getSpotifyAccessToken();
        const responseTime = Date.now() - startTime;
        return {
          success: !!token,
          responseTime: responseTime,
          details: token ? `Token obtenido (${responseTime}ms)` : 'No se pudo obtener token'
        };
      }
      return { success: false, responseTime: 0, details: 'Sistema no disponible' };
    } catch (error) {
      return { success: false, responseTime: Date.now() - startTime, details: error.message };
    }
  }
  
  async testAppleMusicConnection() {
    const startTime = Date.now();
    try {
      const response = await fetch('https://itunes.apple.com/search?entity=song&limit=1&term=test', {
        method: 'GET',
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;
      return {
        success: response.ok,
        responseTime: responseTime,
        details: response.ok ? `Conexión exitosa (${responseTime}ms)` : `Error ${response.status}`
      };
    } catch (error) {
      return { success: false, responseTime: Date.now() - startTime, details: error.message };
    }
  }
  
  async testYouTubeMusicConnection() {
    const startTime = Date.now();
    try {
      const apiKey = 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA';
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test%20music&type=video&videoCategoryId=10&maxResults=1&key=${apiKey}`, {
        method: 'GET',
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;
      return {
        success: response.ok,
        responseTime: responseTime,
        details: response.ok ? `Conexión exitosa (${responseTime}ms)` : `Error ${response.status}`
      };
    } catch (error) {
      return { success: false, responseTime: Date.now() - startTime, details: error.message };
    }
  }
  
  async testLastFmConnection() {
    const startTime = Date.now();
    try {
      const apiKey = '21f84fcdb8652dccff838fbbb408d91e';
      const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=test&api_key=${apiKey}&format=json`, {
        method: 'GET',
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;
      return {
        success: response.ok,
        responseTime: responseTime,
        details: response.ok ? `Conexión exitosa (${responseTime}ms)` : `Error ${response.status}`
      };
    } catch (error) {
      return { success: false, responseTime: Date.now() - startTime, details: error.message };
    }
  }
  
  async testYouTubeConnection() {
    const startTime = Date.now();
    try {
      const apiKey = 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA';
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&type=video&maxResults=1&key=${apiKey}`, {
        method: 'GET',
        timeout: 5000
      });
      const responseTime = Date.now() - startTime;
      return {
        success: response.ok,
        responseTime: responseTime,
        details: response.ok ? `Conexión exitosa (${responseTime}ms)` : `Error ${response.status}`
      };
    } catch (error) {
      return { success: false, responseTime: Date.now() - startTime, details: error.message };
    }
  }
  
  async testImageSearch() {
    console.log('🖼️ Probando búsqueda de imágenes...');
    
    const testQueries = [
      'Ricardo Arjona',
      'Shakira',
      'Bad Bunny',
      'Taylor Swift',
      'Ed Sheeran'
    ];
    
    for (const query of testQueries) {
      try {
        const startTime = Date.now();
        const imageUrl = await window.streamProcessor.findImage(query);
        const responseTime = Date.now() - startTime;
        
        this.testResults.imageSearch.push({
          query: query,
          imageUrl: imageUrl,
          success: !!imageUrl,
          responseTime: responseTime
        });
        
        console.log(`${imageUrl ? '✅' : '❌'} "${query}": ${imageUrl || 'No encontrada'} (${responseTime}ms)`);
      } catch (error) {
        console.error(`❌ Error buscando "${query}":`, error);
        this.testResults.imageSearch.push({
          query: query,
          imageUrl: null,
          success: false,
          responseTime: 0
        });
      }
    }
  }
  
  async testPerformance() {
    console.log('⚡ Probando rendimiento...');
    
    // Test de limpieza de texto
    const textStartTime = Date.now();
    for (let i = 0; i < 100; i++) {
      window.forceCleanText('Desconocido - Test Song ' + i);
    }
    const textTime = Date.now() - textStartTime;
    
    // Test de cache
    const cacheStartTime = Date.now();
    for (let i = 0; i < 50; i++) {
      window.streamProcessor.findImage('Test Song ' + i);
    }
    const cacheTime = Date.now() - cacheStartTime;
    
    this.testResults.performance.push({
      test: 'Limpieza de texto (100x)',
      time: textTime,
      success: textTime < 1000
    });
    
    this.testResults.performance.push({
      test: 'Búsqueda de imágenes (50x)',
      time: cacheTime,
      success: cacheTime < 5000
    });
    
    console.log(`⚡ Limpieza de texto: ${textTime}ms ${textTime < 1000 ? '✅' : '❌'}`);
    console.log(`⚡ Búsqueda de imágenes: ${cacheTime}ms ${cacheTime < 5000 ? '✅' : '❌'}`);
  }
  
  showResults() {
    const totalTime = Date.now() - this.startTime;
    
    console.log('\n🎯 RESULTADOS DE LA PRUEBA COMPLETA');
    console.log('=====================================');
    
    // Resumen de limpieza de texto
    const textSuccess = this.testResults.textCleaning.filter(t => t.success).length;
    const textTotal = this.testResults.textCleaning.length;
    console.log(`📝 Limpieza de texto: ${textSuccess}/${textTotal} exitosas`);
    
    // Resumen de APIs
    const apiSuccess = this.testResults.apiConnections.filter(a => a.success).length;
    const apiTotal = this.testResults.apiConnections.length;
    console.log(`🌐 Conexiones API: ${apiSuccess}/${apiTotal} exitosas`);
    
    // Resumen de búsqueda de imágenes
    const imageSuccess = this.testResults.imageSearch.filter(i => i.success).length;
    const imageTotal = this.testResults.imageSearch.length;
    console.log(`🖼️ Búsqueda de imágenes: ${imageSuccess}/${imageTotal} exitosas`);
    
    // Resumen de rendimiento
    const perfSuccess = this.testResults.performance.filter(p => p.success).length;
    const perfTotal = this.testResults.performance.length;
    console.log(`⚡ Pruebas de rendimiento: ${perfSuccess}/${perfTotal} exitosas`);
    
    console.log(`\n⏱️ Tiempo total: ${totalTime}ms`);
    
    // Mostrar orden de búsqueda
    console.log('\n🔍 Orden de búsqueda actual:');
    window.showSearchOrder();
    
    // Mostrar estadísticas del sistema
    console.log('\n📊 Estadísticas del sistema:');
    console.log(window.streamProcessor.getStats());
    
    // Crear resumen visual
    this.createVisualSummary();
  }
  
  createVisualSummary() {
    const summary = document.createElement('div');
    summary.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      color: #00ff00;
      padding: 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 14px;
      z-index: 10000;
      max-width: 500px;
      border: 2px solid #00ff00;
    `;
    
    const textSuccess = this.testResults.textCleaning.filter(t => t.success).length;
    const textTotal = this.testResults.textCleaning.length;
    const apiSuccess = this.testResults.apiConnections.filter(a => a.success).length;
    const apiTotal = this.testResults.apiConnections.length;
    const imageSuccess = this.testResults.imageSearch.filter(i => i.success).length;
    const imageTotal = this.testResults.imageSearch.length;
    
    summary.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #00ff00;">🧪 RESULTADOS DE PRUEBA</h3>
      <div>📝 Limpieza de texto: ${textSuccess}/${textTotal} ✅</div>
      <div>🌐 Conexiones API: ${apiSuccess}/${apiTotal} ✅</div>
      <div>🖼️ Búsqueda de imágenes: ${imageSuccess}/${imageTotal} ✅</div>
      <div>⏱️ Tiempo total: ${Date.now() - this.startTime}ms</div>
      <button onclick="this.parentElement.remove()" style="margin-top: 15px; background: #00ff00; color: #000; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Cerrar</button>
    `;
    
    document.body.appendChild(summary);
  }
}

// Función para ejecutar prueba manual
window.runSystemTest = function() {
  new SystemTest();
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando prueba automática...');
    new SystemTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new SystemTest();
      } else {
        console.log('❌ Sistema no disponible para prueba');
      }
    }, 5000);
  }
}, 2000);

console.log('🧪 Script de prueba cargado. Ejecuta window.runSystemTest() para prueba manual.');











