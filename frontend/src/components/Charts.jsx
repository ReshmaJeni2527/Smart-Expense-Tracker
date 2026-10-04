import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompact, formatCurrency } from '../utils/format.js';

const TICK = { fill: '#8B93A1', fontSize: 12 };
const GRID = '#252A32';
const tooltipStyle = { contentStyle: { background: '#171A20', border: '1px solid #252A32', borderRadius: 10, color: '#E7EAEE' }, labelStyle: { color: '#E7EAEE', fontWeight: 600 }, itemStyle: { color: '#E7EAEE' }, cursor: { fill: 'rgba(255,255,255,0.04)' } };

// Simple bar chart: one bar per month showing the total of that month's expense transactions.
export function MonthlyExpenseChart({ data }) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={formatCompact} width={52} allowDecimals={false} />
          <Tooltip {...tooltipStyle} formatter={(v) => [formatCurrency(v), 'Expenses']} />
          <Bar dataKey="expenses" name="Expenses" fill="#22C55E" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
