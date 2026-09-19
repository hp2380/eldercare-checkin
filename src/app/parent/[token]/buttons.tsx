"use client";

import { useState } from "react";
import { CHECKIN_KINDS, type CheckinKind } from "@/lib/checkin-kinds";

// The only client component in the app. It exists because tapping a button
// has to do something without a full page reload.

const LABELS: Record<CheckinKind, { idle: string; done: string }> = {
  okay: { idle: "I'm okay today", done: "You're marked okay today" },
  meds: { idle: "Took my morning meds", done: "Your meds are marked done" },
};

export default function CheckinButtons({
  token,
  initialDone,
}: {
  token: string;
  initialDone: CheckinKind[];
}) {
  const [done, setDone] = useState<CheckinKind[]>(initialDone);
  const [pending, setPending] = useState<CheckinKind | null>(null);
  const [failed, setFailed] = useState(false);

  async function tap(kind: CheckinKind) {
    if (done.includes(kind) || pending) return;

    setPending(kind);
    setFailed(false);

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, kind }),
      });

      if (!res.ok) throw new Error(`Check-in failed: ${res.status}`);

      setDone((prev) => [...prev, kind]);
    } catch {
      // Don't mark it done if we aren't sure it saved - a false confirmation
      // here is worse than asking them to tap again.
      setFailed(true);
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      {failed && (
        <p className="tap-error" role="alert">
          That didn&apos;t save. Please check your internet and tap again.
        </p>
      )}

      {CHECKIN_KINDS.map((kind) => {
        const isDone = done.includes(kind);
        const isPending = pending === kind;

        return (
          <button
            key={kind}
            type="button"
            className="big-button"
            data-done={isDone}
            disabled={isDone || pending !== null}
            onClick={() => tap(kind)}
          >
            {isPending ? (
              "Saving..."
            ) : isDone ? (
              <>
                ✓ {LABELS[kind].idle}
                <span className="button-note">{LABELS[kind].done}</span>
              </>
            ) : (
              LABELS[kind].idle
            )}
          </button>
        );
      })}
    </>
  );
}
