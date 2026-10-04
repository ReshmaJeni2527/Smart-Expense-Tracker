import { useState } from 'react';
import { Plus, Tags, Trash2 } from 'lucide-react';
import useCategories from '../hooks/useCategories.js';
import { useToast } from '../components/ToastNotification.jsx';
import { categoryApi, errorMessage, fieldErrors } from '../services/api.js';
import { colorFor } from '../utils/constants.js';
import PageHeader from '../components/PageHeader.jsx';
import Field from '../components/Field.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Categories() {
  const toast = useToast();
  const { categories, loading, error, reload } = useCategories();
  const [name, setName] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setFieldError('Category name is required.');
    setBusy(true);
    setFieldError('');
    try {
      await categoryApi.create({ name });
      toast.success('Category added.');
      setName('');
      reload();
    } catch (err) {
      setFieldError(fieldErrors(err).name || errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    try {
      await categoryApi.remove(toDelete._id);
      toast.success('Category deleted.');
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
    setToDelete(null);
  };

  return (
    <>
      <PageHeader title="Categories" subtitle="Organise your transactions. These categories appear when you add or edit a transaction." />
      <form className="card cat-form" onSubmit={add} noValidate>
        <Field label="New category" error={fieldError}>
          <input value={name} maxLength={30} onChange={(e) => { setName(e.target.value); setFieldError(''); }} placeholder="e.g. Groceries" />
        </Field>
        <button className="btn btn-primary" disabled={busy}><Plus size={16} /> {busy ? 'Adding...' : 'Add category'}</button>
      </form>

      <section className="card">
        <div className="card-head"><h3>Your categories</h3><span className="muted small">{categories.length} total</span></div>
        {loading && !categories.length ? <LoadingState label="Loading categories..." />
          : error ? <ErrorState message={error} onRetry={reload} />
          : !categories.length ? <EmptyState icon={Tags} title="No categories yet" message="Add a category above to start organising your transactions." />
          : (
            <ul className="cat-list">
              {categories.map((c) => (
                <li key={c._id} className="cat-item">
                  <span className="dot" style={{ background: colorFor(c.name) }} />
                  <span className="cat-name">{c.name}</span>
                  <button className="icon-btn danger" aria-label={`Delete ${c.name}`} title="Delete" onClick={() => setToDelete(c)}><Trash2 size={16} /></button>
                </li>
              ))}
            </ul>
          )}
      </section>

      <ConfirmDialog open={Boolean(toDelete)} title="Delete category?" message={toDelete ? `"${toDelete.name}" will be removed from your category list.` : ''} onConfirm={remove} onClose={() => setToDelete(null)} />
    </>
  );
}
