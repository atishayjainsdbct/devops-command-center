export default function EventsTable({ events }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">
        Kubernetes Events
      </h2>

      <div className="overflow-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="pb-3 w-24">Type</th>
                <th className="pb-3 w-32">Reason</th>
                <th className="pb-3 w-40">Namespace</th>
                <th className="pb-3 w-80">Object</th>
                <th className="pb-3">Message</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event, index) => (
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="py-3">
                  <span
                    className={
                      event.type === "Warning"
                        ? "bg-red-500/20 text-red-400 px-3 py-1 rounded-full"
                        : "bg-green-500/20 text-green-400 px-3 py-1 rounded-full"
                    }
                  >
                    {event.type}
                  </span>
                </td>

                <td>{event.reason}</td>

                <td>{event.namespace}</td>

                <td className="break-words"> {event.object} </td>
                <td className="break-words">
                  {event.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}