import { Barcode, ExternalLink, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

function whatsappNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? `91${digits}` : digits;
}

function trackingLink(trackingId) {
  const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  const baseUrl = publicSiteUrl || window.location.origin;
  return new URL(`/track/${encodeURIComponent(trackingId)}`, baseUrl).toString();
}

function whatsappLink(record) {
  const phone = whatsappNumber(record.customerPhone);
  const trackingUrl = trackingLink(record.trackingId);
  const message = [
    '*Message From Rajput Electronics*',
    '',
    `Hello *${record.customerName || 'Customer'}*,`,
    '',
    'Thank you for choosing *Rajput Electronics*.',
    '',
    'Your service request has been successfully created and your tracking ID has been generated.',
    '',
    `*Tracking ID:* ${record.trackingId}`,
    `*Current Status:* ${record.status || 'Request Received'}`,
    '',
    '*Track Your Service:*',
    trackingUrl,
    '',
    'You will continue receiving timely updates regarding your service request.',
    '',
    'Thank you for trusting *Rajput Electronics*.',
    '',
    '*RAJPUT ELECTRONICS — BHAROSE KA NAAM*'
  ].join('\n');

  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '';
}

export default function RecordTable({ records, onEdit, onDelete, onShowQr }) {
  if (!records.length) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-300">
        No service records found.
      </div>
    );
  }

  return (
    <div className="glass-panel premium-card overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="tech-table min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950/70">
            <tr>
              {['Tracking', 'Customer', 'Product', 'Service', 'Status', 'Handled By', 'Expected', 'Actions'].map((head) => (
                <th key={head} className="px-4 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {records.map((record) => {
              const shareLink = whatsappLink(record);

              return (
              <tr key={record.id} className="hover:bg-cyan-400/[0.04]">
                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-cyan-100">{record.trackingId}</td>
                <td className="px-4 py-4 text-sm text-slate-200">
                  <div className="font-semibold">{record.customerName}</div>
                  <div className="text-xs text-slate-500">{record.customerPhone}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-200">
                  <div className="font-semibold">{record.productName}</div>
                  <div className="text-xs text-slate-500">{record.brand}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-300">{record.serviceType}</td>
                <td className="min-w-40 px-4 py-4"><StatusBadge status={record.status} /></td>
                <td className="px-4 py-4 text-sm text-slate-300">{record.technicianName || '-'}</td>
                <td className="px-4 py-4 text-sm text-slate-300">{record.expectedDate || '-'}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      className={`btn-secondary p-2 ${
                        record.customerPhone ? 'text-emerald-200' : 'pointer-events-none opacity-40'
                      }`}
                      href={shareLink}
                      target="_blank"
                      rel="noreferrer"
                      title={
                        record.customerPhone
                          ? 'Send tracking on WhatsApp'
                          : 'Add customer phone to send WhatsApp'
                      }
                    >
                      <MessageCircle size={16} />
                    </a>
                    <a
                      className="btn-secondary p-2"
                      href={`/track/${record.trackingId}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Open customer tracking"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button className="btn-secondary p-2" onClick={() => onShowQr(record)} title="Barcode">
                      <Barcode size={16} />
                    </button>
                    <button className="btn-secondary p-2" onClick={() => onEdit(record)} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="btn-secondary p-2 text-rose-200" onClick={() => onDelete(record)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
