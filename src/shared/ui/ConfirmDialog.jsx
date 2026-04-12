function ConfirmDialog({
  cancelLabel = 'إلغاء',
  confirmLabel = 'تأكيد',
  message,
  onCancel,
  onConfirm,
  open,
  title = 'تأكيد العملية',
  tone = 'danger',
}) {
  if (!open) {
    return null;
  }

  const confirmButtonClass =
    tone === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mb-6 leading-7 text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 font-bold text-white transition ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
