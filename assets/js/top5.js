//<!-- Script del top 5 -->

    async function obtenerTokenSpotify() {
        const client_id = 'f1b16c2196f54bc5af6bebb3dcdcb811';
        const client_secret = '8e271fe82c07474ab3b3d591e3eece49';
        const url = 'https://accounts.spotify.com/api/token';
        
        const auth = btoa(`${client_id}:${client_secret}`); // Codifica en Base64

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            });

            if (!response.ok) {
                throw new Error('Error al autenticar con Spotify');
            }

            const data = await response.json();
            return data.access_token;

        } catch (error) {
            console.error('Error al obtener el token de acceso:', error);
        }
    }

    async function obtenerCancionesPopulares() {
        const token = await obtenerTokenSpotify();
        if (!token) return;

        // URL de la playlist de Top 50 Global (puedes usar cualquier otra)
        //37i9dQZEVXbMDoHDwVN2tF
        //https://open.spotify.com/playlist/6UeSakyzhiEt4NB3UAd6NQ?si=085996fab5d64024
        const apiUrl = 'https://api.spotify.com/v1/playlists/6UeSakyzhiEt4NB3UAd6NQ?si=085996fab5d64024';

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las canciones');
            }

            const datos = await response.json();
            const canciones = datos.tracks.items.slice(0, 5); // Obtener las primeras 5 canciones

            // Insertar las canciones en la lista del HTML
            const listadoElement = document.getElementById('top-5-list');
            listadoElement.innerHTML = ''; // Limpiar cualquier contenido existente

            // Establecer la imagen de fondo del #1
            if (canciones.length > 0) {
                const firstTrack = canciones[0].track;
                const backgroundImage = firstTrack.album.images[0].url;
                
                // Buscar contenedor (compatible con ambas estructuras)
                const container = document.querySelector('.top-5-container') || document.querySelector('.top5-hero');
                const bgElement = document.querySelector('.top5-hero__bg');
                
                if (container) {
                    if (bgElement) {
                        // Para index_seo_perf.html
                        bgElement.style.backgroundImage = `url(${backgroundImage})`;
                    } else {
                        // Para index.html
                        container.style.backgroundImage = `url(${backgroundImage})`;
                    }
                }
            }

            canciones.forEach((cancion, index) => {
                const track = cancion.track;

                // Crear elemento li para index_seo_perf.html o div para index.html
                const songItem = document.createElement(listadoElement.tagName === 'OL' ? 'li' : 'div');
                songItem.className = 'song-item';
                songItem.setAttribute('data-position', index + 1); // Agregar número de posición

                const img = document.createElement('img');
                img.src = track.album.images[0].url; // Obtener la portada del álbum
                img.alt = `${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`;

                const songInfo = document.createElement('div');
                songInfo.className = 'song-info';

                const songTitle = document.createElement('p');
                songTitle.className = 'song-title';
                songTitle.textContent = track.name;

                const songArtist = document.createElement('p');
                songArtist.className = 'song-artist';
                songArtist.textContent = track.artists.map(artist => artist.name).join(", ");

                songInfo.appendChild(songTitle);
                songInfo.appendChild(songArtist);
                songItem.appendChild(img);
                songItem.appendChild(songInfo);

                listadoElement.appendChild(songItem);
            });

        } catch (error) {
            console.error('Error al obtener las canciones:', error);
        }
    }

    // Función para forzar el movimiento del listado - SOLO MÓVIL
    function forzarMovimientoListado() {
        const listadoElement = document.getElementById('top-5-list');
        if (listadoElement) {
            const width = window.innerWidth;
            
            // Solo aplicar en móvil (max-width: 768px)
            if (width <= 768) {
                // Aplicar estilos directamente con JavaScript - VALORES EXTREMOS SOLO MÓVIL
                listadoElement.style.setProperty('margin-top', '-150px', 'important');
                listadoElement.style.setProperty('transform', 'translateY(-50px)', 'important');
                listadoElement.style.setProperty('position', 'relative', 'important');
                
                console.log('Listado movido con JavaScript EXTREMO (MÓVIL):', listadoElement);
            } else {
                // En escritorio, mantener valores normales
                listadoElement.style.setProperty('margin-top', '0', 'important');
                listadoElement.style.setProperty('transform', 'none', 'important');
                listadoElement.style.setProperty('position', 'relative', 'important');
                
                console.log('Listado con valores normales (ESCRITORIO):', listadoElement);
            }
        }
    }

    // Función para aplicar estilos responsivos - SOLO MÓVIL
    function aplicarEstilosResponsivos() {
        const listadoElement = document.getElementById('top-5-list');
        if (!listadoElement) return;

        const width = window.innerWidth;
        
        // Solo aplicar valores extremos en móvil
        if (width <= 768) {
            if (width <= 360) {
                // Móvil muy pequeño - VALORES EXTREMOS
                listadoElement.style.setProperty('margin-top', '-160px', 'important');
                listadoElement.style.setProperty('transform', 'translateY(-60px)', 'important');
            } else if (width <= 480) {
                // Móvil - VALORES EXTREMOS
                listadoElement.style.setProperty('margin-top', '-150px', 'important');
                listadoElement.style.setProperty('transform', 'translateY(-50px)', 'important');
            } else {
                // Tablet - VALORES EXTREMOS
                listadoElement.style.setProperty('margin-top', '-150px', 'important');
                listadoElement.style.setProperty('transform', 'translateY(-50px)', 'important');
            }
        } else {
            // Escritorio - VALORES NORMALES
            listadoElement.style.setProperty('margin-top', '0', 'important');
            listadoElement.style.setProperty('transform', 'none', 'important');
        }
        
        listadoElement.style.setProperty('position', 'relative', 'important');
    }

    // Llamar a la función para obtener las canciones populares al cargar la página
    obtenerCancionesPopulares();

    // Aplicar movimiento después de cargar las canciones
    setTimeout(() => {
        forzarMovimientoListado();
        aplicarEstilosResponsivos();
    }, 1000);

    // Aplicar estilos al redimensionar la ventana
    window.addEventListener('resize', aplicarEstilosResponsivos);

    // Aplicar estilos cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            forzarMovimientoListado();
            aplicarEstilosResponsivos();
        }, 500);
    });
