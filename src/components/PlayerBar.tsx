import type { RefObject } from 'react';
import { Loader2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { FACEBOOK_URL, PLACEHOLDER_COVER } from '../data/station';
import type { PlayerStatus } from '../hooks/useRadioPlayer';

interface PlayerBarProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  status: PlayerStatus;
  title: string;
  artist: string;
  smallCover: string | null;
  volume: number;
  muted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onPlaying: () => void;
  onWaiting: () => void;
  onError: () => void;
}

export function PlayerBar({
  audioRef,
  status,
  title,
  artist,
  smallCover,
  volume,
  muted,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onPlaying,
  onWaiting,
  onError,
}: PlayerBarProps) {
  const thumbSrc = smallCover || PLACEHOLDER_COVER;

  return (
    <div
      id="rp-bar"
      role="region"
      aria-label="Reproductor de radio"
      className={`fixed left-0 right-0 bottom-0 z-50 bg-black text-white border-t border-white/90 shadow-[0_-8px_30px_rgba(0,0,0,0.45)] ${
        status === 'on' ? 'rp-playing' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 md:h-[74px] px-3 sm:px-6 flex items-center gap-3 md:gap-4">
        {/* Mini Cover Thumbnail */}
        <img
          id="rp-cover"
          src={thumbSrc}
          alt={smallCover ? `Carátula de ${title}` : 'ALTA ENERGÍA 107.5'}
          referrerPolicy="no-referrer"
          className="w-11 h-11 md:w-[52px] md:h-[52px] aspect-square object-contain rounded-lg border border-white/80 shrink-0 bg-black"
        />

        {/* Track Information */}
        <div className="flex flex-col min-w-0 flex-1 leading-snug">
          <span className="font-display font-bold text-[10px] md:text-[11px] tracking-[0.14em] text-neutral-300 flex items-center gap-1.5 whitespace-nowrap">
            {status === 'on' && (
              <span
                className="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"
                aria-hidden="true"
              />
            )}
            <span className="truncate">EN VIVO · ALTA ENERGÍA 107.5</span>
          </span>
          <span
            id="rp-title"
            className="font-display font-extrabold text-sm md:text-base text-white truncate"
          >
            {title}
          </span>
          <span id="rp-artist" className="text-xs md:text-[13px] text-neutral-300 truncate">
            {artist}
          </span>
        </div>

        {/* Equalizer (Desktop / Tablet) */}
        <div className="hidden md:flex items-end gap-1 h-6 shrink-0" aria-hidden="true">
          <span className="rp-eq-bar w-1 h-6 bg-white rounded-xs" />
          <span className="rp-eq-bar w-1 h-6 bg-white rounded-xs" />
          <span className="rp-eq-bar w-1 h-6 bg-white rounded-xs" />
          <span className="rp-eq-bar w-1 h-6 bg-white rounded-xs" />
          <span className="rp-eq-bar w-1 h-6 bg-white rounded-xs" />
        </div>

        {/* Play / Pause Button */}
        <button
          id="rp-play"
          type="button"
          onClick={onTogglePlay}
          aria-label={status === 'on' ? 'Pausar' : 'Reproducir'}
          className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-white text-black grid place-items-center shrink-0 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {status === 'load' ? (
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
          ) : status === 'on' ? (
            <Pause className="w-6 h-6 fill-current" aria-hidden="true" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" aria-hidden="true" />
          )}
        </button>

        {/* Volume Controls (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <button
            id="rp-mute"
            type="button"
            onClick={onToggleMute}
            aria-label={muted || volume === 0 ? 'Activar sonido' : 'Silenciar'}
            className="w-10 h-10 grid place-items-center text-white hover:text-neutral-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white rounded-lg"
          >
            {muted || volume === 0 ? (
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          <input
            id="rp-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            aria-label="Volumen"
            className="w-24 accent-white cursor-pointer"
          />
        </div>

        {/* Facebook Share Button */}
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook de ALTA ENERGÍA 107.5"
          className="w-11 h-11 md:w-10 md:h-10 rounded-full grid place-items-center text-white bg-black border-2 border-white hover:bg-white hover:text-black transition-colors duration-150 shrink-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M14 8V6c0-.9.6-1 1-1h2V1.5h-3C10.8 1.5 10 3.9 10 5.6V8H7.5v3.5H10V22h4V11.5h3l.5-3.5H14z"
            />
          </svg>
        </a>
      </div>

      <footer className="border-t border-white/10 bg-neutral-950 px-3 sm:px-6 py-1.5 text-center">
        <p className="font-display text-[11px] sm:text-xs font-medium text-neutral-400 tracking-wide">
          © Alta Energía - La Paz - Bolivia 2026
        </p>
      </footer>

      <audio
        ref={audioRef}
        id="rp-audio"
        preload="none"
        onPlaying={onPlaying}
        onWaiting={onWaiting}
        onError={onError}
      />
    </div>
  );
}
