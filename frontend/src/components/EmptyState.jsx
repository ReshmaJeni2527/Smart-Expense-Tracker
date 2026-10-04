export default function EmptyState({ icon: Icon, title, message, action, secondary }) {
  return (
    <div className="empty-state">
      {Icon && <div className="empty-icon"><Icon size={26} /></div>}
      <h3>{title}</h3>
      <p>{message}</p>
      {(action || secondary) && <div className="empty-actions">{action}{secondary}</div>}
    </div>
  );
}
