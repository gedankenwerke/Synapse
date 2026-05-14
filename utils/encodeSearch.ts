/** Encode a search string for use as a cursor parameter, safe for Thai/Unicode. */
export function encodeSearch(value: string): string {
  return btoa(unescape(encodeURIComponent(value.trim())));
}