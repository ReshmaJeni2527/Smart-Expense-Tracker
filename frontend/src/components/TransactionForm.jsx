import { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from './Field.jsx';
import useCategories from '../hooks/useCategories.js';
import { PAYMENT_METHODS } from '../utils/constants.js';
import { toInputDate, todayStr } from '../utils/format.js';
import { errorMessage, fieldErrors } from '../services/api.js';

export function validateTransaction(v) {
  const e = {};
  if (!v.type) e.type = 'Select a transaction type.';
  if (!v.description.trim()) e.description = 'Description is required.';
  if (v.amount === '' || Number.isNaN(Number(v.amount)) || Number(v.amount) <= 0) e.amount = 'Amount must be greater than zero.';
  if (!v.category) e.category = 'Select a category.';
  if (!v.date || Number.isNaN(new Date(v.date).getTime())) e.date = 'Enter a valid date.';
  return e;
}

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const { names, loading } = useCategories();
  const [v, setV] = useState({
    type: initial?.type || 'expense',
    description: initial?.description || '',
    amount: initial?.amount ?? '',
    category: initial?.category || '',
    date: initial ? toInputDate(initial.date) : todayStr(),
    paymentMethod: initial?.paymentMethod || 'UPI',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); };
  // Always list the transaction's current category while editing, even if the list is still loading.
  const options = initial?.category && !names.includes(initial.category) ? [initial.category, ...names] : names;

  const submit = async (e) => {
    e.preventDefault();
    const found = validateTransaction(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setFormError('');
    try {
      await onSubmit({ ...v, amount: Number(v.amount) });
    } catch (err) {
      setErrors(fieldErrors(err));
      setFormError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="form-grid">
      <div className="full">
        <span className="field-label">Transaction type</span>
        <div className="segmented" role="group">
          {['expense', 'income'].map((t) => (
            <button type="button" key={t} className={v.type === t ? `active active-${t}` : ''} onClick={() => setV({ ...v, type: t })}>
              {t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
        {errors.type && <span className="field-error">{errors.type}</span>}
      </div>
      <div className="full"><Field label="Description" error={errors.description}><input value={v.description} maxLength={120} onChange={set('description')} placeholder="e.g. Grocery Shopping" /></Field></div>
      <Field label="Amount (₹)" error={errors.amount}><input type="number" inputMode="decimal" step="0.01" min="0" value={v.amount} onChange={set('amount')} placeholder="1250" /></Field>
      <Field label="Category" error={errors.category} hint={!loading && !options.length ? 'No categories yet.' : undefined}>
        <select value={v.category} onChange={set('category')}>
          <option value="">Select category</option>
          {options.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      {!loading && !options.length && <p className="muted small full">Add a category on the <Link to="/categories" className="link-btn">Categories page</Link> first.</p>}
      <Field label="Date" error={errors.date}><input type="date" value={v.date} onChange={set('date')} /></Field>
      <Field label="Payment method" error={errors.paymentMethod}>
        <select value={v.paymentMethod} onChange={set('paymentMethod')}>{PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}</select>
      </Field>
      {formError && <p className="form-error full" role="alert">{formError}</p>}
      <div className="form-actions full">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : initial ? 'Save changes' : 'Add transaction'}</button>
      </div>
    </form>
  );
}
