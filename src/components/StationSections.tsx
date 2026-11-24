import { useState } from 'react';
import { Radio } from 'lucide-react';
import { PLACEHOLDER_COVER, SCHEDULE_PROGRAMS } from '../data/station';
import type { TrackHistoryItem } from '../hooks/useRadioPlayer';

interface StationSectionsProps {
  history: TrackHistoryItem[];
}

type PeriodFilter = 'todos' | 'mañana' | 'tarde' | 'noche';

const FILTER_OPTIONS: { id: PeriodFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'mañana', label: 'Mañana' },
  { id: 'tarde', label: 'Tarde' },
  { id: 'noche', label: 'Noche' },
];

export function StationSections({ history }: StationSectionsProps) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('todos');

  const visiblePrograms =
    periodFilter === 'todos'
      ? SCHEDULE_PROGRAMS
      : SCHEDULE_PROGRAMS.filter((p) => p.period === periodFilter);

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-28 md:pb-32 space-y-16 md:space-y-20">
      {/* Programación Diaria */}
      <section id="programacion" aria-labelledby="heading-programacion" className="scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/10 pb-4 mb-6">
          <div>
            <h2
              id="heading-programacion"
              className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-neutral-950"
            >
              Programación
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Horarios de emisión continua en 107.5 FM.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filtrar programación por horario"
            className="inline-flex items-center gap-1 p-1 bg-black/5 rounded-xl self-start sm:self-auto"
          >
            {FILTER_OPTIONS.map((opt) => {
              const active = periodFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPeriodFilter(opt.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePrograms.map((program) => (
            <article
              key={program.id}
              className="rounded-2xl bg-white/75 backdrop-blur-md border border-black/10 p-5 flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-mono tabular-nums font-medium text-neutral-800">
                    {program.timeRange}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{program.days}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-950">
                  {program.title}
                </h3>
              </div>
              <p className="text-sm text-neutral-600">{program.host}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Historial en Vivo */}
      <section id="recientes" aria-labelledby="heading-recientes" className="scroll-mt-20">
        <div className="border-b border-black/10 pb-4 mb-6">
          <h2
            id="heading-recientes"
            className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-neutral-950"
          >
            Historial en Vivo
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Canciones detectadas durante tu sesión de escucha.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 p-8 text-center flex flex-col items-center gap-2">
            <Radio className="w-6 h-6 text-neutral-500" aria-hidden="true" />
            <p className="text-sm font-medium text-neutral-800">
              Esperando actualizaciones de la emisión en vivo
            </p>
            <p className="text-xs text-neutral-500 max-w-md">
              Las canciones aparecerán aquí automáticamente conforme se transmitan en la señal de ALTA ENERGÍA 107.5.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/75 backdrop-blur-md border border-black/10 divide-y divide-black/10 overflow-hidden">
            {history.map((item) => (
              <div
                key={item.id}
                className="px-4 sm:px-5 py-3.5 flex items-center gap-3.5"
              >
                <img
                  src={item.coverUrl || PLACEHOLDER_COVER}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 aspect-square object-contain rounded-lg border border-black/10 shrink-0 bg-black"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-sm text-neutral-950 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">{item.artist}</p>
                </div>
                <span className="font-mono tabular-nums text-xs text-neutral-500 shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
