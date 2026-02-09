/**
 * Validates and parses a date string in YYYY-MM-DD format.
 * Returns the normalized string or throws with a friendly error.
 */
const YYYY_MM_DD = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function validateDate(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (!YYYY_MM_DD.test(trimmed)) {
    throw new Error(`Invalid date "${dateStr}". Use YYYY-MM-DD (e.g. 2026-02-09).`);
  }
  const [y, m, d] = trimmed.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    throw new Error(`Invalid date "${dateStr}" (e.g. 2026-02-30 is invalid).`);
  }
  return trimmed;
}

export function todayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function timeStamp(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}
