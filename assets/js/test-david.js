/**
 * Script de Prueba Específica para David Flores
 * Verifica que el sistema detecte y use la imagen local
 */

class DavidTest {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('🎤 Iniciando prueba específica para David Flores...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runDavidTest();
    }, 3000);
  }
  
  async runDavidTest() {
    console.log('🚀 Ejecutando prueba de David Flores...');
    
    // Test específico para David Flores
    await this.testDavidFlores();
    
    // Test de simulación de cambio de texto
    await this.simulateTextChange();
  }
  
  async testDavidFlores() {
    console.log('\n🎤 === PRUEBA ESPECÍFICA: DAVID FLORES ===');
    
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`📝 Texto de prueba: "${testText}"`);
    
    // 1. Probar detección de locutores
    console.log('\n1️⃣ Probando detección de locutores...');
    if (window.streamProcessor) {
      const detected = window.streamProcessor.detectLocutorNames(testText);
      console.log(`   Locutores detectados: [${detected.join(', ')}]`);
      
      // Verificar que detecte "david"
      const hasDavid = detected.includes('david');
      console.log(`   ¿Detecta "david"? ${hasDavid ? '✅ SÍ' : '❌ NO'}`);
      
      // Verificar que detecte "flores"
      const hasFlores = detected.includes('flores');
      console.log(`   ¿Detecta "flores"? ${hasFlores ? '✅ SÍ' : '❌ NO'}`);
    }
    
    // 2. Probar extracción de palabras
    console.log('\n2️⃣ Probando extracción de palabras...');
    if (window.streamProcessor) {
      const words = window.streamProcessor.extractSearchWords(testText);
      console.log(`   Palabras para búsqueda: [${words.join(', ')}]`);
    }
    
    // 3. Probar búsqueda de imagen
    console.log('\n3️⃣ Probando búsqueda de imagen...');
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
        
        // Verificar si es específicamente la imagen de David
        const isDavidImage = imageUrl.includes('david');
        console.log(`   Es imagen de David: ${isDavidImage ? '✅ SÍ' : '❌ NO'}`);
      } else {
        console.log('⚠️ Se usó imagen externa en lugar de local');
      }
    }
  }
  
  async simulateTextChange() {
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
        
        // Esperar un poco y verificar la imagen
        setTimeout(() => {
          const imgElement = document.querySelector('img.player__img');
          if (imgElement) {
            console.log(`   Imagen actual: "${imgElement.src}"`);
            
            const isLocal = imgElement.src.includes('assets/img/locutor/');
            const isDavid = imgElement.src.includes('david');
            
            console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
            console.log(`   Es imagen de David: ${isDavid ? '✅ SÍ' : '❌ NO'}`);
            
            if (isLocal && isDavid) {
              console.log('🎉 ¡PERFECTO! La imagen cambió a la de David');
            } else {
              console.log('⚠️ La imagen no cambió correctamente');
            }
          }
        }, 2000);
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
  
  // Función para verificar imagen de David
  async verifyDavidImage() {
    console.log('\n🔍 === VERIFICANDO IMAGEN DE DAVID ===');
    
    try {
      const imagePath = 'assets/img/locutor/david.JPG';
      const response = await fetch(imagePath, { method: 'HEAD' });
      
      if (response.ok) {
        console.log(`✅ Imagen de David existe: ${imagePath}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        return true;
      } else {
        console.log(`❌ Imagen de David no existe: ${imagePath}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Error verificando imagen de David: ${error.message}`);
      return false;
    }
  }
}

// Función para ejecutar prueba manual
window.runDavidTest = function() {
  new DavidTest();
};

// Función para verificar imagen de David
window.verifyDavidImage = async function() {
  const test = new DavidTest();
  return await test.verifyDavidImage();
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando prueba de David...');
    new DavidTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new DavidTest();
      } else {
        console.log('❌ Sistema no disponible para prueba');
      }
    }, 5000);
  }
}, 2000);

console.log('🎤 Script de prueba de David cargado.');
console.log('   Ejecuta window.runDavidTest() para prueba manual');
console.log('   Ejecuta window.verifyDavidImage() para verificar imagen');

