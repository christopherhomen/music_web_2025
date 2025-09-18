// ===== NOTICIAS MUSICALES =====

class NewsManager {
    constructor() {
        this.newsGrid = document.getElementById('news-grid');
        this.newsData = [];
        this.init();
    }

    init() {
        // console.log('🎯 NewsManager inicializando...');
        // console.log('📱 NewsGrid encontrado:', this.newsGrid);
        this.loadNews();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Recargar noticias cada 30 minutos
        setInterval(() => {
            this.loadNews();
        }, 30 * 60 * 1000);
    }

    async loadNews() {
        try {
            // console.log('🔄 Iniciando carga de noticias...');
            this.showLoading();
            
            const news = await this.fetchNews();
            // console.log('📰 Noticias obtenidas:', news);
            this.newsData = news;
            this.renderNews();
            
        } catch (error) {
            console.error('❌ Error cargando noticias:', error);
            this.showError();
        }
    }

    async fetchNews() {
        try {
            // console.log('📡 Intentando obtener noticias reales desde APIs...');
            
            // Intentar obtener noticias de APIs
            const apiNews = await this.fetchAPINews();
            
            if (apiNews && apiNews.length > 0) {
                // console.log('✅ Noticias API obtenidas:', apiNews.length);
                
                // Si tenemos menos de 6 noticias API, completar con noticias de ejemplo
                if (apiNews.length < 6) {
                    const fallbackNews = this.getFallbackNews();
                    const mixedNews = [...apiNews, ...fallbackNews.slice(0, 6 - apiNews.length)];
                    // console.log(`🔄 Mezclando ${apiNews.length} noticias API con ${6 - apiNews.length} noticias de ejemplo`);
                    return mixedNews;
                }
                
                return apiNews;
            } else {
                // console.log('⚠️ No se pudieron obtener noticias API, usando fallback');
                return this.getFallbackNews();
            }

        } catch (error) {
            console.error('❌ Error fetching news:', error);
            return this.getFallbackNews();
        }
    }

    async fetchAPINews() {
        try {
            const allNews = [];

            // Intentar Guardian API primero
            try {
                // console.log('🔄 Procesando Guardian API...');
                const guardianNews = await this.fetchGuardianNews();
                allNews.push(...guardianNews);
            } catch (error) {
                console.warn('⚠️ Error con Guardian API:', error);
            }

            // SerpApi temporalmente deshabilitado
            // try {
            //     console.log('🔄 Procesando SerpApi Google News...');
            //     const serpApiData = await this.fetchSerpApiNews();
            //     allNews.push(...serpApiData);
            // } catch (error) {
            //     console.warn('⚠️ Error con SerpApi:', error);
            // }

            // Intentar GNews API (sin problemas de CORS)
            try {
                // console.log('🔄 Procesando GNews API...');
                const gNewsData = await this.fetchGNewsAPI();
                allNews.push(...gNewsData);
            } catch (error) {
                console.warn('⚠️ Error con GNews API:', error);
            }

            // Mezclar y limitar a 9 noticias
            const shuffledNews = this.shuffleArray(allNews);
            return shuffledNews.slice(0, 9).map((news, index) => ({
                ...news,
                id: index + 1
            }));

        } catch (error) {
            console.error('Error fetching API news:', error);
            return [];
        }
    }

