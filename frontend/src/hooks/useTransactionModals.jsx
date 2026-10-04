import { useState } from 'react';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import { useToast } from '../components/ToastNotification.jsx';
import { errorMessage, transactionApi } from '../services/api.js';

// Shared add / edit / delete flow used by the Dashboard ("Add transaction") and the Transactions page.
export default function useTransactionModals({ onChanged }) {
  const toast = useToast();
  const [mode, setMode] = useState(null);
  const close = () => setMode(null);

  const save = async (values) => {
    const editing = mode.tx;
    if (editing) await transactionApi.update(editing._id, values);
    else await transactionApi.create(values);
    toast.success(editing ? 'Transaction updated.' : 'Transaction added.');
    close();
    onChanged();
  };

  const remove = async () => {
    try {
      await transactionApi.remove(mode.tx._id);
      toast.success('Transaction deleted.');
      onChanged();
    } catch (err) {
      toast.error(errorMessage(err));
    }
    close();
  };

  const modals = (
    <>
      <Modal open={mode?.kind === 'form'} title={mode?.tx ? 'Edit transaction' : 'Add transaction'} onClose={close}>
        {mode?.kind === 'form' && <TransactionForm initial={mode.tx} onSubmit={save} onCancel={close} />}
      </Modal>
      <ConfirmDialog open={mode?.kind === 'delete'} title="Delete transaction?" message={mode?.tx ? `"${mode.tx.description}" will be removed permanently and your totals will update.` : ''} onConfirm={remove} onClose={close} />
    </>
  );
  return {
    modals,
    openAdd: () => setMode({ kind: 'form' }),
    openEdit: (tx) => setMode({ kind: 'form', tx }),
    askDelete: (tx) => setMode({ kind: 'delete', tx }),
  };
}
