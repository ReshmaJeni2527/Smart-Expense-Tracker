import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LogOut, Receipt, Settings, Tags, Wallet, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  ['/', 'Dashboard', LayoutDashboard], ['/transactions', 'Transactions', Receipt],
  ['/categories', 'Categories', Tags], ['/settings', 'Settings', Settings],
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Wallet size={18} /></span>
          <div><strong>SpendWise</strong><small>Smart Expense Tracker</small></div>
          <button className="icon-btn drawer-close" aria-label="Close menu" onClick={onClose}><X size={18} /></button>
        </div>
        <nav>
          {NAV.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          <div className="user-meta"><strong>{user?.name}</strong><small>{user?.email}</small></div>
          <button className="icon-btn" aria-label="Log out" title="Log out" onClick={logout}><LogOut size={18} /></button>
        </div>
      </aside>
    </>
  );
}
