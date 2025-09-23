/**
 * Script de Prueba para Limpieza de Stream
 * Se ejecuta automáticamente para verificar que el sistema funciona
 */

(function() {
  'use strict';
  
  console.log('🧪 Iniciando prueba de limpieza de stream...');
  
  // Esperar a que el sistema unificado se cargue
  setTimeout(() => {
    if (window.streamProcessor) {
      console.log('✅ Sistema unificado detectado');
      
      // Probar limpieza con ejemplos
      const testCases = [
        'Desconocido - NI TU NI YO Ricardo ArjonA A Duo Con Paq...',
        'Unknown Artist - Song Title',
        'Intérprete Desconocido - Canción Bonita',
        'N/A - Music Playing',
        'Artista Desconocido - Título de Canción'
      ];
      
      console.log('🧪 Probando casos de limpieza:');
      testCases.forEach((testCase, index) => {
        const cleaned = window.forceCleanText(testCase);
        console.log(`   ${index + 1}. "${testCase}" → "${cleaned}"`);
      });
      
      // Verificar elemento actual
      const currentElement = document.querySelector('h2.cc_streaminfo') || 
                            document.querySelector('.cc_streaminfo') ||
                            document.querySelector('[data-type="rawmeta"]');
      
      if (currentElement) {
        const currentText = currentElement.textContent.trim();
        console.log('🎯 Texto actual en el reproductor:', currentText);
        
        if (currentText.includes('Desconocido') || currentText.includes('Unknown')) {
          console.log('⚠️ Texto contiene palabras no deseadas, aplicando limpieza...');
          window.cleanStreamText();
        } else {
          console.log('✅ Texto actual está limpio');
        }
      } else {
        console.warn('⚠️ No se encontró el elemento del stream');
      }
      
    } else {
      console.error('❌ Sistema unificado no está disponible');
    }
  }, 2000);
  
  // Función para probar limpieza manual
  window.testStreamCleanup = function() {
    console.log('🧪 Ejecutando prueba manual de limpieza...');
    
    const element = document.querySelector('h2.cc_streaminfo') || 
                   document.querySelector('.cc_streaminfo') ||
                   document.querySelector('[data-type="rawmeta"]');
    
    if (element) {
      const originalText = element.textContent.trim();
      console.log('📝 Texto original:', originalText);
      
      if (window.streamProcessor) {
        const cleanedText = window.streamProcessor.cleanText(originalText);
        console.log('🧹 Texto limpio:', cleanedText);
        
        if (cleanedText !== originalText) {
          element.textContent = cleanedText;
          console.log('✅ Texto actualizado en el reproductor');
        } else {
          console.log('ℹ️ El texto ya estaba limpio');
        }
      }
    } else {
      console.error('❌ No se encontró el elemento del stream');
    }
  };
  
  console.log('🎯 Comandos disponibles:');
  console.log('   - window.testStreamCleanup() - Probar limpieza manual');
  console.log('   - window.cleanStreamText() - Limpiar texto actual');
  console.log('   - window.forceCleanText("texto") - Limpiar texto específico');
  
})();











