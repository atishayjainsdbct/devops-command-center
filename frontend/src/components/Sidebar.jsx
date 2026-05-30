export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
      <h1 className="text-cyan-400 text-2xl font-bold mb-10">
        DevOps Command Center
      </h1>

      <ul className="space-y-5 text-slate-300">
        <li className="hover:text-cyan-400 cursor-pointer">Dashboard</li>
        <li className="hover:text-cyan-400 cursor-pointer">Pods</li>
        <li className="hover:text-cyan-400 cursor-pointer">Deployments</li>
        <li className="hover:text-cyan-400 cursor-pointer">Logs</li>
        <li className="hover:text-cyan-400 cursor-pointer">Events</li>
      </ul>
    </div>
  );
}