import { useEffect, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import {
  SERVICE_CATEGORIES,
  getStatusOptions,
  normalizeStatusForService
} from '../constants.js';
import { MAX_RECORD_IMAGE_BYTES, generateTrackingId } from '../services/serviceRecords.js';

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
  internalNotes: '',
  imageFile: null,
  imageName: '',
  imagePath: '',
  imageUrl: '',
  imagePreviewUrl: '',
  removeImage: false
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
        internalNotes: selectedRecord.internalNotes || '',
        imageFile: null,
        imageName: selectedRecord.imageName || '',
        imagePath: selectedRecord.imagePath || '',
        imageUrl: selectedRecord.imageUrl || '',
        imagePreviewUrl: selectedRecord.imageUrl || '',
        removeImage: false
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

  function updateImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_RECORD_IMAGE_BYTES) {
      alert('Image size should be 5 MB or less.');
      event.target.value = '';
      return;
    }

    setForm((current) => ({
      ...current,
      imageFile: file,
      imageName: file.name,
      imagePreviewUrl: URL.createObjectURL(file),
      removeImage: false
    }));
  }

  function removeImage() {
    setForm((current) => ({
      ...current,
      imageFile: null,
      imageName: '',
      imagePreviewUrl: '',
      imageUrl: '',
      removeImage: Boolean(current.imagePath)
    }));
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
        <div className="space-y-2 md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Image</span>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/45 p-3">
            {form.imagePreviewUrl ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <img
                  src={form.imagePreviewUrl}
                  alt="Selected service"
                  className="h-24 w-24 rounded-xl border border-slate-700 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{form.imageName || 'Selected image'}</p>
                  <p className="mt-1 text-xs text-slate-500">Stored with this service record.</p>
                </div>
                <button type="button" onClick={removeImage} className="btn-secondary flex items-center justify-center gap-2 px-3 py-2 text-xs">
                  <X size={14} />
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 px-4 py-6 text-center hover:border-cyan-300/60">
                <ImagePlus className="text-cyan-200" size={26} />
                <span className="mt-2 text-sm font-bold text-white">Upload image</span>
                <span className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP up to 5 MB</span>
                <input type="file" accept="image/*" className="sr-only" onChange={updateImage} />
              </label>
            )}
            {form.imagePreviewUrl && (
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-cyan-100 hover:border-cyan-300/60">
                <ImagePlus size={14} />
                Replace image
                <input type="file" accept="image/*" className="sr-only" onChange={updateImage} />
              </label>
            )}
          </div>
        </div>
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
