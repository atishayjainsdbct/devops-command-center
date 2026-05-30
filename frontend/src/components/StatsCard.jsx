export default function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h3 className="text-slate-400 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold text-cyan-400 mt-2">
        {value}
      </p>
    </div>
  );
}