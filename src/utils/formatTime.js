import { format, getTime, formatDistanceToNow, parseISO } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'M/d/yyyy';

  return date ? format((new Date(date)), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'M/d/yyyy p';

  return date ? format((new Date(date)), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime((new Date(date))) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow((new Date(date)), {
      addSuffix: true,
    })
    : '';
}
