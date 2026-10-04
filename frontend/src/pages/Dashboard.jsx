import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Plus, Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import useFetch from '../hooks/useFetch.js';
import useTransactionModals from '../hooks/useTransactionModals.jsx';
import { dashboardApi } from '../services/api.js';
import { formatCurrency, greeting } from '../utils/format.js';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartCard from '../components/ChartCard.jsx';
import { MonthlyExpenseChart } from '../components/Charts.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import LoadingState from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const summary = useFetch(dashboardApi.summary, []);
  const tx = useTransactionModals({ onChanged: summary.reload });
  const s = summary.data;
  const addButton = <button className="btn btn-primary" onClick={() => tx.openAdd()}><Plus size={16} /> Add transaction</button>;

  return (
    <>
      <PageHeader title={`${greeting()}, ${user?.name?.split(' ')[0]} 👋`} subtitle="Here's your financial overview.">{addButton}</PageHeader>
      {summary.loading && !s ? <LoadingState label="Loading your dashboard..." />
        : summary.error ? <ErrorState message={summary.error} onRetry={summary.reload} />
        : !s.hasData ? (
          <EmptyState icon={Receipt} title="No transactions yet" message="Add your first income or expense to see your totals and chart here." action={addButton} />
        ) : (
          <>
            <div className="grid-4">
              <StatCard label="Total Balance" value={formatCurrency(s.totalBalance)} icon={Wallet} tone="green" hint="Total income minus total expenses" />
              <StatCard label="Total Income" value={formatCurrency(s.totalIncome)} icon={TrendingUp} tone="green" hint="All income transactions" />
              <StatCard label="Total Expenses" value={formatCurrency(s.totalExpenses)} icon={TrendingDown} tone="red" hint="All expense transactions" />
              <StatCard label="This Month Expenses" value={formatCurrency(s.monthExpenses)} icon={CalendarDays} tone="blue" hint="Expenses in the current month" />
            </div>

            <ChartCard title="Monthly Expenses" subtitle="Expense total for each of the last 6 months">
              <MonthlyExpenseChart data={s.monthly} />
            </ChartCard>

            <section className="card">
              <div className="card-head"><h3>Recent Transactions</h3><Link to="/transactions" className="link-btn">View all <ArrowRight size={14} /></Link></div>
              <TransactionTable items={s.recent} />
            </section>
          </>
        )}
      {tx.modals}
    </>
  );
}