    async fetchGuardianNews() {
        try {
            const apiKey = 'af167ce6-39b7-4f20-98f8-c1b62baa6763';
            const baseUrl = 'https://content.guardianapis.com/search';
            
            const params = new URLSearchParams({
                'api-key': apiKey,
                'q': 'pop music OR music news OR music industry OR music charts OR music awards OR music festivals OR music concerts OR music albums OR music singles',
                'section': 'music',
                'page-size': '9',
                'show-fields': 'headline,trailText,thumbnail',
                'order-by': 'newest'
            });

            const response = await fetch(`${baseUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`Guardian API HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.response || !data.response.results) {
                throw new Error('No results from Guardian API');
            }

            const news = data.response.results.map((article, index) => ({
                title: this.truncateTitle(article.webTitle),
                category: this.categorizeNews(article.webTitle, article.fields?.trailText || ''),
                categoryClass: this.getCategoryClass(article.webTitle, article.fields?.trailText || ''),
                author: 'The Guardian',
                date: this.formatGuardianDate(article.webPublicationDate),
                image: article.fields?.thumbnail || this.getDefaultImage(article.webTitle),
                url: article.webUrl,
                originalTitle: article.webTitle,
                originalDescription: article.fields?.trailText || ''
            }));

            // console.log(`✅ Guardian API: ${news.length} noticias musicales encontradas`);
            
            // Traducir títulos al español
            const translatedNews = await this.translateNewsToSpanish(news);
            return translatedNews;

        } catch (error) {
            console.error('Error fetching Guardian news:', error);
            return [];
        }
    }

