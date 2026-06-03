export default function PodsTable({
  pods,
  onViewLogs,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Pods
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-700">
            <th className="pb-3">Name</th>
            <th className="pb-3">Namespace</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>

       <tbody>

          {pods.length === 0 ? (

       <tr>
       <td
        colSpan="4"
        className="text-center py-8 text-slate-400"
      >
        No Pods Found
      </td>
    </tr>
    ):
    
   (pods.map((pod) => (
      <tr
        key={pod.name}
        className="border-b border-slate-800"
      >
        <td className="py-3">
          {pod.name}
        </td>

        <td>
          {pod.namespace}
        </td>

        <td>
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
            {pod.status}
          </span>
        </td>

        <td>
          <button
            onClick={() => onViewLogs(pod)}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg"
          >
            Logs
          </button>
        </td>
      </tr>
    ))

  )}

</tbody>
      </table>
    </div>
  );
}