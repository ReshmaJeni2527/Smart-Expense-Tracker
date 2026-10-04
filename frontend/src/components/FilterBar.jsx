export const EMPTY_FILTERS = { type: '', category: '', from: '', to: '' };

// Filters: Income / Expense, Category, Date range.
export default function FilterBar({ filters, categories, onChange }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });
  return (
    <div className="filter-bar">
      <select value={filters.type} onChange={set('type')} aria-label="Type">
        <option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option>
      </select>
      <select value={filters.category} onChange={set('category')} aria-label="Category">
        <option value="">All categories</option>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <label className="date-filter"><span>From</span><input type="date" value={filters.from} max={filters.to || undefined} onChange={set('from')} /></label>
      <label className="date-filter"><span>To</span><input type="date" value={filters.to} min={filters.from || undefined} onChange={set('to')} /></label>
      <button className="btn btn-ghost btn-sm" onClick={() => onChange(EMPTY_FILTERS)}>Reset</button>
    </div>
  );
}
