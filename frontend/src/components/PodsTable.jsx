export default function PodsTable({ pods }) {
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
          </tr>
        </thead>

        <tbody>
          {pods.map((pod) => (
            <tr key={pod.name} className="border-b border-slate-800">
              <td className="py-3">{pod.name}</td>
              <td>{pod.namespace}</td>
              <td className="text-green-400">{pod.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}