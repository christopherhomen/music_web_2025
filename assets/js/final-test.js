/**
 * Script de Prueba Final
 * Verifica que el sistema funcione correctamente con la configuración corregida
 */

class FinalTest {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('🎯 Iniciando prueba final del sistema...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runFinalTest();
    }, 3000);
  }
  
  async runFinalTest() {
    console.log('🚀 Ejecutando prueba final...');
    
    // 1. Verificar configuración
    await this.verifyConfiguration();
    
    // 2. Limpiar cache
    await this.clearCache();
    
    // 3. Probar búsqueda local
    await this.testLocalSearch();
    
    // 4. Verificar resultados
    await this.verifyResults();
  }
  
  async verifyConfiguration() {
    console.log('\n✅ === VERIFICANDO CONFIGURACIÓN ===');
    
    if (window.UnifiedStreamConfig) {
      console.log('✅ UnifiedStreamConfig disponible');
      console.log('   APIs configuradas:', Object.keys(window.UnifiedStreamConfig.apis));
      
      // Verificar que local esté configurado
      if (window.UnifiedStreamConfig.apis.local) {
        console.log('✅ Fuente LOCAL configurada');
        console.log(`   Prioridad: ${window.UnifiedStreamConfig.apis.local.priority}`);
        console.log(`   Habilitada: ${window.UnifiedStreamConfig.apis.local.enabled}`);
      } else {
        console.log('❌ Fuente LOCAL no configurada');
      }
      
      // Mostrar orden de búsqueda
      const apis = Object.entries(window.UnifiedStreamConfig.apis)
        .filter(([name, config]) => config.enabled)
        .sort((a, b) => (a[1].priority || 999) - (b[1].priority || 999));
      
      console.log('   Orden de búsqueda:');
      apis.forEach(([name, config], index) => {
        const emoji = {
          'local': '📁',
          'spotify': '🎵',
          'appleMusic': '🍎',
          'youtubeMusic': '🎶',
          'lastFm': '🎧',
          'youtube': '📺'
        }[name] || '❓';
        console.log(`     ${index + 1}. ${emoji} ${name.toUpperCase()} (prioridad: ${config.priority})`);
      });
    } else {
      console.log('❌ UnifiedStreamConfig no disponible');
    }
  }
  
  async clearCache() {
    console.log('\n🧹 === LIMPIANDO CACHE ===');
    
    if (window.streamProcessor) {
      console.log(`   Cache antes: ${window.streamProcessor.cache.size} entradas`);
      window.clearLocutorCache();
      console.log(`   Cache después: ${window.streamProcessor.cache.size} entradas`);
    } else {
      console.log('   ❌ Sistema no disponible');
    }
  }
  
  async testLocalSearch() {
    console.log('\n🔍 === PROBANDO BÚSQUEDA LOCAL ===');
    
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`   Texto de prueba: "${testText}"`);
    
    if (window.streamProcessor) {
      // Verificar detección de locutores
      const detected = window.streamProcessor.detectLocutorNames(testText);
      console.log(`   Locutores detectados: [${detected.join(', ')}]`);
      
      // Verificar extracción de palabras
      const words = window.streamProcessor.extractSearchWords(testText);
      console.log(`   Palabras para búsqueda: [${words.join(', ')}]`);
      
      // Verificar fuentes de búsqueda
      const sources = window.streamProcessor.getSourcesByPriority();
      console.log(`   Fuentes de búsqueda: [${sources.join(', ')}]`);
      
      // Probar búsqueda
      console.log('   Ejecutando búsqueda...');
      const startTime = Date.now();
      const imageUrl = await window.streamProcessor.findImage(testText);
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
    console.log('\n🎯 === VERIFICANDO RESULTADOS ===');
    
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
      console.log(`   Fuentes disponibles: ${stats.searchOrder.length}`);
    }
    
    console.log('\n🎯 === FIN DE PRUEBA FINAL ===');
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
window.runFinalTest = function() {
  new FinalTest();
};

// Función para simular cambio de texto
window.simulateTextChange = function() {
  const test = new FinalTest();
  test.simulateTextChange();
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando prueba final...');
    new FinalTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new FinalTest();
      } else {
        console.log('❌ Sistema no disponible para prueba');
      }
    }, 5000);
  }
}, 2000);

console.log('🎯 Script de prueba final cargado.');
console.log('   Ejecuta window.runFinalTest() para prueba manual');
console.log('   Ejecuta window.simulateTextChange() para simular cambio de texto');

