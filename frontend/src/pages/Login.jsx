import { useState } from 'react';
import { BarChart3, ShieldCheck, Tags, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage, fieldErrors } from '../services/api.js';
import Field from '../components/Field.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [v, setV] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setV({ ...v, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); };

  const run = async (fn) => {
    setBusy(true);
    setFormError('');
    try { await fn(); } catch (err) { setErrors(fieldErrors(err)); setFormError(errorMessage(err)); } finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    const f = {};
    if (mode === 'register' && !v.name.trim()) f.name = 'Name is required.';
    if (!EMAIL_RE.test(v.email)) f.email = 'Enter a valid email address.';
    if (!v.password) f.password = 'Password is required.';
    else if (mode === 'register' && v.password.length < 6) f.password = 'Use at least 6 characters.';
    setErrors(f);
    if (Object.keys(f).length) return;
    run(() => (mode === 'login' ? login({ email: v.email, password: v.password }) : register(v)));
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="brand"><span className="brand-mark"><Wallet size={18} /></span><div><strong>SpendWise</strong><small>Smart Personal Finance & Expense Management</small></div></div>
        <h1>Know where your money goes.</h1>
        <p className="muted">Track your income and expenses, organise them into categories and see your spending at a glance.</p>
        <ul className="hero-points">
          <li><BarChart3 size={18} /> A simple monthly expense chart from your own data</li>
          <li><Tags size={18} /> Your own categories for every transaction</li>
          <li><ShieldCheck size={18} /> Personal tracking only, not financial advice</li>
        </ul>
      </section>
      <section className="auth-panel">
        <form className="card auth-card" onSubmit={submit} noValidate>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">{mode === 'login' ? 'Log in to see your financial overview.' : 'Start tracking in under a minute.'}</p>
          {mode === 'register' && <Field label="Name" error={errors.name}><input value={v.name} onChange={set('name')} placeholder="Your name" autoComplete="name" /></Field>}
          <Field label="Email" error={errors.email}><input type="email" value={v.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" /></Field>
          <Field label="Password" error={errors.password}><input type="password" value={v.password} onChange={set('password')} placeholder="••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></Field>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}</button>
          <p className="switch-mode">
            {mode === 'login' ? "New here? " : 'Already have an account? '}
            <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); setFormError(''); }}>
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}
