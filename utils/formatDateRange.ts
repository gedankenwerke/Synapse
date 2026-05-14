/** Format a date as the start of day in local time, returned as an ISO-8601 UTC string. */
export function formatStartDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).toISOString();
}

/** Format a date as the end of day in local time, returned as an ISO-8601 UTC string. */
export function formatEndDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString();
}