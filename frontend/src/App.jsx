import { useEffect, useState } from "react";
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

  useEffect(() => {
    api.get("/pods")
      .then((response) => {
        setPods(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
       
    api.get("/events")
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
 
 
      api.get("/deployments")
      .then((response) => {
        setDeployments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    api.get("/namespaces")
      .then((response) => {
        setNamespaces(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

      alert("Deployment scaled successfully!");

      const response = await api.get("/deployments");
      setDeployments(response.data);

    } catch (error) {
      console.error(error);
      alert("Scaling failed");
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

      alert("Deployment restarted successfully!");

      const response = await api.get("/deployments");
      setDeployments(response.data);

    } catch (error) {
      console.error(error);
      alert("Restart failed");
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
    alert("Failed to fetch logs");
  }
};

   const handleCloseLogs = () => {
       setSelectedPod("");
       setLogs("");
      };

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

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

<PodsTable
  pods={pods}
  onViewLogs={handleViewLogs}
/>

<LogsViewer
  selectedPod={selectedPod}
  logs={logs}
  onClose={handleCloseLogs}
/>
        <DeploymentsTable
          deployments={deployments}
          onScale={handleScale}
          onRestart={handleRestart}
        />
        <EventsTable events={events} />

      </div>
    </div>
  );
}

export default App;