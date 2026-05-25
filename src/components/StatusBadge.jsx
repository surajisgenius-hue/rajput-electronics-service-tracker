import { STATUS_COLORS } from '../constants.js';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        STATUS_COLORS[status] || STATUS_COLORS['Request Received']
      }`}
    >
      {status || 'Request Received'}
    </span>
  );
}
