const zeroPad = (n: number | string) => String(n).padStart(2, "0");

export function toHour(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
}

export function toHourMinutes(minutes: number): string[] {
  return [zeroPad(Math.floor(minutes / 60)), zeroPad(minutes % 60)];
}

export const timeDate = (time: string) => new Date(`1970-01-01T${time}`);

export const toTimeString = (date: Date) =>
  `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

/**
 * Convert minutes since midnight to time string (HH:MM)
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}min`
  }

  if (mins === 0) {
    return `${hours}h`
  }

  return `${hours}h ${mins}min`
}

/**
 * Get weekday name
 */
export const getWeekdayName = (
  dayIndex: number,
  locale: 'es' | 'en' | 'cat' = 'es',
  short: boolean = false
): string => {
  const weekdays = {
    es: {
      full: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      short: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    },
    en: {
      full: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    cat: {
      full: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
      short: ['Dll', 'Dmt', 'Dmc', 'Dij', 'Div', 'Dis', 'Diu'],
    },
  }

  const days = short ? weekdays[locale].short : weekdays[locale].full
  return days[dayIndex] || ''
}

/**
 * Format weekdays array to string
 */
export const formatWeekdays = (
  weekdays: number[],
  locale: 'es' | 'en' | 'cat' = 'es',
  short: boolean = true
): string => {
  return weekdays
    .sort((a, b) => a - b)
    .map((day) => getWeekdayName(day, locale, short))
    .join(', ')
}

/**
 * Check if a time range overlaps with another
 */
export const timeRangesOverlap = (
  start1: number,
  duration1: number,
  start2: number,
  duration2: number
): boolean => {
  const end1 = start1 + duration1
  const end2 = start2 + duration2

  return start1 < end2 && start2 < end1
}

/**
 * Get time range string
 */
export const getTimeRange = (starttime: number, duration: number): string => {
  const start = minutesToTime(starttime)
  const end = minutesToTime(starttime + duration)
  return `${start} - ${end}`
}
