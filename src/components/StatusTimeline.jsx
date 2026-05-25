import { CheckCircle2, Circle } from 'lucide-react';
import { getStatusOptions, normalizeStatusForService } from '../constants.js';

export default function StatusTimeline({ currentStatus, serviceType }) {
  const statuses = getStatusOptions(serviceType);
  const normalizedStatus = normalizeStatusForService(serviceType, currentStatus);
  const activeIndex = Math.max(statuses.indexOf(normalizedStatus), 0);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {statuses.map((status, index) => {
        const isDone = index <= activeIndex;
        return (
          <div
            key={status}
            className={`flex items-center gap-3 rounded-xl border p-3 ${
              isDone
                ? 'border-neon-blue/30 bg-neon-blue/10 text-cyan-50'
                : 'border-slate-700/70 bg-slate-900/35 text-slate-500'
            }`}
          >
            {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            <span className="text-sm font-semibold">{status}</span>
          </div>
        );
      })}
    </div>
  );
}
