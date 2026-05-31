import {
  LayoutDashboard,
  Boxes,
  Rocket,
  FileText,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-6">
      <h1 className="text-cyan-400 text-2xl font-bold mb-10">
        DevOps Command Center
      </h1>

      <ul className="space-y-5 text-slate-300">
        <li className="flex items-center gap-3 hover:text-cyan-400 cursor-pointer">
          <LayoutDashboard size={20} />
          Dashboard
        </li>

        <li className="flex items-center gap-3 hover:text-cyan-400 cursor-pointer">
          <Boxes size={20} />
          Pods
        </li>

        <li className="flex items-center gap-3 hover:text-cyan-400 cursor-pointer">
          <Rocket size={20} />
          Deployments
        </li>

        <li className="flex items-center gap-3 hover:text-cyan-400 cursor-pointer">
          <FileText size={20} />
          Logs
        </li>

        <li className="flex items-center gap-3 hover:text-cyan-400 cursor-pointer">
          <Bell size={20} />
          Events
        </li>
      </ul>
    </div>
  );
}