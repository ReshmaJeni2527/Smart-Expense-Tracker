import { Menu, Wallet } from 'lucide-react';

// Top bar shown on tablet/mobile only; it opens the sidebar drawer.
export default function Navbar({ onMenu }) {
  return (
    <header className="topbar">
      <button className="icon-btn" aria-label="Open menu" onClick={onMenu}><Menu size={22} /></button>
      <span className="brand-inline"><span className="brand-mark"><Wallet size={16} /></span> SpendWise</span>
    </header>
  );
}
