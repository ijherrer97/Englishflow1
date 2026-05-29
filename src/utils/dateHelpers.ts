const formatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

export function toDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDisplayDate(dateKey: string): string {
  return formatter.format(new Date(`${dateKey}T12:00:00`));
}

export function getLastNDays(count: number, endDate = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => toDateKey(addDays(endDate, index - count + 1)));
}

export function isSameMonth(dateKey: string, date = new Date()): boolean {
  const value = new Date(`${dateKey}T12:00:00`);
  return value.getMonth() === date.getMonth() && value.getFullYear() === date.getFullYear();
}

export function sortByDateDesc<T extends { date?: string; dateAdded?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (b.date ?? b.dateAdded ?? '').localeCompare(a.date ?? a.dateAdded ?? ''));
}

export function getWeekRange(date = new Date()): string[] {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(date, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => toDateKey(addDays(monday, index)));
}
