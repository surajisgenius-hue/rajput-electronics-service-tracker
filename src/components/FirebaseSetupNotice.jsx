import { DatabaseZap } from 'lucide-react';

export default function FirebaseSetupNotice() {
  return (
    <div className="glass-panel mx-auto mt-8 max-w-3xl rounded-2xl p-6 text-left">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neon-blue/30 bg-neon-blue/10 text-neon-blue">
          <DatabaseZap size={24} />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-white">Firebase setup required</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            The website is running, but Firebase environment values are missing. Create a `.env` file from
            `.env.example`, add your Firebase project values, then restart the dev server.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-cyan-100">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
          </pre>
        </div>
      </div>
    </div>
  );
}
