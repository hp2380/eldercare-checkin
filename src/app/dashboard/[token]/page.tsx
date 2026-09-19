import { notFound } from "next/navigation";
import { familyByChildToken, checkinsSince } from "@/lib/families";
import { recentDates, todayIn, timeIn, formatDay } from "@/lib/dates";
import AutoRefresh from "./auto-refresh";

export const dynamic = "force-dynamic";

const HISTORY_DAYS = 14;

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const family = await familyByChildToken(token);
  if (!family) notFound();

  const days = recentDates(family.timezone, HISTORY_DAYS);
  const today = todayIn(family.timezone);

  // One query for the whole window, then grouped in memory. Two weeks of
  // check-ins is a handful of rows, so this is cheaper than a query per day.
  const checkins = await checkinsSince(family.id, days[days.length - 1]);

  const byDate = new Map<string, typeof checkins>();
  for (const c of checkins) {
    const list = byDate.get(c.local_date) ?? [];
    list.push(c);
    byDate.set(c.local_date, list);
  }

  const todays = byDate.get(today) ?? [];
  const okayToday = todays.find((c) => c.kind === "okay");
  const medsToday = todays.find((c) => c.kind === "meds");

  // The headline the whole dashboard exists for.
  const tone = okayToday ? "good" : "bad";
  const headline = okayToday
    ? `${family.parent_label} checked in today`
    : `No check-in from ${family.parent_label} today`;

  const detail = okayToday
    ? [
        `Tapped "I'm okay" at ${timeIn(family.timezone, okayToday.created_at)}`,
        medsToday
          ? `Meds at ${timeIn(family.timezone, medsToday.created_at)}`
          : "Meds not marked yet",
      ].join(" · ")
    : "Nothing recorded yet today. It may still be early where they are.";

  return (
    <>
      <div className="status-card" data-tone={tone}>
        <p className="status-headline">{headline}</p>
        <p className="status-detail">{detail}</p>
      </div>

      <h2 className="section-title">Last {HISTORY_DAYS} days</h2>
      <ul className="history">
        {days.map((date) => {
          const entries = byDate.get(date) ?? [];
          const okay = entries.find((c) => c.kind === "okay");
          const meds = entries.find((c) => c.kind === "meds");

          const marks = [
            okay ? `✓ okay ${timeIn(family.timezone, okay.created_at)}` : null,
            meds ? `✓ meds ${timeIn(family.timezone, meds.created_at)}` : null,
          ].filter(Boolean);

          return (
            <li key={date} data-today={date === today}>
              <span className="day-label">
                {date === today ? "Today" : formatDay(family.timezone, date)}
              </span>
              <span className="day-marks" data-empty={marks.length === 0}>
                {marks.length > 0 ? marks.join(" · ") : "no check-in"}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="footnote">
        Times are shown in {family.parent_label}&apos;s timezone (
        {family.timezone}). This page updates itself every minute.
      </p>

      <AutoRefresh />
    </>
  );
}
