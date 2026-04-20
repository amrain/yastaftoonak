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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4" dir="rtl">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-gray-800">
        <h3 className="mb-3 text-2xl font-black text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mb-7 text-lg font-bold leading-8 text-gray-700 dark:text-gray-200">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-base font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-base font-black text-white transition ${confirmButtonClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
