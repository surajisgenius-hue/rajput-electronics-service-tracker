import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarClock, Cpu, Headphones, Search, ShieldCheck, UserRoundCog, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import BrandHeader from '../components/BrandHeader.jsx';
import FirebaseSetupNotice from '../components/FirebaseSetupNotice.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import StatusTimeline from '../components/StatusTimeline.jsx';
import { isFirebaseConfigured } from '../firebase.js';
import { findRecordByTrackingId } from '../services/serviceRecords.js';

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
        <Icon size={15} />
        {label}
      </div>
      <p className="mt-2 text-base font-bold text-white">{value || '-'}</p>
    </div>
  );
}

export default function CustomerTracking() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(trackingId || '');
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trackingId) {
      handleSearch(trackingId);
    }
  }, [trackingId]);

  async function handleSearch(value = query) {
    const id = value.trim();
    if (!id) {
      toast.error('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setRecord(null);

    try {
      const result = await findRecordByTrackingId(id);
      if (!result) {
        toast.error('No service record found');
      }
      setRecord(result);
      if (result && trackingId !== result.trackingId) {
        navigate(`/track/${result.trackingId}`, { replace: false });
      }
    } catch (error) {
      toast.error(error.message || 'Unable to load tracking details');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="tech-shell min-h-screen overflow-hidden bg-showroom-grid bg-[size:42px_42px]">
      <BrandHeader />

      <section className="mx-auto w-full max-w-4xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-blue/25 bg-neon-blue/10 px-4 py-2 text-sm font-bold text-cyan-100">
            <ShieldCheck size={16} />
            Verified service tracking portal
          </div>
          <h1 className="tech-title max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Track your service status in real time.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Enter your Rajput Electronics tracking ID or barcode number provided by our staff.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-neon-blue/20 bg-slate-950/70 p-3 shadow-glow sm:flex-row"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="field min-h-14 flex-1 px-5 text-base"
              placeholder="Enter Tracking ID, e.g. RJX-260525-K7M2-8Q"
            />
            <button disabled={loading} className="btn-primary flex min-h-14 items-center justify-center gap-2 px-6 disabled:opacity-60">
              <Search size={19} />
              {loading ? 'Checking...' : 'Track'}
            </button>
          </form>
          {!isFirebaseConfigured && <FirebaseSetupNotice />}
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        {loading && (
          <div className="glass-panel flex justify-center rounded-2xl p-10">
            <div className="loader" />
          </div>
        )}

        {record && (
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-panel premium-card rounded-3xl p-5 sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200/70">Tracking ID</p>
                <h2 className="mt-1 text-3xl font-extrabold text-white">{record.trackingId}</h2>
              </div>
              <StatusBadge status={record.status} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Detail icon={Cpu} label="Product" value={record.productName} />
              <Detail icon={ShieldCheck} label="Brand" value={record.brand} />
              <Detail icon={Wrench} label="Service Type" value={record.serviceType} />
              <Detail icon={UserRoundCog} label="Handled By" value={record.technicianName} />
              <Detail icon={CalendarClock} label="Expected Date" value={record.expectedDate} />
              <Detail icon={Headphones} label="Customer" value={record.customerName} />
            </div>

            <div className="mt-7">
              <h3 className="mb-4 text-lg font-extrabold text-white">Status Timeline</h3>
              <StatusTimeline currentStatus={record.status} serviceType={record.serviceType} />
            </div>
          </motion.div>
        )}

        {!record && !loading && (
          <div className="text-center text-sm text-slate-500">
            Staff member? <Link to="/admin/login" className="font-bold text-cyan-200">Open admin dashboard</Link>
          </div>
        )}
      </section>
    </main>
  );
}
