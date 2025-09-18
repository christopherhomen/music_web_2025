/**
 * Script de Prueba de Cache
 * Limpia el cache y prueba el sistema de locutores
 */

class CacheTest {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('🧹 Iniciando prueba de cache...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runCacheTest();
    }, 3000);
  }
  
  async runCacheTest() {
    console.log('🚀 Ejecutando prueba de cache...');
    
    // 1. Limpiar cache de locutores
    await this.clearLocutorCache();
    
    // 2. Probar búsqueda sin cache
    await this.testSearchWithoutCache();
    
    // 3. Verificar resultados
    await this.verifyResults();
  }
  
  async clearLocutorCache() {
    console.log('\n🧹 === LIMPIANDO CACHE DE LOCUTORES ===');
    
    if (window.streamProcessor) {
      // Mostrar cache antes de limpiar
      console.log(`   Cache antes: ${window.streamProcessor.cache.size} entradas`);
      
      // Limpiar cache de locutores
      window.clearLocutorCache();
      
      // Mostrar cache después de limpiar
      console.log(`   Cache después: ${window.streamProcessor.cache.size} entradas`);
    } else {
      console.log('   ❌ Sistema no disponible');
    }
  }
  
  async testSearchWithoutCache() {
    console.log('\n🔍 === PROBANDO BÚSQUEDA SIN CACHE ===');
    
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`   Texto de prueba: "${testText}"`);
    
    if (window.streamProcessor) {
      // Forzar búsqueda sin cache
      const startTime = Date.now();
      const imageUrl = await window.forceImageSearch(testText);
      const responseTime = Date.now() - startTime;
      
      console.log(`   Imagen encontrada: ${imageUrl || 'No encontrada'}`);
      console.log(`   Tiempo de respuesta: ${responseTime}ms`);
      
      if (imageUrl) {
        const isLocal = imageUrl.includes('assets/img/locutor/');
        const isDavid = imageUrl.includes('david');
        
        console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
        console.log(`   Es imagen de David: ${isDavid ? '✅ SÍ' : '❌ NO'}`);
        
        if (isLocal && isDavid) {
          console.log('🎉 ¡ÉXITO! Se encontró imagen local de David');
        } else {
          console.log('⚠️ No se encontró imagen local de David');
        }
      } else {
        console.log('❌ No se encontró imagen');
      }
    } else {
      console.log('   ❌ Sistema no disponible');
    }
  }
  
  async verifyResults() {
    console.log('\n✅ === VERIFICANDO RESULTADOS ===');
    
    // Verificar elementos DOM
    const h2Element = document.querySelector('h2.cc_streaminfo');
    const imgElement = document.querySelector('img.player__img');
    
    if (h2Element && imgElement) {
      console.log(`   Texto actual: "${h2Element.textContent}"`);
      console.log(`   Imagen actual: "${imgElement.src}"`);
      
      const isLocal = imgElement.src.includes('assets/img/locutor/');
      const isDavid = imgElement.src.includes('david');
      
      console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
      console.log(`   Es imagen de David: ${isDavid ? '✅ SÍ' : '❌ NO'}`);
      
      if (isLocal && isDavid) {
        console.log('🎉 ¡PERFECTO! La imagen del reproductor es la de David');
      } else {
        console.log('⚠️ La imagen del reproductor no es la de David');
      }
    } else {
      console.log('   ❌ Elementos DOM no encontrados');
    }
    
    // Mostrar estadísticas finales
    if (window.streamProcessor) {
      const stats = window.streamProcessor.getStats();
      console.log(`   Cache final: ${stats.cacheSize} entradas`);
    }
  }
  
  // Función para simular cambio de texto
  simulateTextChange() {
    console.log('\n🎭 === SIMULANDO CAMBIO DE TEXTO ===');
    
    const h2Element = document.querySelector('h2.cc_streaminfo');
    if (h2Element) {
      const originalText = h2Element.textContent;
      console.log(`   Texto original: "${originalText}"`);
      
      // Cambiar el texto
      h2Element.textContent = 'DAVID FLORES DESDE CHILE';
      console.log(`   Texto simulado: "${h2Element.textContent}"`);
      
      // Disparar el procesamiento
      if (window.streamProcessor) {
        console.log('   Disparando procesamiento...');
        window.streamProcessor.debouncedProcess();
        
        // Esperar y verificar
        setTimeout(() => {
          const imgElement = document.querySelector('img.player__img');
          if (imgElement) {
            console.log(`   Imagen después del cambio: "${imgElement.src}"`);
            
            const isLocal = imgElement.src.includes('assets/img/locutor/');
            const isDavid = imgElement.src.includes('david');
            
            console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
            console.log(`   Es imagen de David: ${isDavid ? '✅ SÍ' : '❌ NO'}`);
            
            if (isLocal && isDavid) {
              console.log('🎉 ¡ÉXITO! La imagen cambió a la de David');
            } else {
              console.log('⚠️ La imagen no cambió correctamente');
            }
          }
        }, 3000);
      }
      
      // Restaurar después de 10 segundos
      setTimeout(() => {
        h2Element.textContent = originalText;
        console.log(`   Texto restaurado: "${originalText}"`);
      }, 10000);
    } else {
      console.log('   ❌ Elemento h2 no encontrado');
    }
  }
}

// Función para ejecutar prueba manual
window.runCacheTest = function() {
  new CacheTest();
};

// Función para limpiar cache y probar
window.clearAndTest = function() {
  console.log('🧹 Limpiando cache y probando...');
  window.clearLocutorCache();
  setTimeout(() => {
    new CacheTest();
  }, 1000);
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando prueba de cache...');
    new CacheTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new CacheTest();
      } else {
        console.log('❌ Sistema no disponible para prueba');
      }
    }, 5000);
  }
}, 2000);

console.log('🧹 Script de prueba de cache cargado.');
console.log('   Ejecuta window.runCacheTest() para prueba manual');
console.log('   Ejecuta window.clearAndTest() para limpiar cache y probar');
console.log('   Ejecuta window.clearLocutorCache() para solo limpiar cache');

