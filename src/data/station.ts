export const STREAM_ID = 'z97828369f0uv';
export const STREAM_URL = `https://stream.zeno.fm/${STREAM_ID}`;
export const METADATA_URL = `https://api.zeno.fm/mounts/metadata/subscribe/${STREAM_ID}`;
export const FACEBOOK_URL = 'https://www.facebook.com/share/1d5UDDGCtd/';

export const STATION_NAME = 'ALTA ENERGÍA 107.5';
export const DOWNLOAD_HTML_PATH = '/alta-energia-107.5.html';

// Attached AE RADIO logo used as default / fallback cover artwork
export const PLACEHOLDER_COVER = '/assets/aistudio/zX8q4to_1baeb0a3.png';

// Custom show artwork when metadata matches MAQUINA MUSICAL - EN VIVO - 11:00AM - 21:00PM
export const MAQUINA_MUSICAL_COVER = '/assets/aistudio/MAQUINA-MUSICAL_4fa894be.webp';

// Custom show artwork when metadata contains Generación 90s
export const GENERACION_90S_COVER = '/assets/aistudio/Generaci_n-90s_70bafc1c.webp';

// Custom artwork when metadata contains ALTA ENERGÍA 107.5 - La Paz - Bolivia
export const ALTA_ENERGIA_LPZ_COVER = '/assets/aistudio/A.E.RADIO_99202ff8.webp';

// Custom show artwork when metadata contains PISTA TRAS PISTA
export const PISTA_TRAS_PISTA_COVER = '/assets/aistudio/PISTA-TRAS-PISTA-_d8be9f54.webp';

export function getCustomProgramCover(rawTitle: string): string | null {
  const normalized = (rawTitle || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (
    normalized === 'MAQUINA MUSICAL - EN VIVO - 11:00AM - 21:00PM' ||
    normalized === 'MAQUINA MUSICAL - EN VIVO - 11:00 AM - 21:00 PM' ||
    (normalized.includes('MAQUINA MUSICAL') &&
      normalized.includes('EN VIVO') &&
      normalized.includes('11:00') &&
      normalized.includes('21:00'))
  ) {
    return MAQUINA_MUSICAL_COVER;
  }

  const compact = normalized.replace(/['’`]/g, '');
  if (compact.includes('GENERACION 90S') || compact.includes('GENERACION 90 S')) {
    return GENERACION_90S_COVER;
  }

  const dashNormalized = normalized.replace(/\s*[–—-]\s*/g, ' - ');
  if (dashNormalized.includes('ALTA ENERGIA 107.5 - LA PAZ - BOLIVIA')) {
    return ALTA_ENERGIA_LPZ_COVER;
  }

  const spaceNormalized = normalized.replace(/[-_–—]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (spaceNormalized.includes('PISTA TRAS PISTA')) {
    return PISTA_TRAS_PISTA_COVER;
  }

  return null;
}

export interface ScheduleProgram {
  id: string;
  title: string;
  host: string;
  timeRange: string;
  period: 'mañana' | 'tarde' | 'noche';
  days: string;
}

export const SCHEDULE_PROGRAMS: ScheduleProgram[] = [
  {
    id: 'despertar',
    title: 'Despertar Alta Energía 107.5',
    host: 'Conducción en vivo',
    timeRange: '06:00 – 11:00',
    period: 'mañana',
    days: 'Lunes a Viernes',
  },
  {
    id: 'pulso-diario',
    title: 'Máquina Musical',
    host: 'Selección Continua',
    timeRange: '11:00 – 12:00',
    period: 'mañana',
    days: 'Todos los días',
  },
  {
    id: 'energia-urbana',
    title: 'Clásicos De La Hora Retro',
    host: 'Selección Continua',
    timeRange: '12:00 – 14:00',
    period: 'tarde',
    days: 'Todos los días',
  },
  {
    id: 'ruta-107',
    title: 'Electro Dance',
    host: 'Éxitos del Momento',
    timeRange: '14:00 – 16:00',
    period: 'tarde',
    days: 'Todos los días',
  },
  {
    id: 'sesion-nocturna',
    title: 'Pista Tras Pista',
    host: 'Dream Dance & Future Trance',
    timeRange: '16:00 – 18:00',
    period: 'tarde',
    days: 'Todos los días',
  },
  {
    id: 'frecuencia-cero',
    title: 'Clásicos De La Hora Retro',
    host: 'Selección Continua',
    timeRange: '18:00 – 20:00',
    period: 'noche',
    days: 'Todos los días',
  },
  {
    id: 'maquina-musical-noche',
    title: 'Máquina Musical',
    host: 'Selección Continua',
    timeRange: '21:00 – 23:00',
    period: 'noche',
    days: 'Todos los días',
  },
  {
    id: 'alta-energia-noche',
    title: 'Alta Energía 107.5',
    host: 'Conducción en vivo',
    timeRange: '23:00',
    period: 'noche',
    days: 'Lunes a Viernes',
  },
];
