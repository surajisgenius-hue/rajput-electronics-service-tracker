import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import BrandHeader from '../components/BrandHeader.jsx';
import FirebaseSetupNotice from '../components/FirebaseSetupNotice.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { firebaseReady, login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-showroom-grid bg-[size:42px_42px]">
      <BrandHeader />
      <section className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {!firebaseReady ? (
          <FirebaseSetupNotice />
        ) : (
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="glass-panel w-full max-w-md rounded-3xl p-7"
        >
          <div className="mb-7 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-blue/30 bg-neon-blue/10 text-neon-blue">
              <ShieldCheck size={28} />
            </span>
            <h1 className="text-3xl font-extrabold">Staff Login</h1>
            <p className="mt-2 text-sm text-slate-400">Secure access for Rajput Electronics team.</p>
          </div>

          <label className="mb-4 block space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Mail size={14} />
              Email
            </span>
            <input
              type="email"
              className="field px-4 py-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="mb-6 block space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <LockKeyhole size={14} />
              Password
            </span>
            <input
              type="password"
              className="field px-4 py-3"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <button disabled={loading} className="btn-primary w-full px-5 py-3 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </motion.form>
        )}
      </section>
    </main>
  );
}
