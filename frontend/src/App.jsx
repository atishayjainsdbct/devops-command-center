import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import api from "./services/api";
import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import PodsTable from "./components/PodsTable";
import DeploymentsTable from "./components/DeploymentsTable";
import LogsViewer from "./components/LogsViewer";
import EventsTable from "./components/EventsTable";

function App() {
  const [pods, setPods] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [logs, setLogs] = useState("");
  const [selectedPod, setSelectedPod] = useState("");
  const [events, setEvents] = useState([]);
  const [podSearch, setPodSearch] = useState("");
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deploymentSearch, setDeploymentSearch] = useState("");
  const [selectedNamespace, setSelectedNamespace] =
  useState("");
  const [lastRefresh, setLastRefresh] = useState(
    new Date().toLocaleTimeString()
  );

 const fetchData = async () => {

  try {

    setLoading(true);

    const podsResponse = await api.get(
      selectedNamespace
        ? `/pods?namespace=${selectedNamespace}`
        : "/pods"
    );

    setPods(podsResponse.data);

    const eventsResponse = await api.get("/events");
    setEvents(eventsResponse.data);

    const deploymentsResponse = await api.get("/deployments");
    setDeployments(deploymentsResponse.data);

    const namespacesResponse = await api.get("/namespaces");
    setNamespaces(namespacesResponse.data);

    const healthResponse = await api.get("/health");
    setHealth(healthResponse.data);

    setLastRefresh(
      new Date().toLocaleTimeString()
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to refresh dashboard"
    );

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedNamespace]);
  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white text-2xl font-bold">
      Loading DevOps Command Center...
    </div>
  );
}

  const handleScale = async (deployment) => {
    const replicas = prompt(
      `Enter replicas for ${deployment.name}`
    );

    if (!replicas) return;

    try {
      await api.post("/deployments/scale", {
        deployment_name: deployment.name,
        namespace: deployment.namespace,
        replicas: Number(replicas),
      });

      toast.success("Deployment scaled successfully!");

      fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Scaling failed");
    }
  };

  const handleRestart = async (deployment) => {
    const confirmed = window.confirm(
      `Restart deployment ${deployment.name}?`
    );

    if (!confirmed) return;

    try {
      await api.post("/deployments/restart", {
        deployment_name: deployment.name,
        namespace: deployment.namespace,
      });

      toast.success("Deployment restarted successfully!");

      fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Restart failed");
    }
  };

  const handleRollback = async (deployment) => {
    const confirmed = window.confirm(
      `Rollback deployment ${deployment.name}?`
    );

    if (!confirmed) return;

    try {
      await api.post("/deployments/rollback", {
        deployment_name: deployment.name,
        namespace: deployment.namespace,
      });

      toast.success("Deployment rollback successful!");

      fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Rollback failed");
    }
  };

  const handleViewLogs = async (pod) => {
    try {
      const response = await api.get(
        `/logs/${pod.namespace}/${pod.name}`
      );

      setLogs(response.data.logs);
      setSelectedPod(pod.name);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch logs");
    }
  };

  const handleCloseLogs = () => {
    setSelectedPod("");
    setLogs("");
  };

  const filteredPods = pods.filter((pod) =>
    pod.name
      .toLowerCase()
      .includes(podSearch.toLowerCase())
  );

  const filteredDeployments = deployments.filter(
    (deployment) =>
      deployment.name
        .toLowerCase()
        .includes(deploymentSearch.toLowerCase())
  );

  return (
  <div className="flex bg-slate-950 text-white min-h-screen">

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0f172a",
          color: "#fff",
          border: "1px solid #334155",
        },
      }}
   />
      <Sidebar />

      <div className="flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>


<p className="text-slate-400 mt-2">
  Last Refresh: {lastRefresh}
</p>
<div className="mt-4">
  <label className="block text-sm text-slate-400 mb-2">
    Namespace Filter
  </label>

  <select
    value={selectedNamespace}
    onChange={(e) =>
      setSelectedNamespace(e.target.value)
    }
    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
  >
    <option value="">
      All Namespaces
    </option>

    {namespaces.map((ns) => (
      <option key={ns} value={ns}>
        {ns}
      </option>
    ))}
  </select>
</div>
</div>

        <div className="grid grid-cols-3 gap-6">
          <StatsCard
            title="Total Pods"
            value={pods.length}
          />

          <StatsCard
            title="Deployments"
            value={deployments.length}
          />

          <StatsCard
            title="Namespaces"
            value={namespaces.length}
          />
        </div>

            {health && (
      <div className="grid grid-cols-4 gap-6 mt-6">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400">
            API Health
          </h3>

          <p className="text-2xl font-bold text-green-400 mt-2">
            {health.api_status}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400">
            Cluster
          </h3>

          <p className="text-2xl font-bold mt-2">
            {health.cluster_connected
              ? "Connected"
              : "Disconnected"}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-slate-400">
            Nodes Ready
          </h3>

          <p className="text-2xl font-bold mt-2">
            {health.ready_nodes}/
            {health.total_nodes}
          </p>
        </div>

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-slate-400">
        Failed Pods
      </h3>

      <p className="text-2xl font-bold text-red-400 mt-2">
        {health.failed_pods}
      </p>
    </div>

  </div>
)}
        <input
          type="text"
          placeholder="🔍 Search Pods..."
          value={podSearch}
          onChange={(e) => setPodSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mt-6 mb-4"
        />

        <PodsTable
          pods={filteredPods}
          onViewLogs={handleViewLogs}
        />

        <LogsViewer
          selectedPod={selectedPod}
          logs={logs}
          onClose={handleCloseLogs}
        />

        <input
          type="text"
          placeholder="🔍 Search Deployments..."
          value={deploymentSearch}
          onChange={(e) => setDeploymentSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 mt-6 mb-4"
        />

        <DeploymentsTable
          deployments={filteredDeployments}
          onScale={handleScale}
          onRestart={handleRestart}
          onRollback={handleRollback}
        />

        <EventsTable
          events={events}
        />

      </div>
    </div>
  );
}

export default App;