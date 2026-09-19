import { NextResponse } from "next/server";
import { familyByParentToken, recordCheckin } from "@/lib/families";
import { isCheckinKind } from "@/lib/checkin-kinds";
import { todayIn } from "@/lib/dates";

// The one write endpoint. The parent's token is the only credential, so it
// is re-checked here rather than trusted from the page that called us.

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token, kind } = (body ?? {}) as { token?: unknown; kind?: unknown };

  if (typeof token !== "string" || !isCheckinKind(kind)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const family = await familyByParentToken(token);
  if (!family) {
    // Same generic message as a malformed request, so this can't be used to
    // test whether a guessed token exists.
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // The date is computed here from the family's timezone, never taken from
  // the browser - a wrong clock on the phone shouldn't file a check-in
  // under the wrong day.
  await recordCheckin(family.id, kind, todayIn(family.timezone));

  return NextResponse.json({ ok: true });
}
