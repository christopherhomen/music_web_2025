/**
 * Script de Prueba Específica para Locutores
 * Prueba el caso específico de "DAVID FLORES DESDE CHILE"
 */

class LocutorTest {
  constructor() {
    this.init();
  }
  
  init() {
    console.log('🎤 Iniciando prueba específica de locutores...');
    
    // Esperar a que el sistema esté listo
    setTimeout(() => {
      this.runLocutorTests();
    }, 3000);
  }
  
  async runLocutorTests() {
    console.log('🚀 Ejecutando pruebas de locutores...');
    
    // Test específico para David Flores
    await this.testDavidFlores();
    
    // Test de otros locutores
    await this.testOtherLocutors();
    
    // Test de búsqueda de imágenes locales
    await this.testLocalImageSearch();
    
    // Mostrar resultados
    this.showResults();
  }
  
  async testDavidFlores() {
    console.log('\n🎤 === PRUEBA ESPECÍFICA: DAVID FLORES ===');
    
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`📝 Texto de prueba: "${testText}"`);
    
    // 1. Probar detección de locutores
    console.log('\n1️⃣ Probando detección de locutores...');
    const detected = window.testLocutorDetection(testText);
    console.log(`   Resultado: [${detected.join(', ')}]`);
    
    // 2. Probar limpieza de texto
    console.log('\n2️⃣ Probando limpieza de texto...');
    const cleaned = window.forceCleanText(testText);
    console.log(`   Resultado: "${cleaned}"`);
    
    // 3. Probar búsqueda de imagen
    console.log('\n3️⃣ Probando búsqueda de imagen...');
    const startTime = Date.now();
    const imageUrl = await window.streamProcessor.findImage(testText);
    const responseTime = Date.now() - startTime;
    
    console.log(`   Imagen encontrada: ${imageUrl || 'No encontrada'}`);
    console.log(`   Tiempo de respuesta: ${responseTime}ms`);
    
    // 4. Verificar si es imagen local
    const isLocal = imageUrl && imageUrl.includes('assets/img/locutor/');
    console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
    
    if (isLocal) {
      console.log('🎉 ¡ÉXITO! Se encontró imagen local del locutor');
    } else {
      console.log('⚠️ Se usó imagen externa en lugar de local');
    }
  }
  
  async testOtherLocutors() {
    console.log('\n🎤 === PRUEBA DE OTROS LOCUTORES ===');
    
    const testCases = [
      'MARIA JOSE EN VIVO',
      'CARLOS ALBERTO DESDE MEXICO', 
      'ANA PATRICIA CON MUSICA',
      'RICARDO FERNANDEZ EN DIRECTO',
      'FERNANDO GUTIERREZ DESDE COLOMBIA'
    ];
    
    for (const testCase of testCases) {
      console.log(`\n📝 Probando: "${testCase}"`);
      
      const detected = window.testLocutorDetection(testCase);
      console.log(`   Locutores detectados: [${detected.join(', ')}]`);
      
      const cleaned = window.forceCleanText(testCase);
      console.log(`   Texto limpio: "${cleaned}"`);
    }
  }
  
  async testLocalImageSearch() {
    console.log('\n🖼️ === PRUEBA DE BÚSQUEDA LOCAL ===');
    
    const testNames = ['david', 'flores', 'david_flores', 'maria', 'carlos'];
    
    for (const name of testNames) {
      console.log(`\n🔍 Probando imagen local: ${name}.JPG`);
      
      try {
        const imagePath = `assets/img/locutor/${name}.JPG`;
        const response = await fetch(imagePath, { method: 'HEAD' });
        
        if (response.ok) {
          console.log(`   ✅ Imagen existe: ${imagePath}`);
        } else {
          console.log(`   ❌ Imagen no existe: ${imagePath}`);
        }
      } catch (error) {
        console.log(`   ❌ Error verificando: ${imagePath}`);
      }
    }
  }
  
  showResults() {
    console.log('\n🎯 === RESUMEN DE PRUEBAS DE LOCUTORES ===');
    console.log('==========================================');
    
    // Mostrar locutores conocidos
    console.log('\n🎤 Locutores conocidos en el sistema:');
    const knownLocutors = window.getKnownLocutors();
    console.log(`   Total: ${knownLocutors.length} locutores`);
    console.log(`   Lista: ${knownLocutors.join(', ')}`);
    
    // Mostrar orden de búsqueda
    console.log('\n🔍 Orden de búsqueda actual:');
    window.showSearchOrder();
    
    // Mostrar estadísticas
    console.log('\n📊 Estadísticas del sistema:');
    console.log(window.streamProcessor.getStats());
    
    // Crear panel de resultados
    this.createResultsPanel();
  }
  
  createResultsPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.95);
      color: #00ff00;
      padding: 20px;
      border-radius: 10px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 400px;
      border: 2px solid #00ff00;
    `;
    
    const knownLocutors = window.getKnownLocutors();
    
    panel.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #00ff00;">🎤 PRUEBA DE LOCUTORES</h3>
      <div><strong>Texto probado:</strong> "DAVID FLORES DESDE CHILE"</div>
      <div><strong>Locutores conocidos:</strong> ${knownLocutors.length}</div>
      <div><strong>Detección:</strong> ${knownLocutors.includes('david') ? '✅' : '❌'} David</div>
      <div><strong>Detección:</strong> ${knownLocutors.includes('flores') ? '✅' : '❌'} Flores</div>
      <div><strong>Detección:</strong> ${knownLocutors.includes('david flores') ? '✅' : '❌'} David Flores</div>
      <div style="margin-top: 10px; font-size: 10px; color: #888;">
        Verifica en consola los resultados detallados
      </div>
      <button onclick="this.parentElement.remove()" style="margin-top: 15px; background: #00ff00; color: #000; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Cerrar</button>
    `;
    
    document.body.appendChild(panel);
  }
}

// Función para ejecutar prueba manual
window.runLocutorTest = function() {
  new LocutorTest();
};

// Ejecutar prueba automáticamente
setTimeout(() => {
  if (window.streamProcessor) {
    console.log('🎯 Sistema listo, ejecutando prueba de locutores...');
    new LocutorTest();
  } else {
    console.log('⏳ Esperando sistema...');
    setTimeout(() => {
      if (window.streamProcessor) {
        new LocutorTest();
      } else {
        console.log('❌ Sistema no disponible para prueba');
      }
    }, 5000);
  }
}, 2000);

console.log('🎤 Script de prueba de locutores cargado. Ejecuta window.runLocutorTest() para prueba manual.');

