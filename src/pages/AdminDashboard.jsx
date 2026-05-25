import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, CheckCircle2, Clock3, Search, TicketCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import BrandHeader from '../components/BrandHeader.jsx';
import QRCodeModal from '../components/QRCodeModal.jsx';
import RecordForm from '../components/RecordForm.jsx';
import RecordTable from '../components/RecordTable.jsx';
import StatCard from '../components/StatCard.jsx';
import { STATUS_OPTIONS } from '../constants.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  addServiceRecord,
  cleanupExpiredCompletedRecords,
  deleteServiceRecord,
  subscribeToServiceRecords,
  syncPublicServiceRecords,
  updateServiceRecord
} from '../services/serviceRecords.js';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [barcodeRecord, setBarcodeRecord] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const hasSyncedPublicRecords = useRef(false);
  const cleanupRunning = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToServiceRecords(
      (snapshot) => {
        const nextRecords = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecords(nextRecords);
        setLoading(false);
        if (!cleanupRunning.current) {
          cleanupRunning.current = true;
          cleanupExpiredCompletedRecords(nextRecords).finally(() => {
            cleanupRunning.current = false;
          });
        }
        if (!hasSyncedPublicRecords.current && nextRecords.length) {
          hasSyncedPublicRecords.current = true;
          syncPublicServiceRecords(nextRecords).catch((error) => {
            toast.error(error.message || 'Unable to sync customer tracking');
          });
        }
      },
      (error) => {
        toast.error(error.message || 'Unable to load records');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      const haystack = [
        record.trackingId,
        record.customerName,
        record.customerPhone,
        record.productName,
        record.brand,
        record.serviceType,
        record.technicianName
      ]
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [records, search, statusFilter]);

  const stats = useMemo(() => {
    const completed = records.filter((record) => ['Completed', 'Delivered'].includes(record.status)).length;
    const inProgress = records.filter((record) =>
      ['Technician Assigned', 'Visit Scheduled', 'Installation in Progress', 'Diagnosis', 'Repair in Progress', 'Part Required', 'Ready'].includes(record.status)
    ).length;
    return {
      total: records.length,
      inProgress,
      completed,
      received: records.filter((record) => record.status === 'Request Received').length
    };
  }, [records]);

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (selectedRecord) {
        await updateServiceRecord(selectedRecord.id, data, selectedRecord.trackingId);
        toast.success('Record updated');
      } else {
        const trackingId = await addServiceRecord(data);
        toast.success(`Created ${trackingId}`);
      }
      setSelectedRecord(null);
    } catch (error) {
      toast.error(error.message || 'Unable to save record');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(record) {
    const confirmed = window.confirm(`Delete record ${record.trackingId}?`);
    if (!confirmed) return;

    try {
      await deleteServiceRecord(record.id, record.trackingId);
      toast.success('Record deleted');
    } catch (error) {
      toast.error(error.message || 'Unable to delete record');
    }
  }

  async function handleLogout() {
    await logout();
    toast.success('Logged out');
  }

  return (
    <main className="min-h-screen bg-showroom-grid bg-[size:42px_42px]">
      <BrandHeader admin onLogout={handleLogout} />
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200/70">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Service Command Center</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Create, assign, update, and track all Rajput Electronics service jobs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                className="field min-h-11 w-full px-10 sm:w-72"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search records"
              />
            </div>
            <select className="field min-h-11 px-4 sm:w-56" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>All</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={TicketCheck} label="Total Jobs" value={stats.total} tone="cyan" />
          <StatCard icon={Activity} label="In Progress" value={stats.inProgress} tone="violet" />
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} tone="green" />
          <StatCard icon={Clock3} label="Received" value={stats.received} tone="amber" />
        </div>

        <div className="grid gap-7 xl:grid-cols-[430px_1fr]">
          <RecordForm
            selectedRecord={selectedRecord}
            onCancel={() => setSelectedRecord(null)}
            onSubmit={handleSubmit}
            saving={saving}
          />
          <div>
            {loading ? (
              <div className="glass-panel flex justify-center rounded-2xl p-12">
                <div className="loader" />
              </div>
            ) : (
              <RecordTable
                records={filteredRecords}
                onEdit={setSelectedRecord}
                onDelete={handleDelete}
                onShowQr={setBarcodeRecord}
              />
            )}
          </div>
        </div>
      </section>
      <QRCodeModal record={barcodeRecord} onClose={() => setBarcodeRecord(null)} />
    </main>
  );
}
