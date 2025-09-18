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

async function obtenerAlbumRecomendado() {
    const token = await obtenerTokenSpotify();
    if (!token) return;

    // URL del endpoint de "Novedades" o álbum popular
    const apiUrl = 'https://api.spotify.com/v1/browse/new-releases?country=US&limit=1';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener el álbum');
        }

        const data = await response.json();
        const album = data.albums.items[0]; // Obtener el primer álbum de las novedades

        // Insertar los detalles del álbum en el HTML
        const albumCoverElement = document.getElementById('album-cover');
        albumCoverElement.src = album.images[0].url;
        albumCoverElement.alt = `Portada del álbum ${album.name}`;

        const albumTitleElement = document.getElementById('album-title');
        albumTitleElement.textContent = album.name;

        const albumArtistElement = document.getElementById('album-artist');
        albumArtistElement.textContent = album.artists.map(artist => artist.name).join(", ");

        const albumDescriptionElement = document.getElementById('album-description');
        albumDescriptionElement.textContent = `Te recomendamos el álbum "${album.name}" de ${album.artists.map(artist => artist.name).join(", ")}, lanzado recientemente y destacado por Spotify.`;

    } catch (error) {
        console.error('Error al obtener el álbum:', error);
    }
}

// Llamar a la función para obtener el álbum recomendado al cargar la página
obtenerAlbumRecomendado();