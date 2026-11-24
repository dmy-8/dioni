import { Pause, Play } from 'lucide-react';
import { FACEBOOK_URL, PLACEHOLDER_COVER } from '../data/station';
import type { PlayerStatus } from '../hooks/useRadioPlayer';

interface HeroCoverStageProps {
  status: PlayerStatus;
  title: string;
  artist: string;
  largeCover: string | null;
  onTogglePlay: () => void;
}

export function HeroCoverStage({
  status,
  title,
  artist,
  largeCover,
  onTogglePlay,
}: HeroCoverStageProps) {
  const displayCover = largeCover || PLACEHOLDER_COVER;

  return (
    <section
      id="en-vivo"
      aria-label="Emisión en vivo"
      className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-7 pb-10 md:pb-14 flex flex-col items-center text-center"
    >
      {/* Centered & Elevated Large Cover Art — strictly 1:1 square and responsive on mobile & desktop */}
      <div
        id="rp-bigwrap"
        className="relative mx-auto mt-1 sm:mt-2 mb-6 sm:mb-8 w-[min(68vw,38dvh,260px)] h-[min(68vw,38dvh,260px)] sm:w-[min(58vw,42dvh,300px)] sm:h-[min(58vw,42dvh,300px)] md:w-[min(46vw,44dvh,325px)] md:h-[min(46vw,44dvh,325px)] lg:w-[min(40vw,46dvh,340px)] lg:h-[min(40vw,46dvh,340px)] aspect-square shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Soft ambient aura directly behind the centered cover */}
        <img
          id="rp-blur"
          src={displayCover}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="absolute -inset-6 sm:-inset-9 w-[calc(100%+3rem)] sm:w-[calc(100%+4.5rem)] h-[calc(100%+3rem)] sm:h-[calc(100%+4.5rem)] object-cover rounded-3xl blur-2xl saturate-150 opacity-60 scale-105 pointer-events-none transition-all duration-700 ease-out"
        />

        {/* Glass halo rim */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 sm:-inset-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 pointer-events-none transition-opacity duration-500"
        />

        {/* Primary Cover Container */}
        <div
          className={`relative z-10 w-full h-full aspect-square rounded-xl overflow-hidden bg-black border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.38)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            status === 'on' ? 'scale-[1.02]' : 'scale-100'
          }`}
        >
          <img
            src={displayCover}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-45 pointer-events-none"
          />
          <img
            key={displayCover}
            id="rp-big"
            src={displayCover}
            alt={largeCover ? `Carátula de ${title}` : 'ALTA ENERGÍA 107.5'}
            referrerPolicy="no-referrer"
            className="rp-cover-animate relative z-10 w-full h-full object-contain block"
          />
        </div>
      </div>

      {/* Clean unboxed track readout below the centered cover */}
      <div className="max-w-xl w-full flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600">
          {status === 'on' && (
            <span
              className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse"
              aria-hidden="true"
            />
          )}
          <span>{status === 'on' ? 'Transmitiendo en vivo' : 'Señal Digital'}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">107.5 FM</span>
        </div>

        <h1
          className="font-display font-extrabold text-[clamp(1.375rem,3vw,2.125rem)] leading-tight tracking-tight text-neutral-950"
          style={{ textWrap: 'balance' }}
        >
          {title}
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 max-w-md truncate">
          {artist}
        </p>

        {/* Primary Play/Pause & Share Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-neutral-950 text-white text-sm font-semibold inline-flex items-center gap-2.5 hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {status === 'on' ? (
              <>
                <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Pausar emisión</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>{status === 'load' ? 'Conectando…' : 'Escuchar en vivo'}</span>
              </>
            )}
          </button>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white text-neutral-900 border border-black/15 text-sm font-medium inline-flex items-center gap-2 transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <span>Facebook Oficial</span>
          </a>
        </div>
      </div>
    </section>
  );
}
