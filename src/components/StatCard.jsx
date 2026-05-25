export default function StatCard({ icon: Icon, label, value, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-cyan-400/20 text-cyan-100 border-cyan-300/20',
    violet: 'from-violet-400/20 text-violet-100 border-violet-300/20',
    green: 'from-emerald-400/20 text-emerald-100 border-emerald-300/20',
    amber: 'from-amber-400/20 text-amber-100 border-amber-300/20'
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-slate-950/70 p-5 ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">{label}</span>
        <Icon size={22} />
      </div>
      <p className="mt-4 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}
