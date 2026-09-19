// Shown when a link token doesn't match any family - a mistyped or expired
// link. It deliberately doesn't say whether the token was wrong or the family
// was deleted, and it never echoes the token back.

export default function NotFound() {
  return (
    <div className="notice">
      <h1>This link doesn&apos;t work</h1>
      <p>
        Double-check that you opened the most recent link that was sent to you.
        If it still doesn&apos;t work, ask whoever set this up to send a new one.
      </p>
    </div>
  );
}
