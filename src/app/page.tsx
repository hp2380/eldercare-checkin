// The bare domain. Nobody should land here in normal use - both real pages
// are reached through a personal link - so this just explains that.

export default function HomePage() {
  return (
    <div className="notice">
      <h1>ElderCare Check-in</h1>
      <p>
        This app is used through a personal link. Please open the link that was
        sent to you.
      </p>
    </div>
  );
}
