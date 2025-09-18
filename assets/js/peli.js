
        const apiKey = '83ab677dd66abff188f6d60a21902fae'; // Tu clave de API de TMDb
        const apiUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey + '&sort_by=popularity.desc&language=es';

        async function obtenerPeliculaRecomendada() {
            try {
                // Realizar la solicitud a la API de TMDb
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4M2FiNjc3ZGQ2NmFiZmYxODhmNmQ2MGEyMTkwMmZhZSIsIm5iZiI6MTcyOTQ3MTIwNS4zMjY1NjUsInN1YiI6IjY3MTVhMWJjY2VmMTQ2MjhmZWY2MDRmNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XxskF6w9z63KWR36e4wz9-SflaTcPsm--BCitSQY178'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener la película');
                }

                const data = await response.json();
                // Obtener una película aleatoria de los resultados
                const peliculas = data.results;
                const peliculaAleatoria = peliculas[Math.floor(Math.random() * peliculas.length)];

                // Obtener los elementos del DOM
                const movieContainer = document.getElementById('movie-container');
                const movieTitle = document.getElementById('movie-title');
                const movieOverview = document.getElementById('movie-overview');

                // Actualizar los elementos del DOM con la información de la película
                movieContainer.style.backgroundImage = 'url(https://image.tmdb.org/t/p/w1280' + peliculaAleatoria.backdrop_path + ')'; // URL de la imagen de fondo
                movieTitle.textContent = peliculaAleatoria.title; // Título de la película
                
                // Aplicar estilo según el género de la película
                aplicarEstiloGenero(movieTitle, peliculaAleatoria.genre_ids);
                
                // Truncar la descripción para que se ajuste a máximo 2 líneas (aproximadamente 150 caracteres)
                let overview = peliculaAleatoria.overview;
                if (overview.length > 150) {
                    overview = overview.substring(0, 150).trim() + '...';
                }
                movieOverview.textContent = overview; // Resumen de la película truncado

            } catch (error) {
                console.error('Hubo un error:', error);
            }
        }

        // Función para aplicar estilo según el género
        function aplicarEstiloGenero(movieTitleElement, genreIds) {
            // Mapeo de IDs de géneros de TMDb a clases CSS
            const generoMap = {
                28: 'action',      // Acción
                12: 'action',      // Aventura
                16: 'comedy',      // Animación
                35: 'comedy',      // Comedia
                80: 'thriller',    // Crimen
                99: 'drama',       // Documental
                18: 'drama',       // Drama
                10751: 'comedy',   // Familia
                14: 'sci-fi',      // Fantasía
                36: 'drama',       // Historia
                27: 'horror',      // Terror
                10402: 'drama',    // Música
                9648: 'thriller',  // Misterio
                10749: 'drama',    // Romance
                878: 'sci-fi',     // Ciencia ficción
                10770: 'drama',    // Película de TV
                53: 'thriller',    // Suspense
                10752: 'action',   // Guerra
                37: 'drama'        // Western
            };
            
            // Limpiar clases anteriores pero mantener movie-title
            movieTitleElement.className = 'movie-title';
            
            // Aplicar clase según el primer género
            if (genreIds && genreIds.length > 0) {
                const primerGenero = genreIds[0];
                const claseGenero = generoMap[primerGenero] || 'drama'; // Por defecto drama
                movieTitleElement.classList.add(claseGenero);
            } else {
                movieTitleElement.classList.add('drama'); // Por defecto drama
            }
        }

        // Función para el botón "Ver Ahora"
        function acquireMovie() {
            const movieTitle = document.getElementById('movie-title').textContent;
            // Abrir el enlace de WhatsApp de pelipup en una nueva pestaña
            window.open('https://wa.link/7kljru', '_blank');
        }

        // Llamar a la función para obtener la película recomendada
        obtenerPeliculaRecomendada();
