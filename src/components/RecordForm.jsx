import { useEffect, useState } from 'react';
import {
  SERVICE_CATEGORIES,
  getStatusOptions,
  normalizeStatusForService
} from '../constants.js';
import { generateTrackingId } from '../services/serviceRecords.js';

const emptyForm = {
  trackingId: '',
  customerName: '',
  customerPhone: '',
  productName: '',
  brand: '',
  serviceType: SERVICE_CATEGORIES[0],
  status: getStatusOptions(SERVICE_CATEGORIES[0])[0],
  technicianName: '',
  expectedDate: '',
  internalNotes: ''
};

export default function RecordForm({ selectedRecord, onCancel, onSubmit, saving }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selectedRecord) {
      setForm({
        trackingId: selectedRecord.trackingId || '',
        customerName: selectedRecord.customerName || '',
        customerPhone: selectedRecord.customerPhone || '',
        productName: selectedRecord.productName || '',
        brand: selectedRecord.brand || '',
        serviceType: selectedRecord.serviceType || SERVICE_CATEGORIES[0],
        status: normalizeStatusForService(
          selectedRecord.serviceType || SERVICE_CATEGORIES[0],
          selectedRecord.status
        ),
        technicianName: selectedRecord.technicianName || '',
        expectedDate: selectedRecord.expectedDate || '',
        internalNotes: selectedRecord.internalNotes || ''
      });
    } else {
      setForm({ ...emptyForm, trackingId: generateTrackingId() });
    }
  }, [selectedRecord]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === 'serviceType') {
        return {
          ...current,
          serviceType: value,
          status: normalizeStatusForService(value, current.status)
        };
      }

      return { ...current, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            {selectedRecord ? 'Edit Service Record' : 'Add Service Record'}
          </h2>
          <p className="text-sm text-slate-400">Customer-facing details stay clean; notes remain internal.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((current) => ({ ...current, trackingId: generateTrackingId() }))}
          className="btn-secondary px-3 py-2 text-xs font-bold"
        >
          New ID
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tracking ID</span>
          <input className="field px-4 py-3" name="trackingId" value={form.trackingId} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Name</span>
          <input className="field px-4 py-3" name="customerName" value={form.customerName} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Phone</span>
          <input className="field px-4 py-3" name="customerPhone" value={form.customerPhone} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Name</span>
          <input className="field px-4 py-3" name="productName" value={form.productName} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand</span>
          <input className="field px-4 py-3" name="brand" value={form.brand} onChange={updateField} required />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Category</span>
          <select className="field px-4 py-3" name="serviceType" value={form.serviceType} onChange={updateField}>
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
          <select className="field px-4 py-3" name="status" value={form.status} onChange={updateField}>
            {getStatusOptions(form.serviceType).map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Technician</span>
          <input className="field px-4 py-3" name="technicianName" value={form.technicianName} onChange={updateField} />
        </label>
        <label className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Date</span>
          <input className="field px-4 py-3" type="date" name="expectedDate" value={form.expectedDate} onChange={updateField} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Internal Notes</span>
          <textarea
            className="field min-h-28 px-4 py-3"
            name="internalNotes"
            value={form.internalNotes}
            onChange={updateField}
            placeholder="Hidden from customer"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button disabled={saving} className="btn-primary px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? 'Saving...' : selectedRecord ? 'Update Record' : 'Create Record'}
        </button>
        {selectedRecord && (
          <button type="button" onClick={onCancel} className="btn-secondary px-5 py-3">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
