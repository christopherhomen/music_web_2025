const h2Element = document.querySelector('h2.cc_streaminfo');
const imgElement = document.querySelector('img.player__img');
let prevText = null;
const cache = {};

async function updateImage() {
  const text = h2Element.textContent.trim();
  
  if (text !== prevText) {
    prevText = text;

    // Mostrar la imagen por defecto inmediatamente antes de buscar la nueva
    imgElement.src = 'assets/img/locutor/default.JPG';

    // Excluir "Interprete Desconocido" del texto
    const words = text.split(' ')
      .filter(word => word.toLowerCase() !== 'desconocido' && word.toLowerCase() !== 'interprete');

    let foundImage = false;

    // Optimizar la búsqueda local usando Promesas
    if (words.length > 0) {  // Solo buscar si quedan palabras
      foundImage = await searchLocalImages(words);

      if (!foundImage) {
        foundImage = await searchExternalAPIs(words);
      }
    }

    // Si se encuentra una imagen válida, se actualiza el src del elemento img
    if (!foundImage) {
      imgElement.src = 'assets/img/locutor/default.JPG'; // Mantiene la imagen por defecto si no se encuentra ninguna
    }
  }
}

async function searchLocalImages(words) {
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j <= words.length; j++) {
      const wordCombination = words.slice(i, j).join('_').toLowerCase();
      const imgPath = `assets/img/locutor/${wordCombination}.JPG`;
      if (await imageExists(imgPath)) {
        imgElement.src = imgPath;  // Actualiza la imagen cuando se encuentra
        return true;
      }
    }
  }

  for (const word of words) {
    const imgPath = `assets/img/locutor/${word.toLowerCase()}.JPG`;
    if (await imageExists(imgPath)) {
      imgElement.src = imgPath;  // Actualiza la imagen cuando se encuentra
      return true;
    }
  }

  return false;
}

async function searchExternalAPIs(words) {
  const searchPromises = [searchLastFm(words), searchYouTube(words)];
  const results = await Promise.all(searchPromises);

  for (const result of results) {
    if (result) {
      imgElement.src = result;  // Actualiza la imagen cuando se encuentra
      return true;
    }
  }

  return false;
}

async function searchLastFm(words) {
  const apiKey = '21f84fcdb8652dccff838fbbb408d91e';
  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=${words.join('+')}&api_key=${apiKey}&format=json`);
    const data = await response.json();
    const albumImage = data.results.albummatches.album[0].image[3]['#text'];
    return albumImage || null;
  } catch (error) {
    console.error('Error fetching from Last.fm:', error);
    return null;
  }
}

async function searchYouTube(words) {
  const apiKey = 'AIzaSyCO5F3yenpdk4j1zknsu3rn3NKYzoTvbBA';
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${words.join('+')}&type=video&key=${apiKey}`);
    const data = await response.json();
    const videoThumbnail = data.items[0].snippet.thumbnails.high.url;
    return videoThumbnail || null;
  } catch (error) {
    console.error('Error fetching from YouTube:', error);
    return null;
  }
}

async function imageExists(imageUrl) {
  if (cache[imageUrl] !== undefined) {
    return cache[imageUrl];
  }

  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    cache[imageUrl] = response.ok;
    return response.ok;
  } catch (error) {
    cache[imageUrl] = false;
    return false;
  }
}

setInterval(updateImage, 1000);
