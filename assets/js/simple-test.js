/**
 * Script de Prueba Simple
 * Verifica que el sistema funcione correctamente
 */

// Esperar a que todo esté cargado
setTimeout(() => {
  console.log('🧪 === PRUEBA SIMPLE DEL SISTEMA ===');
  
  // 1. Verificar configuración
  console.log('\n1️⃣ Verificando configuración...');
  if (window.UnifiedStreamConfig) {
    console.log('✅ UnifiedStreamConfig disponible');
    console.log('   APIs configuradas:', Object.keys(window.UnifiedStreamConfig.apis));
    console.log('   Orden de búsqueda:', window.UnifiedStreamConfig.apis.local ? 'LOCAL primero' : 'LOCAL no configurado');
  } else {
    console.log('❌ UnifiedStreamConfig no disponible');
  }
  
  // 2. Verificar sistema unificado
  console.log('\n2️⃣ Verificando sistema unificado...');
  if (window.streamProcessor) {
    console.log('✅ StreamProcessor disponible');
    console.log('   Configuración:', window.streamProcessor.config);
    console.log('   APIs:', Object.keys(window.streamProcessor.apis));
    console.log('   Locutores conocidos:', window.streamProcessor.knownLocutors.length);
  } else {
    console.log('❌ StreamProcessor no disponible');
  }
  
  // 3. Probar detección de locutores
  console.log('\n3️⃣ Probando detección de locutores...');
  if (window.streamProcessor) {
    const testText = 'DAVID FLORES DESDE CHILE';
    const detected = window.streamProcessor.detectLocutorNames(testText);
    console.log(`   Texto: "${testText}"`);
    console.log(`   Locutores detectados: [${detected.join(', ')}]`);
    
    const hasDavid = detected.includes('david');
    console.log(`   ¿Detecta "david"? ${hasDavid ? '✅ SÍ' : '❌ NO'}`);
  }
  
  // 4. Probar búsqueda de imagen
  console.log('\n4️⃣ Probando búsqueda de imagen...');
  if (window.streamProcessor) {
    const testText = 'DAVID FLORES DESDE CHILE';
    console.log(`   Buscando imagen para: "${testText}"`);
    
    window.streamProcessor.findImage(testText).then(imageUrl => {
      console.log(`   Imagen encontrada: ${imageUrl || 'No encontrada'}`);
      
      if (imageUrl) {
        const isLocal = imageUrl.includes('assets/img/locutor/');
        const isDavid = imageUrl.includes('david');
        
        console.log(`   Es imagen local: ${isLocal ? '✅ SÍ' : '❌ NO'}`);
        console.log(`   Es imagen de David: ${isDavid ? '✅ SÍ' : '❌ NO'}`);
        
        if (isLocal && isDavid) {
          console.log('🎉 ¡ÉXITO! Sistema funcionando correctamente');
        } else {
          console.log('⚠️ Sistema no está funcionando como esperado');
        }
      } else {
        console.log('❌ No se encontró imagen');
      }
    }).catch(error => {
      console.log('❌ Error en búsqueda de imagen:', error);
    });
  }
  
  // 5. Verificar elementos DOM
  console.log('\n5️⃣ Verificando elementos DOM...');
  const h2Element = document.querySelector('h2.cc_streaminfo');
  const imgElement = document.querySelector('img.player__img');
  
  console.log(`   h2.cc_streaminfo: ${h2Element ? '✅ Encontrado' : '❌ No encontrado'}`);
  console.log(`   img.player__img: ${imgElement ? '✅ Encontrado' : '❌ No encontrado'}`);
  
  if (h2Element) {
    console.log(`   Texto actual: "${h2Element.textContent}"`);
  }
  
  if (imgElement) {
    console.log(`   Imagen actual: "${imgElement.src}"`);
  }
  
  console.log('\n🎯 === FIN DE PRUEBA SIMPLE ===');
}, 5000);

console.log('🧪 Script de prueba simple cargado');

