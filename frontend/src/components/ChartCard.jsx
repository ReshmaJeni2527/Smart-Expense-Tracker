export default function ChartCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`card chart-card ${className}`}>
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
