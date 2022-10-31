export function getISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getISOTimeString(date: Date): string {
  return date.toISOString().slice(11, 16);
}
