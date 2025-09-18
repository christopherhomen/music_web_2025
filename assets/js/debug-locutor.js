/**
 * Script de Debug Específico para Locutores
 * Debug del caso "DAVID FLORES DESDE CHILE"
 */

class LocutorDebug {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('🔍 Iniciando debug específico de locutores...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runDebug();
    }, 3000);
  }
  
  async runDebug() {
    console.log('🚀 Ejecutando debug...');
    
    // Debug específico para David Flores
    await this.debugDavidFlores();
    
    // Debug del sistema actual
    await this.debugCurrentSystem();
    
    // Debug de búsqueda local
    await this.debugLocalSearch();
  }
  
  async debugDavidFlores() {
    console.log('\n🔍 === DEBUG ESPECÍFICO: DAVID FLORES ===');
    
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`📝 Texto de prueba: "${testText}"`);
    
    // 1. Debug de detección de locutores
    console.log('\n1️⃣ Debug de detección de locutores...');
    if (window.streamProcessor) {
      const detected = window.streamProcessor.detectLocutorNames(testText);
      console.log(`   Locutores detectados: [${detected.join(', ')}]`);
      
      // Debug paso a paso
      const words = testText.toLowerCase().split(/\s+/);
      console.log(`   Palabras extraídas: [${words.join(', ')}]`);
      
      for (const word of words) {
        const cleanWord = word.replace(/[^a-záéíóúñ]/g, '');
        const isKnown = window.streamProcessor.knownLocutors.includes(cleanWord);
        console.log(`   "${word}" → "${cleanWord}" → ${isKnown ? '✅ CONOCIDO' : '❌ DESCONOCIDO'}`);
      }
    } else {
      console.log('   ❌ Sistema no disponible');
    }
    
    // 2. Debug de extracción de palabras
    console.log('\n2️⃣ Debug de extracción de palabras...');
    if (window.streamProcessor) {
      const words = window.streamProcessor.extractSearchWords(testText);
      console.log(`   Palabras para búsqueda: [${words.join(', ')}]`);
    }
    
    // 3. Debug de búsqueda de imagen
    console.log('\n3️⃣ Debug de búsqueda de imagen...');
    if (window.streamProcessor) {
      const startTime = Date.now();
      const imageUrl = await window.streamProcessor.findImage(testText);
      const responseTime = Date.now() - startTime;
      
      console.log(`   Imagen encontrada: ${imageUrl || 'No encontrada'}`);
      console.log(`   Tiempo de respuesta: ${responseTime}ms`);
      
      // Verificar si es imagen local
      const isLocal = imageUrl && imageUrl.includes('assets/img/locutor/');
      console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
      
      if (isLocal) {
        console.log('🎉 ¡ÉXITO! Se encontró imagen local del locutor');
      } else {
        console.log('⚠️ Se usó imagen externa en lugar de local');
      }
    }
  }
  
  async debugCurrentSystem() {
    console.log('\n🔍 === DEBUG DEL SISTEMA ACTUAL ===');
    
    // Verificar elementos DOM
    console.log('\n1️⃣ Verificando elementos DOM...');
    const h2Element = document.querySelector('h2.cc_streaminfo');
    const imgElement = document.querySelector('img.player__img');
    
    console.log(`   h2.cc_streaminfo: ${h2Element ? '✅ Encontrado' : '❌ No encontrado'}`);
    console.log(`   img.player__img: ${imgElement ? '✅ Encontrado' : '❌ No encontrado'}`);
    
    if (h2Element) {
      console.log(`   Texto actual en h2: "${h2Element.textContent}"`);
    }
    
    if (imgElement) {
      console.log(`   Imagen actual: "${imgElement.src}"`);
    }
    
    // Verificar sistema unificado
    console.log('\n2️⃣ Verificando sistema unificado...');
    console.log(`   streamProcessor: ${window.streamProcessor ? '✅ Disponible' : '❌ No disponible'}`);
    
    if (window.streamProcessor) {
      console.log(`   Cache size: ${window.streamProcessor.cache.size}`);
      console.log(`   Known locutors: ${window.streamProcessor.knownLocutors.length}`);
      console.log(`   Locutors: [${window.streamProcessor.knownLocutors.join(', ')}]`);
    }
  }
  
  async debugLocalSearch() {
    console.log('\n🔍 === DEBUG DE BÚSQUEDA LOCAL ===');
    
    const testNames = ['david', 'flores', 'david_flores'];
    
    for (const name of testNames) {
      console.log(`\n🔍 Probando imagen local: ${name}.JPG`);
      
      try {
        const imagePath = `assets/img/locutor/${name}.JPG`;
        console.log(`   Ruta: ${imagePath}`);
        
        const response = await fetch(imagePath, { method: 'HEAD' });
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          console.log(`   ✅ Imagen existe: ${imagePath}`);
        } else {
          console.log(`   ❌ Imagen no existe: ${imagePath}`);
        }
      } catch (error) {
        console.log(`   ❌ Error verificando: ${imagePath}`);
        console.log(`   Error: ${error.message}`);
      }
    }
  }
  
  // Función para simular el cambio de texto
  simulateTextChange() {
    console.log('\n🎭 === SIMULANDO CAMBIO DE TEXTO ===');
    
    const h2Element = document.querySelector('h2.cc_streaminfo');
    if (h2Element) {
      const originalText = h2Element.textContent;
      h2Element.textContent = 'DAVID FLORES DESDE CHILE';
      
      console.log(`   Texto original: "${originalText}"`);
      console.log(`   Texto simulado: "${h2Element.textContent}"`);
      
      // Disparar el evento de cambio
      if (window.streamProcessor) {
        window.streamProcessor.debouncedProcess();
      }
      
      // Restaurar después de 5 segundos
      setTimeout(() => {
        h2Element.textContent = originalText;
        console.log(`   Texto restaurado: "${originalText}"`);
      }, 5000);
    } else {
      console.log('   ❌ Elemento h2 no encontrado');
    }
  }
}

// Función para ejecutar debug manual
window.runLocutorDebug = function() {
  new LocutorDebug();
};

// Función para simular cambio de texto
window.simulateTextChange = function() {
  const debug = new LocutorDebug();
  debug.simulateTextChange();
};

// Ejecutar debug automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando debug...');
    new LocutorDebug();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new LocutorDebug();
      } else {
        console.log('❌ Sistema no disponible para debug');
      }
    }, 5000);
  }
}, 2000);

console.log('🔍 Script de debug de locutores cargado.');
console.log('   Ejecuta window.runLocutorDebug() para debug manual');
console.log('   Ejecuta window.simulateTextChange() para simular cambio de texto');

