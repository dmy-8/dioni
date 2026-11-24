import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCustomProgramCover,
  METADATA_URL,
  PLACEHOLDER_COVER,
  STATION_NAME,
  STREAM_URL,
} from '../data/station';

export type PlayerStatus = 'off' | 'load' | 'on';

export interface TrackHistoryItem {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  time: string;
}

export function useRadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastRawRef = useRef<string>('');
  const hasTitleRef = useRef<boolean>(false);
  const coverRequestIdRef = useRef<number>(0);
  const coverAbortRef = useRef<AbortController | null>(null);

  const [status, setStatus] = useState<PlayerStatus>('off');
  const [title, setTitle] = useState<string>(STATION_NAME);
  const [artist, setArtist] = useState<string>('Pulsa play para escuchar');
  const [hasTrackMetadata, setHasTrackMetadata] = useState<boolean>(false);
  const [smallCover, setSmallCover] = useState<string | null>(null);
  const [largeCover, setLargeCover] = useState<string | null>(null);
  const [volume, setVolumeState] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [history, setHistory] = useState<TrackHistoryItem[]>([]);

  const fetchCover = useCallback(
    async (query: string, trackTitle: string, trackArtist: string, requestId: number) => {
      coverAbortRef.current?.abort();
      const controller = new AbortController();
      coverAbortRef.current = controller;

      try {
        const res = await fetch(
          `https://itunes.apple.com/search?media=music&limit=1&term=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (coverRequestIdRef.current !== requestId) return;

        const first = data?.results?.[0];
        if (first?.artworkUrl100) {
          const cover300 = String(first.artworkUrl100).replace('100x100', '300x300');
          const cover600 = String(first.artworkUrl100).replace('100x100', '600x600');
          setSmallCover(cover300);
          setLargeCover(cover600);

          setHistory((prev) =>
            prev.map((item, idx) => (idx === 0 && item.title === trackTitle ? { ...item, coverUrl: cover300 } : item))
          );
        } else {
          setSmallCover(null);
          setLargeCover(null);
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError' || coverRequestIdRef.current !== requestId) {
          return;
        }
        setSmallCover(null);
        setLargeCover(null);
      }

      if (coverRequestIdRef.current !== requestId) return;

      if ('mediaSession' in navigator && window.MediaMetadata) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: trackTitle,
          artist: trackArtist || STATION_NAME,
          album: STATION_NAME,
        });
      }
    },
    []
  );

  const handleStreamTitle = useCallback(
    (rawTitle: string) => {
      const clean = (rawTitle || '').trim();
      if (!clean || clean === lastRawRef.current) return;
      lastRawRef.current = clean;
      hasTitleRef.current = true;
      setHasTrackMetadata(true);

      const requestId = ++coverRequestIdRef.current;

      const sepIndex = clean.indexOf(' - ');
      const nextArtist = sepIndex > 0 ? clean.slice(0, sepIndex) : '';
      const nextTitle = sepIndex > 0 ? clean.slice(sepIndex + 3) : clean;

      setTitle(nextTitle);
      setArtist(nextArtist || STATION_NAME);

      const nowTime = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const customCover =
        getCustomProgramCover(clean) ||
        getCustomProgramCover(nextArtist) ||
        getCustomProgramCover(nextTitle);

      setHistory((prev) => [
        {
          id: `${Date.now()}-${clean}`,
          title: nextTitle,
          artist: nextArtist || STATION_NAME,
          coverUrl: customCover,
          time: nowTime,
        },
        ...prev.slice(0, 11),
      ]);

      if (customCover) {
        coverAbortRef.current?.abort();
        setSmallCover(customCover);
        setLargeCover(customCover);
        if ('mediaSession' in navigator && window.MediaMetadata) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: nextTitle,
            artist: nextArtist || STATION_NAME,
            album: STATION_NAME,
            artwork: [{ src: new URL(customCover, window.location.href).href }],
          });
        }
        return;
      }

      fetchCover(clean, nextTitle, nextArtist, requestId);
    },
    [fetchCover]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.EventSource) return;

    const es = new EventSource(METADATA_URL);
    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const streamText =
          parsed?.streamTitle ||
          [parsed?.artist, parsed?.title].filter(Boolean).join(' - ');
        if (streamText) {
          handleStreamTitle(streamText);
        }
      } catch {
        // Ignore malformed SSE payload
      }
    };

    return () => {
      coverAbortRef.current?.abort();
      es.close();
    };
  }, [handleStreamTitle]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      setStatus('off');
      if (!hasTitleRef.current) {
        setArtist('Pausado');
      }
      return;
    }

    setStatus('load');
    if (!hasTitleRef.current) {
      setArtist('Conectando…');
    }

    audio.src = `${STREAM_URL}?t=${Date.now()}`;
    audio.volume = volume;
    audio.muted = muted;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        setStatus('off');
        if (!hasTitleRef.current) {
          setArtist('No se pudo conectar. Reintenta.');
        }
      });
    }
  }, [muted, volume]);

  const setVolume = useCallback((nextVolume: number) => {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    setVolumeState(clamped);
    setMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  const handlePlaying = useCallback(() => {
    setStatus('on');
    if (!hasTitleRef.current) {
      setArtist('Sonando en vivo');
    }
  }, []);

  const handleWaiting = useCallback(() => {
    setStatus('load');
    if (!hasTitleRef.current) {
      setArtist('Cargando…');
    }
  }, []);

  const handleError = useCallback(() => {
    if (audioRef.current?.getAttribute('src')) {
      setStatus('off');
      if (!hasTitleRef.current) {
        setArtist('Error en la emisión. Reintenta.');
      }
    }
  }, []);

  return {
    audioRef,
    status,
    title,
    artist,
    hasTrackMetadata,
    smallCover,
    largeCover,
    activeBlurCover: largeCover || PLACEHOLDER_COVER,
    volume,
    muted,
    history,
    togglePlay,
    setVolume,
    toggleMute,
    handlePlaying,
    handleWaiting,
    handleError,
  };
}
