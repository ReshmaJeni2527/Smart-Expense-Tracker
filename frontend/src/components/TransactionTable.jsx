import { Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import TransactionCard from './TransactionCard.jsx';
import { colorFor } from '../utils/constants.js';
import { formatCurrency, formatDate } from '../utils/format.js';

// Table on desktop, stacked cards on mobile (CSS switches between them).
// The Actions column only appears when onEdit / onDelete are passed (the Transactions page).
export default function TransactionTable({ items, onEdit, onDelete }) {
  const actions = Boolean(onEdit || onDelete);
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th className="num">Amount</th><th>Payment Method</th>{actions && <th className="num">Actions</th>}</tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t._id}>
                <td>{formatDate(t.date)}</td>
                <td className="strong">{t.description}</td>
                <td><span className="dot" style={{ background: colorFor(t.category) }} /> {t.category}</td>
                <td><StatusBadge status={t.type} /></td>
                <td className={`num strong ${t.type === 'income' ? 'text-green' : 'text-red'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}</td>
                <td>{t.paymentMethod}</td>
                {actions && (
                  <td className="num">
                    {onEdit && <button className="icon-btn" aria-label="Edit" title="Edit" onClick={() => onEdit(t)}><Pencil size={16} /></button>}
                    {onDelete && <button className="icon-btn danger" aria-label="Delete" title="Delete" onClick={() => onDelete(t)}><Trash2 size={16} /></button>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="tx-cards">{items.map((t) => <TransactionCard key={t._id} tx={t} onEdit={onEdit} onDelete={onDelete} />)}</div>
    </>
  );
}
