# Configuración de variables de entorno (Vite)

Crea un archivo `.env` en la carpeta `frontend/` con este contenido si deseas activar el polling de metadatos del stream en el reproductor:

```bash
VITE_STREAM_META_URL=https://tuservidor.com/nowplaying.json
```

Formato esperado de la respuesta JSON:

```json
{ "title": "Artista - Título", "artwork": "https://.../imagen.jpg" }
```

- Si no defines `VITE_STREAM_META_URL`, el reproductor mostrará "Performance Radio" y usará la imagen por defecto.
- El polling se ejecuta cada 15 segundos y limpia el texto para remover valores desconocidos.
