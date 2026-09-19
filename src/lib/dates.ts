// Everything about "what day is it" lives here.
//
// The server runs in UTC. If Mom in Chicago taps her button at 8pm Tuesday,
// that is 1am WEDNESDAY in UTC. Filing it under the wrong day would make the
// dashboard show a false "no check-in today" the next morning. So every date
// in this app is computed in the family's own timezone.

/** Today's date in `timezone`, as "YYYY-MM-DD". */
export function todayIn(timezone: string): string {
  // The en-CA locale formats dates as YYYY-MM-DD, which is exactly the format
  // Postgres wants for a `date` column. No date library needed.
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(
    new Date(),
  );
}

/** The last `days` dates in `timezone`, newest first, as "YYYY-MM-DD". */
export function recentDates(timezone: string, days: number): string[] {
  // Start from today in the family's timezone, then step back in whole
  // calendar days using plain UTC arithmetic. Anchoring at midday UTC means
  // subtracting 24h can never land on the wrong side of a date boundary,
  // so a DST change doesn't produce a duplicated or skipped day.
  const anchor = new Date(`${todayIn(timezone)}T12:00:00Z`).getTime();
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    out.push(new Date(anchor - i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

/** A timestamp shown in the family's timezone, e.g. "8:04 AM". */
export function timeIn(timezone: string, isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoTimestamp));
}

/** A date string like "2026-09-19" shown as "Fri, Sep 19". */
export function formatDay(timezone: string, localDate: string): string {
  // Parse as midday UTC so the date can't slip across a boundary when
  // Intl re-renders it in another timezone.
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${localDate}T12:00:00Z`));
}
