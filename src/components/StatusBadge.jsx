export function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/20",
    active: "bg-blue-50 text-blue-700 ring-blue-600/20",
    closed: "bg-surface-100 text-surface-500 ring-surface-400/20",
    available: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-600/20",
    completed: "bg-surface-100 text-surface-600 ring-surface-400/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}
