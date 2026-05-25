import { Link } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';

export default function BrandHeader({ admin = false, onLogout }) {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon-blue/40 bg-white p-1.5 shadow-glow transition-transform duration-200 hover:scale-105">
          <img src="/rajput-logo.png" alt="Rajput Electronics logo" className="h-full w-full object-contain" />
        </span>
        <span>
          <span className="block text-lg font-extrabold tracking-wide text-white sm:text-xl">
            Rajput Electronics
          </span>
          <span className="block text-xs font-medium uppercase tracking-[0.24em] text-cyan-200/70">
            Premium Service Care
          </span>
        </span>
      </Link>

      {admin ? (
        <button onClick={onLogout} className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <LogOut size={16} />
          Logout
        </button>
      ) : (
        <Link to="/admin/login" className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm">
          <ShieldCheck size={16} />
          Staff Login
        </Link>
      )}
    </header>
  );
}
