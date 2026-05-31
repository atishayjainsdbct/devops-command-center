export default function LogsViewer({
  selectedPod,
  logs,
  onClose,
}) {
  if (!selectedPod) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-11/12 h-5/6 flex flex-col shadow-2xl">

        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            Logs - {selectedPod}
          </h2>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <pre className="h-full overflow-auto bg-black text-green-400 p-4 text-sm font-mono">
            {logs}
          </pre>
        </div>

      </div>
    </div>
  );
}