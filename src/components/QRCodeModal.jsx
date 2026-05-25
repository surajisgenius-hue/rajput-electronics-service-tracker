import Barcode from 'react-barcode';
import { X } from 'lucide-react';

export default function QRCodeModal({ record, onClose }) {
  if (!record) return null;

  function downloadBarcode() {
    const canvas = document.querySelector('[data-barcode-card] canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${record.trackingId}-barcode.png`;
    link.href = pngUrl;
    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold">Tracking Barcode</h3>
            <p className="text-sm text-slate-400">{record.trackingId}</p>
          </div>
          <button onClick={onClose} className="btn-secondary p-2" title="Close">
            <X size={18} />
          </button>
        </div>
        <div data-barcode-card className="overflow-x-auto rounded-2xl bg-white p-5 text-center">
          <Barcode
            value={record.trackingId}
            format="CODE128"
            renderer="canvas"
            width={2}
            height={90}
            displayValue
            fontOptions="bold"
            fontSize={18}
            margin={12}
          />
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Customer can type this Tracking ID on the public tracking page.
        </p>
        <button onClick={downloadBarcode} className="btn-primary mt-5 w-full px-5 py-3">
          Download Barcode
        </button>
      </div>
    </div>
  );
}
