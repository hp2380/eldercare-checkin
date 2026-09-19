import "server-only";
import { getSupabase } from "@/lib/supabase";
import type { CheckinKind } from "@/lib/checkin-kinds";

export type Family = {
  id: string;
  parent_label: string;
  child_label: string;
  timezone: string;
};

export type Checkin = {
  kind: CheckinKind;
  local_date: string;
  created_at: string;
};

const FAMILY_FIELDS = "id, parent_label, child_label, timezone";

/** Look up a family by the token in a parent link. Null if no match. */
export async function familyByParentToken(
  token: string,
): Promise<Family | null> {
  const { data, error } = await getSupabase()
    .from("families")
    .select(FAMILY_FIELDS)
    .eq("parent_token", token)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Look up a family by the token in a dashboard link. Null if no match. */
export async function familyByChildToken(
  token: string,
): Promise<Family | null> {
  const { data, error } = await getSupabase()
    .from("families")
    .select(FAMILY_FIELDS)
    .eq("child_token", token)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** Every check-in on or after `sinceDate`, newest first. */
export async function checkinsSince(
  familyId: string,
  sinceDate: string,
): Promise<Checkin[]> {
  const { data, error } = await getSupabase()
    .from("checkins")
    .select("kind, local_date, created_at")
    .eq("family_id", familyId)
    .gte("local_date", sinceDate)
    .order("local_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Record a check-in. Safe to call repeatedly: the unique constraint on
 * (family_id, kind, local_date) means extra taps on the same day are ignored
 * and the first tap's timestamp is kept.
 */
export async function recordCheckin(
  familyId: string,
  kind: CheckinKind,
  localDate: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from("checkins")
    .upsert(
      { family_id: familyId, kind, local_date: localDate },
      { onConflict: "family_id,kind,local_date", ignoreDuplicates: true },
    );

  if (error) throw error;
}
