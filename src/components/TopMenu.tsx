import { useState } from 'react';
import { Menu, Pause, Play, X } from 'lucide-react';
import type { PlayerStatus } from '../hooks/useRadioPlayer';

interface TopMenuProps {
  status: PlayerStatus;
  onTogglePlay: () => void;
}

const NAV_LINKS = [
  { href: '#en-vivo', label: 'En Vivo' },
  { href: '#programacion', label: 'Programación' },
  { href: '#recientes', label: 'Historial' },
];

export function TopMenu({ status, onTogglePlay }: TopMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f2f2f2]/90 backdrop-blur-md border-b border-black/10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-13 md:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <a
          href="#en-vivo"
          className="font-display font-extrabold text-sm sm:text-base tracking-tight text-neutral-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          ALTA ENERGÍA 107.5
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav aria-label="Menú principal" className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-950 underline-offset-4 hover:underline transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-950 text-white text-xs font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {status === 'on' ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>{status === 'load' ? 'Conectando' : 'Escuchar'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-neutral-950 hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Menú móvil"
          className="md:hidden bg-[#f2f2f2]/95 backdrop-blur-md border-t border-black/10 px-4 py-3 flex flex-col gap-1"
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] px-3 flex items-center text-sm font-medium text-neutral-800 hover:bg-black/5 rounded-lg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
