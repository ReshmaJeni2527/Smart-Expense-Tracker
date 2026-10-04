import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { colorFor } from '../utils/constants.js';
import { formatCurrency, formatDate } from '../utils/format.js';

// Mobile version of a table row. Edit / Delete buttons only show when the page supports them.
export default function TransactionCard({ tx, onEdit, onDelete }) {
  const income = tx.type === 'income';
  return (
    <div className="tx-card">
      <span className={`tx-icon ${income ? 'in' : 'out'}`}>{income ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span>
      <span className="tx-main">
        <strong>{tx.description}</strong>
        <small><span className="dot" style={{ background: colorFor(tx.category) }} /> {tx.category} · {formatDate(tx.date)} · {tx.paymentMethod}</small>
      </span>
      <span className={`tx-amount ${income ? 'text-green' : 'text-red'}`}>{income ? '+' : '-'}{formatCurrency(tx.amount)}</span>
      {(onEdit || onDelete) && (
        <span className="tx-actions">
          {onEdit && <button className="icon-btn" aria-label="Edit" onClick={() => onEdit(tx)}><Pencil size={16} /></button>}
          {onDelete && <button className="icon-btn danger" aria-label="Delete" onClick={() => onDelete(tx)}><Trash2 size={16} /></button>}
        </span>
      )}
    </div>
  );
}