    async fetchSerpApiNews() {
        try {
            const apiKey = '1c7d255822656c8b026cabba523c6e2fe837d790ee067b5c75f5f1f8b9d1d49b';
            const baseUrl = 'https://serpapi.com/search.json';
            
            const params = new URLSearchParams({
                'engine': 'google',
                'q': 'Taylor Swift OR Britney Spears OR Selena Gomez OR The Weeknd OR Ariana Grande OR Justin Bieber OR Billie Eilish OR Ed Sheeran OR Harry Styles OR Drake OR Kendrick Lamar OR Coldplay OR Arctic Monkeys OR Dua Lipa OR Olivia Rodrigo',
                'tbm': 'nws', // Google News
                'api_key': apiKey,
                'num': '9',
                'gl': 'us', // Estados Unidos
                'hl': 'es' // Español
            });

            const serpApiUrl = `${baseUrl}?${params}`;
            
            // Usar proxy CORS para evitar el bloqueo
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(serpApiUrl)}`;
            
            // console.log('🔗 SerpApi URL (con proxy CORS):', proxyUrl);

            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`Proxy HTTP ${response.status}`);
            }

            const proxyData = await response.json();
            const data = JSON.parse(proxyData.contents);
            
            if (!data.news_results || data.news_results.length === 0) {
                throw new Error('No news results from SerpApi');
            }

            const news = data.news_results.slice(0, 6).map((article, index) => ({
                title: this.truncateTitle(article.title),
                category: this.categorizeNews(article.title, article.snippet || ''),
                categoryClass: this.getCategoryClass(article.title, article.snippet || ''),
                author: article.source || 'Google News',
                date: this.formatDate(article.date),
                image: article.thumbnail || this.getDefaultImage(article.title),
                url: article.link
            }));

            // console.log(`✅ SerpApi Google News: ${news.length} noticias musicales encontradas`);
            return news;

        } catch (error) {
            console.error('Error fetching SerpApi News:', error);
            return [];
        }
    }

    async fetchGNewsAPI() {
        try {
            const apiKey = '43c99074cc7228f148dfb809d25af14c';
            const baseUrl = 'https://gnews.io/api/v4/search';
            
            // Búsqueda específica de música pop
            const params = new URLSearchParams({
                'q': 'music',
                'lang': 'en', // Inglés para mejor cobertura
                'country': 'us', // Estados Unidos
                'max': '9',
                'apikey': apiKey
            });

            const response = await fetch(`${baseUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`GNews API HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.articles || data.articles.length === 0) {
                throw new Error('No articles from GNews API');
            }

            const news = data.articles.slice(0, 9).map((article, index) => ({
                title: this.truncateTitle(article.title),
                category: this.categorizeNews(article.title, article.description || ''),
                categoryClass: this.getCategoryClass(article.title, article.description || ''),
                author: article.source?.name || 'GNews',
                date: this.formatDate(article.publishedAt),
                image: article.image || this.getDefaultImage(article.title),
                url: article.url,
                originalTitle: article.title,
                originalDescription: article.description || ''
            }));

            // console.log(`✅ GNews API: ${news.length} noticias musicales encontradas`);
            
            // Traducir títulos al español
            const translatedNews = await this.translateNewsToSpanish(news);
            return translatedNews;

        } catch (error) {
            console.error('Error fetching GNews API:', error);
            return [];
        }
    }

    async translateNewsToSpanish(news) {
        try {
            // console.log('🔄 Traduciendo noticias al español...');
            
            for (let i = 0; i < news.length; i++) {
                const article = news[i];
                
                // Solo traducir si el título no está en español
                if (!this.isSpanish(article.originalTitle)) {
                    try {
                        const translatedTitle = await this.translateText(article.originalTitle);
                        article.title = this.truncateTitle(translatedTitle);
                        // console.log(`✅ Traducido: "${article.originalTitle}" → "${translatedTitle}"`);
                    } catch (error) {
                        console.warn(`⚠️ Error traduciendo título: ${error.message}`);
                    }
                }
            }
            
            return news;
        } catch (error) {
            console.error('Error traduciendo noticias:', error);
            return news; // Retornar sin traducir si hay error
        }
    }

    async translateText(text) {
        try {
            // Usar Google Translate API gratuita
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`);
            
            if (!response.ok) {
                throw new Error(`Translation API HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                return data[0][0][0];
            } else {
                throw new Error('Invalid translation response');
            }
        } catch (error) {
            console.error('Error translating text:', error);
            return text; // Retornar texto original si falla la traducción
        }
    }

    isSpanish(text) {
        // Detectar si el texto está en español
        const spanishWords = ['música', 'música', 'artista', 'álbum', 'canción', 'concierto', 'festival', 'premio', 'gira', 'single', 'banda', 'cantante'];
        const lowerText = text.toLowerCase();
        return spanishWords.some(word => lowerText.includes(word));
    }

    isMusicRelated(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        const musicKeywords = [
            'música', 'music', 'song', 'canción', 'album', 'álbum',
            'artist', 'artista', 'concert', 'concierto', 'festival',
            'band', 'banda', 'singer', 'cantante', 'guitar', 'guitarra',
            'piano', 'drums', 'batería', 'rock', 'pop', 'jazz',
            'reggaeton', 'hip hop', 'rap', 'country', 'blues',
            'electronic', 'electrónica', 'classical', 'clásica',
            'música latina', 'pop español', 'música urbana', 'música comercial',
            'bad bunny', 'rosalía', 'j balvin', 'karol g', 'maluma',
            'shakira', 'juanes', 'carlos vives', 'fonseca', 'morat',
            'sebastian yatra', 'camilo', 'manuel turizo', 'ozuna',
            'anuel aa', 'daddy yankee', 'don omar', 'wisin y yandel'
        ];
        
        return musicKeywords.some(keyword => text.includes(keyword));
    }

    formatGuardianDate(dateString) {
        try {
            const date = new Date(dateString);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            return 'Hoy';
        }
    }

    formatGuardianDate(dateString) {
        try {
            const date = new Date(dateString);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            return 'Hoy';
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    truncateTitle(title) {
        if (title.length > 80) {
            return title.substring(0, 77) + '...';
        }
        return title;
    }

    categorizeNews(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        
        if (text.includes('concierto') || text.includes('festival') || text.includes('tour')) {
            return 'CONCIERTOS/FESTIVALES';
        } else if (text.includes('álbum') || text.includes('single') || text.includes('disco')) {
            return 'MÚSICA';
        } else if (text.includes('premio') || text.includes('mtv') || text.includes('grammy')) {
            return 'ACTUALIDAD';
        } else if (text.includes('entrevista') || text.includes('charla')) {
            return 'ENTREVISTAS';
        } else {
            return 'MÚSICA';
        }
    }

    getCategoryClass(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        
        if (text.includes('concierto') || text.includes('festival') || text.includes('tour')) {
            return 'conciertos';
        } else if (text.includes('álbum') || text.includes('single') || text.includes('disco')) {
            return 'musica';
        } else if (text.includes('premio') || text.includes('mtv') || text.includes('grammy')) {
            return 'actualidad';
        } else if (text.includes('entrevista') || text.includes('charla')) {
            return 'entrevistas';
        } else {
            return 'musica';
        }
    }

    extractAuthor(sourceName) {
        // Limpiar el nombre de la fuente
        return sourceName ? sourceName.replace(/[^\w\s]/gi, '') : 'Performance Radio';
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                           'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            return 'Hoy';
        }
    }

    getDefaultImage(title) {
        // Imágenes de alta calidad basadas en el contenido
        const text = title.toLowerCase();
        if (text.includes('concierto') || text.includes('festival')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('álbum') || text.includes('single')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('taylor swift')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('britney spears')) {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('selena gomez')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('the weeknd')) {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('ariana grande')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('justin bieber')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('billie eilish')) {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('ed sheeran')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('harry styles')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('drake')) {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('kendrick lamar')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('coldplay')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('arctic monkeys')) {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('dua lipa')) {
            return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80';
        } else if (text.includes('olivia rodrigo')) {
            return 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80';
        } else {
            return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80';
        }
    }

    getFallbackNews() {
        // Noticias de respaldo si la API falla
        return [
            {
                id: 1,
                title: "Taylor Swift anuncia nueva gira mundial 2026",
                category: "CONCIERTOS/FESTIVALES",
                categoryClass: "conciertos",
                author: "Rolling Stone",
                date: "15 Sep 2025",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 2,
                title: "Britney Spears rompe récord de ventas en Spotify",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Billboard",
                date: "14 Sep 2025",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 3,
                title: "Selena Gomez lanza nuevo álbum 'Rare 2.0'",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Universal Music",
                date: "13 Sep 2025",
                image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 4,
                title: "The Weeknd confirma concierto en Colombia 2026",
                category: "CONCIERTOS/FESTIVALES",
                categoryClass: "festivales",
                author: "El Tiempo",
                date: "12 Sep 2025",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 5,
                title: "Ariana Grande colabora con Justin Bieber en nuevo single",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Billboard",
                date: "11 Sep 2025",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 6,
                title: "Billie Eilish gana Grammy al Mejor Álbum del Año",
                category: "ACTUALIDAD",
                categoryClass: "actualidad",
                author: "Grammy.com",
                date: "10 Sep 2025",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 7,
                title: "Ed Sheeran lanza nuevo single 'Perfect 2.0'",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Universal Music",
                date: "9 Sep 2025",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 8,
                title: "Harry Styles confirma nuevo álbum para 2026",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Rolling Stone",
                date: "8 Sep 2025",
                image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop&q=80",
                url: "#"
            },
            {
                id: 9,
                title: "Drake rompe récord de streams en Apple Music",
                category: "MÚSICA",
                categoryClass: "musica",
                author: "Billboard",
                date: "7 Sep 2025",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop&q=80",
                url: "#"
            }
        ];
    }

    showLoading() {
        // console.log('⏳ Mostrando estado de carga...');
        if (!this.newsGrid) {
            console.error('❌ newsGrid no encontrado!');
            return;
        }
        this.newsGrid.innerHTML = `
            <div class="news-loading">
                <div>
                    <i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i>
                    Cargando noticias...
                </div>
            </div>
        `;
    }

    showError() {
        this.newsGrid.innerHTML = `
            <div class="news-error">
                <i class="fas fa-exclamation-triangle" style="font-size: 2em; margin-bottom: 15px; color: #ff6b6b;"></i>
                <h3>Error al cargar noticias</h3>
                <p>No se pudieron cargar las noticias en este momento. Esto puede deberse a:</p>
                <ul style="text-align: left; margin: 15px 0; color: rgba(255, 255, 255, 0.8);">
                    <li>Problemas de conexión a internet</li>
                    <li>Límites de la API de noticias</li>
                    <li>Servicio temporalmente no disponible</li>
                </ul>
                <button onclick="newsManager.loadNews()" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 15px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
                    🔄 Reintentar
                </button>
                <button onclick="newsManager.showFallbackNews()" style="
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-top: 10px;
                    margin-left: 10px;
                    transition: all 0.3s ease;
                    font-size: 0.9em;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.05)'">
                    📰 Ver noticias de ejemplo
                </button>
            </div>
        `;
    }

    showFallbackNews() {
        const fallbackNews = this.getFallbackNews();
        this.newsData = fallbackNews;
        this.renderNews();
    }

    renderNews() {
        // console.log('🎨 Renderizando noticias...');
        // console.log('📊 Datos de noticias:', this.newsData);
        
        if (!this.newsGrid) {
            console.error('❌ newsGrid no encontrado en renderNews!');
            return;
        }
        
        if (!this.newsData || this.newsData.length === 0) {
            // console.log('⚠️ No hay datos de noticias, mostrando error');
            this.showError();
            return;
        }

        // Agregar indicador de fuente de noticias
        const isRealNews = this.newsData.some(news => news.author !== 'Performance Radio');
        const sourceIndicator = isRealNews ? 
            '<div class="news-source-indicator">📡 Noticias en tiempo real - Lo último en música y entretenimiento</div>' : 
            '<div class="news-source-indicator">📰 Noticias de ejemplo</div>';

        const newsHTML = this.newsData.map((news, index) => `
            <div class="news-card" onclick="newsManager.openNews('${news.url}')" style="animation-delay: ${index * 0.1}s">
                <img src="${news.image}" alt="${news.title}" class="news-card-image" loading="lazy">
                <div class="news-card-content">
                    <span class="news-card-category ${news.categoryClass}">${news.category}</span>
                    <h3 class="news-card-title">${news.title}</h3>
                    <div class="news-card-meta">
                        <span class="news-card-author">Redacción: ${news.author}</span>
                        <span class="news-card-date">${news.date}</span>
                    </div>
                </div>
                <div class="news-card-arrow"></div>
            </div>
        `).join('');

        // console.log('✅ HTML generado:', sourceIndicator + newsHTML);
        this.newsGrid.innerHTML = sourceIndicator + newsHTML;
        // console.log('🎯 Noticias renderizadas exitosamente');
    }

    openNews(url) {
        if (url && url !== '#') {
            window.open(url, '_blank');
        } else {
            // Simular apertura de noticia
            // console.log('Abriendo noticia...');
            // Aquí podrías mostrar un modal o redirigir a una página de noticia
        }
    }

    // Método para actualizar noticias manualmente
    refreshNews() {
        this.loadNews();
    }

    // Método para obtener noticias específicas por categoría
    getNewsByCategory(category) {
        return this.newsData.filter(news => 
            news.category.toLowerCase().includes(category.toLowerCase())
        );
    }
}

// Inicializar el gestor de noticias cuando el DOM esté listo
let newsManager;

document.addEventListener('DOMContentLoaded', () => {
    // console.log('🚀 DOM cargado, inicializando NewsManager...');
    newsManager = new NewsManager();
    // console.log('✅ NewsManager inicializado:', newsManager);
});

// Función global para recargar noticias (útil para debugging)
window.refreshNews = () => {
    // console.log('🔄 Recargando noticias manualmente...');
    if (newsManager) {
        newsManager.refreshNews();
    } else {
        console.error('❌ NewsManager no está inicializado');
    }
};

// Función global para forzar noticias en español
window.loadSpanishNews = () => {
    // console.log('🇪🇸 Cargando noticias en español...');
    if (newsManager) {
        newsManager.loadNews();
    } else {
        console.error('❌ NewsManager no está inicializado');
    }
};

// Función global para debug
window.debugNews = () => {
    // console.log('🔍 Debug NewsManager:');
    // console.log('- newsManager:', newsManager);
    // console.log('- newsGrid:', document.getElementById('news-grid'));
    // console.log('- newsData:', newsManager ? newsManager.newsData : 'No inicializado');
};
