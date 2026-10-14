export function formatARS(n: number): string {
  const formatted = n.toLocaleString('de-DE');
  return `$ ${formatted}`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const hours = Math.floor(min / 60);
  const remainingMin = min % 60;
  
  if (remainingMin === 0) return `${hours} h`;
  return `${hours} h ${remainingMin} min`;
}
