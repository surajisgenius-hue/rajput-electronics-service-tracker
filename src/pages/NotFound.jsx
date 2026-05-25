import { Link } from 'react-router-dom';
import BrandHeader from '../components/BrandHeader.jsx';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-showroom-grid bg-[size:42px_42px]">
      <BrandHeader />
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-5xl font-extrabold">404</h1>
        <p className="mt-4 text-slate-300">This page is not available.</p>
        <Link to="/" className="btn-primary mt-8 px-6 py-3">
          Back to Tracking
        </Link>
      </section>
    </main>
  );
}
