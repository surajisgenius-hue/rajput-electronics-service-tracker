import { STATUS_COLORS } from '../constants.js';

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex max-w-36 items-center justify-center rounded-full border px-3 py-1 text-center text-[11px] font-bold leading-tight sm:max-w-none sm:whitespace-nowrap ${
        STATUS_COLORS[status] || STATUS_COLORS['Request Received']
      }`}
    >
      {status || 'Request Received'}
    </span>
  );
}
