import { useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastNotification.jsx';
import { authApi, errorMessage, fieldErrors, settingsApi } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import Field from '../components/Field.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setErrors({ name: 'Name is required.' });
    setErrors({});
    setBusy(true);
    try { setUser(await authApi.update({ name })); toast.success('Settings saved.'); }
    catch (err) { setErrors(fieldErrors(err)); toast.error(errorMessage(err)); }
    finally { setBusy(false); }
  };
  const reset = async () => {
    try { await settingsApi.reset(); toast.success('All your transactions have been deleted.'); } catch (err) { toast.error(errorMessage(err)); }
    setConfirm(false);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile and your data." />
      <div className="grid-2">
        <form className="card form-grid" onSubmit={save} noValidate>
          <div className="card-head full"><h3>Profile</h3></div>
          <div className="full"><Field label="Name" error={errors.name}><input value={name} onChange={(e) => setName(e.target.value)} /></Field></div>
          <div className="full"><Field label="Email"><input value={user.email} disabled /></Field></div>
          <div className="full"><Field label="Currency"><input value="Indian Rupee (₹)" disabled /></Field></div>
          <div className="form-actions full"><button className="btn btn-primary" disabled={busy}><Save size={16} /> {busy ? 'Saving...' : 'Save changes'}</button></div>
        </form>
        <section className="card">
          <div className="card-head"><h3>Your data</h3></div>
          <div className="setting-row">
            <div><strong>Reset all transactions</strong><p className="muted small">Permanently deletes every transaction. Your categories are kept.</p></div>
            <button className="btn btn-danger" onClick={() => setConfirm(true)}><RotateCcw size={16} /> Reset</button>
          </div>
          <div className="setting-row">
            <div><strong>Log out</strong><p className="muted small">End your session on this device.</p></div>
            <button className="btn btn-ghost" onClick={logout}>Log out</button>
          </div>
        </section>
      </div>
      <ConfirmDialog open={confirm} title="Reset all transactions?" message="This permanently deletes every transaction. This cannot be undone." confirmLabel="Delete everything" onConfirm={reset} onClose={() => setConfirm(false)} />
    </>
  );
}
