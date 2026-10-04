const LABELS = { income: 'Income', expense: 'Expense' };

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] || status}</span>;
}
