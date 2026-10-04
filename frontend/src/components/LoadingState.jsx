export default function LoadingState({ label = 'Loading...', fullscreen = false, rows = 0 }) {
  if (rows) {
    return <div className="skeleton-list" aria-busy="true">{Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton" />)}</div>;
  }
  return (
    <div className={`loading-state ${fullscreen ? 'fullscreen' : ''}`} aria-busy="true">
      <span className="spinner" />
      <p>{label}</p>
    </div>
  );
}
