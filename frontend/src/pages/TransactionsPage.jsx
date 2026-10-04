import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Receipt, SearchX } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import useCategories from '../hooks/useCategories.js';
import useTransactionModals from '../hooks/useTransactionModals.jsx';
import { transactionApi } from '../services/api.js';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterBar, { EMPTY_FILTERS } from '../components/FilterBar.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function TransactionsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDebounce(search);
  const { names } = useCategories();
  const list = useFetch(() => transactionApi.list({ ...filters, q, page, limit: 12 }), [JSON.stringify(filters), q, page]);
  const tx = useTransactionModals({ onChanged: list.reload });
  const filtered = Boolean(q || filters.type || filters.category || filters.from || filters.to);
  const resetAll = () => { setSearch(''); setPage(1); setFilters(EMPTY_FILTERS); };
  const data = list.data;
  const addButton = <button className="btn btn-primary" onClick={() => tx.openAdd()}><Plus size={16} /> Add transaction</button>;

  return (
    <>
      <PageHeader title="Transactions" subtitle="Every income and expense in one place.">{addButton}</PageHeader>
      <section className="card">
        <div className="toolbar">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
        <FilterBar filters={filters} categories={names} onChange={(f) => { setFilters(f); setPage(1); }} />
        {list.loading && !data ? <LoadingState label="Loading transactions..." rows={5} />
          : list.error ? <ErrorState message={list.error} onRetry={list.reload} />
          : data.total === 0 ? (
            filtered ? <EmptyState icon={SearchX} title="No matching transactions" message="Try changing your search or filters." action={<button className="btn btn-secondary" onClick={resetAll}>Clear filters</button>} />
              : <EmptyState icon={Receipt} title="No transactions yet" message="Add your first income or expense to get started." action={addButton} />
          ) : (
            <div className={list.loading ? 'is-refreshing' : ''}>
              <TransactionTable items={data.items} onEdit={tx.openEdit} onDelete={tx.askDelete} />
              <div className="pagination">
                <span className="muted small">{data.total} transaction{data.total === 1 ? '' : 's'}</span>
                <div>
                  <button className="icon-btn" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /></button>
                  <span className="small">Page {data.page} of {data.pages}</span>
                  <button className="icon-btn" aria-label="Next page" disabled={page >= data.pages} onClick={() => setPage(page + 1)}><ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          )}
      </section>
      {tx.modals}
    </>
  );
}
