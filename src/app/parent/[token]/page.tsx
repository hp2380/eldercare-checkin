import { notFound } from "next/navigation";
import { familyByParentToken, checkinsSince } from "@/lib/families";
import { todayIn } from "@/lib/dates";
import CheckinButtons from "./buttons";

// Never cache this page: whether today's buttons show as already-tapped
// changes through the day and differs per family.
export const dynamic = "force-dynamic";

export default async function ParentPage({
  params,
}: {
  // In the App Router, params arrives as a Promise and has to be awaited.
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const family = await familyByParentToken(token);
  if (!family) notFound();

  const today = todayIn(family.timezone);
  const todaysCheckins = await checkinsSince(family.id, today);
  const doneKinds = todaysCheckins.map((c) => c.kind);

  return (
    <>
      <h1 className="greeting">Hello!</h1>
      <p className="greeting-sub">
        Tap a button to let {family.child_label} know how you&apos;re doing.
      </p>

      <CheckinButtons token={token} initialDone={doneKinds} />
    </>
  );
}
