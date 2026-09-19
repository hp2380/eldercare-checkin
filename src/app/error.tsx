"use client";

// Shown if something server-side fails - most likely the database being
// unreachable. Without this, the parent would see a raw Next.js error page.
// The real error is logged on the server; it is never shown here, because it
// would be both alarming and useless to the person reading it.

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="notice">
      <h1>Something went wrong</h1>
      <p>We couldn&apos;t load this page just now.</p>
      <button
        type="button"
        className="big-button"
        style={{ marginTop: 20 }}
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
