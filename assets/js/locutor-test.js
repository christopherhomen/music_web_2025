/**
 * Script de Prueba Específica para Locutores
 * Prueba el sistema de búsqueda de imágenes locales para locutores
 */

class LocutorTest {
  constructor() {
    this.testCases = [
      'ELSA KRAUSS DESDE LA CIUDAD DE MEXICO',
      'JUAN PEREZ DESDE BOGOTA COLOMBIA',
      'MARIA GONZALEZ DESDE BUENOS AIRES ARGENTINA',
      'CARLOS RODRIGUEZ DESDE MADRID ESPAÑA',
      'ANA MARTINEZ DESDE CARACAS VENEZUELA'
    ];
    
    this.init();
  }
  
  init() {
    console.log('🎤 Iniciando prueba específica para locutores...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runLocutorTests();
    }, 2000);
  }
  
  async runLocutorTests() {
    console.log('🚀 Ejecutando pruebas de locutores...');
    
    for (const testCase of this.testCases) {
      console.log(`\n📋 Probando: "${testCase}"`);
      
      try {
        // Simular el texto en el elemento
        const h2Element = document.querySelector('h2.cc_streaminfo');
        if (h2Element) {
          h2Element.textContent = testCase;
          
          // Esperar a que el sistema procese
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verificar si se encontró imagen local
          const imgElement = document.querySelector('img.player__img');
          if (imgElement) {
            const currentSrc = imgElement.src;
            const isLocal = currentSrc.includes('assets/img/locutor/') && !currentSrc.includes('default.JPG');
            
            console.log(`${isLocal ? '✅' : '❌'} Imagen: ${currentSrc}`);
            
            if (isLocal) {
              console.log('🏠 ¡Imagen local encontrada y mantenida!');
            } else {
              console.log('🌐 Imagen externa o por defecto');
            }
          }
        }
      } catch (error) {
        console.error('❌ Error en prueba:', error);
      }
    }
    
    // Mostrar resumen
    this.showSummary();
  }
  
  showSummary() {
    console.log('\n🎯 RESUMEN DE PRUEBAS DE LOCUTORES');
    console.log('==================================');
    
    const imgElement = document.querySelector('img.player__img');
    if (imgElement) {
      const currentSrc = imgElement.src;
      const isLocal = currentSrc.includes('assets/img/locutor/') && !currentSrc.includes('default.JPG');
      
      console.log(`📸 Imagen actual: ${currentSrc}`);
      console.log(`🏠 Es local: ${isLocal ? 'SÍ' : 'NO'}`);
      
      if (isLocal) {
        console.log('✅ El sistema está funcionando correctamente para locutores');
      } else {
        console.log('⚠️ El sistema no encontró imagen local para el locutor actual');
      }
    }
    
    // Mostrar estadísticas del sistema
    if (window.streamProcessor) {
      const stats = window.streamProcessor.getStats();
      console.log('\n📊 Estadísticas del sistema:');
      console.log(`   Cache size: ${stats.cacheSize}`);
      console.log(`   Procesando: ${stats.isProcessing}`);
      console.log(`   Texto anterior: ${stats.prevText}`);
      console.log(`   Orden de búsqueda: ${stats.searchOrder.join(' → ')}`);
    }
  }
}

// Función para ejecutar prueba manual
window.runLocutorTest = function() {
  new LocutorTest();
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎤 Sistema listo, ejecutando prueba de locutores...');
    new LocutorTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new LocutorTest();
      } else {
        console.log('❌ Sistema no disponible para prueba de locutores');
      }
    }, 5000);
  }
}, 3000);

console.log('🎤 Script de prueba de locutores cargado. Ejecuta window.runLocutorTest() para prueba manual.');










