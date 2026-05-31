export default function DeploymentsTable({
  deployments,
  onScale,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Deployments
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-700">
            <th className="pb-3">Name</th>
            <th className="pb-3">Namespace</th>
            <th className="pb-3">Replicas</th>
            <th className="pb-3">Available</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {deployments.map((deployment) => (
            <tr
              key={`${deployment.namespace}-${deployment.name}`}
              className="border-b border-slate-800"
            >
              <td className="py-3">{deployment.name}</td>

              <td>{deployment.namespace}</td>

              <td>{deployment.replicas}</td>

              <td>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  {deployment.available_replicas}
                </span>
              </td>

              <td>
                <button
                  onClick={() => onScale(deployment)}
                  className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg transition"
                >
                  Scale
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}