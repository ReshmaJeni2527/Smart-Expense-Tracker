import { RefreshCw, WifiOff } from 'lucide-react';

export default function ErrorState({ message = 'Unable to load your financial data. Please try again.', onRetry }) {
  return (
    <div className="empty-state error-state" role="alert">
      <div className="empty-icon"><WifiOff size={26} /></div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn-secondary" onClick={onRetry}><RefreshCw size={16} /> Try again</button>}
    </div>
  );
}
