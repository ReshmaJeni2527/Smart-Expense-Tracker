export default function StatCard({ label, value, icon: Icon, tone = 'green', hint }) {
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        {Icon && <span className={`stat-icon tone-${tone}`}><Icon size={18} /></span>}
      </div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
