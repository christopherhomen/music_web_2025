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
        const apiUrl = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF';

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

            canciones.forEach(cancion => {
                const track = cancion.track;

                const songItem = document.createElement('div');
                songItem.className = 'song-item';

                const img = document.createElement('img');
                img.src = track.album.images[0].url; // Obtener la portada del álbum

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

    // Llamar a la función para obtener las canciones populares al cargar la página
    obtenerCancionesPopulares();
