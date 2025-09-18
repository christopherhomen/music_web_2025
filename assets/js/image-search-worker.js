/**
 * Web Worker para Búsqueda de Imágenes
 * Optimiza el rendimiento ejecutando búsquedas en segundo plano
 */

// Worker para búsquedas de imágenes
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'SEARCH_IMAGE':
      handleImageSearch(data);
      break;
    case 'VERIFY_IMAGE':
      handleImageVerification(data);
      break;
    case 'PROCESS_TEXT':
      handleTextProcessing(data);
      break;
    default:
      self.postMessage({ type: 'ERROR', error: 'Tipo de mensaje no reconocido' });
  }
};

async function handleImageSearch(data) {
  const { text, apis, config } = data;
  
  try {
    const processedText = processText(text);
    const results = await searchMultipleApis(processedText, apis, config);
    
    self.postMessage({
      type: 'SEARCH_RESULT',
      data: {
        text,
        result: results.bestMatch,
        allResults: results.allResults,
        processingTime: results.processingTime
      }
    });
  } catch (error) {
    self.postMessage({
      type: 'SEARCH_ERROR',
      error: error.message
    });
  }
}

async function handleImageVerification(data) {
  const { imageUrl } = data;
  
  try {
    const exists = await verifyImageExists(imageUrl);
    self.postMessage({
      type: 'VERIFICATION_RESULT',
      data: { imageUrl, exists }
    });
  } catch (error) {
    self.postMessage({
      type: 'VERIFICATION_ERROR',
      error: error.message
    });
  }
}

function handleTextProcessing(data) {
  const { text } = data;
  
  try {
    const processed = processText(text);
    self.postMessage({
      type: 'TEXT_PROCESSED',
      data: processed
    });
  } catch (error) {
    self.postMessage({
      type: 'PROCESSING_ERROR',
      error: error.message
    });
  }
}

function processText(text) {
  const cleaned = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  
  const badWords = [
    'desconocido', 'unknown', 'interprete', 'artista', 'n/a',
    'performance radio', 'al aire', 'en vivo'
  ];
  
  const words = cleaned
    .split(/[\s\-–—:|,]+/)
    .filter(word => word.length > 1 && !badWords.includes(word))
    .map(word => word.replace(/[^\w\s]/g, ''));
  
  const artistTitle = extractArtistTitle(cleaned);
  const combinations = generateWordCombinations(words);
  
  return {
    original: text,
    cleaned,
    words,
    artistTitle,
    combinations
  };
}

function extractArtistTitle(text) {
  const separators = /[-–—:|]/;
  const parts = text.split(separators).map(p => p.trim()).filter(p => p);
  
  if (parts.length >= 2) {
    return {
      artist: parts[0],
      title: parts[1]
    };
  }
  
  return null;
}

function generateWordCombinations(words) {
  const combinations = [];
  
  // Combinaciones de 2 palabras
  for (let i = 0; i < words.length - 1; i++) {
    combinations.push(`${words[i]}_${words[i + 1]}`);
  }
  
  // Combinaciones de 3 palabras
  for (let i = 0; i < words.length - 2; i++) {
    combinations.push(`${words[i]}_${words[i + 1]}_${words[i + 2]}`);
  }
  
  return [...words, ...combinations];
}

async function searchMultipleApis(processedText, apis, config) {
  const startTime = performance.now();
  const searchPromises = [];
  
  // Apple Music
  if (apis.appleMusic.enabled) {
    searchPromises.push(searchAppleMusic(processedText, config));
  }
  
  // Last.fm
  if (apis.lastFm.enabled) {
    searchPromises.push(searchLastFm(processedText, config));
  }
  
  // YouTube
  if (apis.youtube.enabled) {
    searchPromises.push(searchYouTube(processedText, config));
  }
  
  // Spotify
  if (apis.spotify.enabled) {
    searchPromises.push(searchSpotify(processedText, config));
  }
  
  const results = await Promise.allSettled(searchPromises);
  const validResults = results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);
  
  const processingTime = performance.now() - startTime;
  
  return {
    bestMatch: validResults[0] || null,
    allResults: validResults,
    processingTime
  };
}

async function searchAppleMusic(processedText, config) {
  try {
    const { artistTitle } = processedText;
    if (!artistTitle) return null;
    
    const searchTerm = encodeURIComponent(`${artistTitle.artist} ${artistTitle.title}`);
    const url = `https://itunes.apple.com/search?entity=song&limit=1&term=${searchTerm}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, { 
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return result.artworkUrl100 || result.artworkUrl60 || null;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error en Apple Music:', error);
    }
  }
  return null;
}

async function searchLastFm(processedText, config) {
  try {
    const { artistTitle, words } = processedText;
    const searchTerm = artistTitle ? 
      `${artistTitle.artist} ${artistTitle.title}` : 
      words.join(' ');
    
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchTerm)}&api_key=${config.apiKey}&format=json`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, { 
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results?.albummatches?.album?.length > 0) {
      const album = data.results.albummatches.album[0];
      return album.image?.[3]?.['#text'] || null;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error en Last.fm:', error);
    }
  }
  return null;
}

async function searchYouTube(processedText, config) {
  try {
    const { artistTitle, words } = processedText;
    const searchTerm = artistTitle ? 
      `${artistTitle.artist} ${artistTitle.title}` : 
      words.join(' ');
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm)}&type=video&key=${config.apiKey}&maxResults=1`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, { 
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet.thumbnails.high?.url || null;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error en YouTube:', error);
    }
  }
  return null;
}

async function searchSpotify(processedText, config) {
  try {
    const { artistTitle, words } = processedText;
    const searchTerm = artistTitle ? 
      `${artistTitle.artist} ${artistTitle.title}` : 
      words.join(' ');
    
    // Obtener token de acceso
    const accessToken = await getSpotifyAccessToken(config);
    if (!accessToken) return null;
    
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=1`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
      const track = data.tracks.items[0];
      return track.album.images[0]?.url || track.album.images[1]?.url || null;
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error en Spotify:', error);
    }
  }
  return null;
}

async function getSpotifyAccessToken(config) {
  try {
    const { clientId, clientSecret } = config;
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(clientId + ':' + clientSecret)}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error obteniendo token de Spotify:', error);
    return null;
  }
}

async function verifyImageExists(imageUrl) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}
