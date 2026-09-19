// The two kinds of check-in, and nothing else.
//
// This lives apart from families.ts on purpose. The client component needs
// these values, and families.ts imports the server-only Supabase client -
// importing it from the browser would be a build error (and, without the
// "server-only" guard, a leaked database key).

export const CHECKIN_KINDS = ["okay", "meds"] as const;

export type CheckinKind = (typeof CHECKIN_KINDS)[number];

export function isCheckinKind(value: unknown): value is CheckinKind {
  return (
    typeof value === "string" &&
    (CHECKIN_KINDS as readonly string[]).includes(value)
  );
}
