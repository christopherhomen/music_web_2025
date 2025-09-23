import { useEffect, useRef, useState } from 'react'
import './FixedPlayer.css'

const STREAM_URL = 'https://cp9.serverse.com/proxy/perfor?mp=/stream;'

type StreamMeta = {
  text: string
  artwork?: string | null
}

function normalize(input: string): string{
  return (input || '')
    .normalize('NFD')
    .replace(/[^\p{L}\p{N}\s\-–—:|]/gu, '')
    .toLowerCase()
    .trim()
}

function cleanMeta(raw: string): string{
  const BAD = [
    'intérprete desconocido','interprete desconocido','artista desconocido','desconocido','unknown artist','unknown','n/a'
  ].map(normalize)
  const parts = (raw || '').split(/\s*[-–—:|]\s*/).filter(Boolean)
  const filtered = parts.filter(p => !BAD.includes(normalize(p)))
  const out = filtered.join(' - ').trim()
  return out || 'Performance Radio'
}

export default function FixedPlayer(){
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [meta, setMeta] = useState<StreamMeta>({ text: 'Performance Radio', artwork: null })

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (audio.paused) {
        await audio.play()
        setIsPlaying(true)
      } else {
        audio.pause()
        setIsPlaying(false)
      }
    } catch (e) {
      console.error('Error reproduciendo stream:', e)
    }
  }

  useEffect(() => {
    // Poll opcional: configurar VITE_STREAM_META_URL apuntando a un JSON con { title, artist?, artwork? }
    const metaUrl = import.meta.env.VITE_STREAM_META_URL as string | undefined
    if (!metaUrl) return

    let cancelled = false
    const fetchMeta = async () => {
      try{
        const url = metaUrl.includes('?') ? `${metaUrl}&_=${Date.now()}` : `${metaUrl}?_=${Date.now()}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json().catch(() => null)
        if (!data) return
        // Campos comunes: title | song | now_playing | streamTitle
        const raw = data.title || data.song || data.now_playing || data.streamTitle || ''
        const text = cleanMeta(String(raw))
        const artwork = data.artwork || data.image || null
        if (!cancelled) setMeta({ text, artwork })
      }catch(_){ /* noop */ }
    }

    fetchMeta()
    const id = setInterval(fetchMeta, 15000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return (
    <div className="fixed-player">
      <div className="player">
        <div className="left">
          <img src={meta.artwork || '/assets/img/locutor/default.JPG'} alt="Portada" className="cover" />
          <div className="meta">
            <h2>{meta.text}</h2>
            <p>{isPlaying ? 'Al aire' : 'Pausado'}</p>
          </div>
        </div>
        <div className="center">
          <button className="play" onClick={togglePlay} aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
            {isPlaying ? '❚❚' : '►'}
          </button>
        </div>
        <div className="right">
          <img src="/assets/img/logo/logo1.png" alt="Logo" className="brand" />
        </div>
        <audio ref={audioRef} preload="none" crossOrigin="anonymous">
          <source src={STREAM_URL} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  )
}


