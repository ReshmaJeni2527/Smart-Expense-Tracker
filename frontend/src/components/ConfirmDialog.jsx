import { useState } from 'react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { await onConfirm(); } finally { setBusy(false); }
  };
  return (
    <Modal open={open} title={title} onClose={busy ? () => {} : onClose} size="sm">
      <p className="muted">{message}</p>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
        <button className="btn btn-danger" onClick={go} disabled={busy}>{busy ? 'Working...' : confirmLabel}</button>
      </div>
    </Modal>
  );
}
