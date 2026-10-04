import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search by description, category or amount' }) {
  return (
    <div className="search-bar">
      <Search size={16} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search" />
      {value && <button className="icon-btn" aria-label="Clear search" onClick={() => onChange('')}><X size={14} /></button>}
    </div>
  );
}
