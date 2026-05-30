import { useEffect, useState } from "react";
import api from "./services/api";

import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import PodsTable from "./components/PodsTable";

function App() {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    api.get("/pods")
      .then((response) => {
        setPods(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
            value="1"
          />

          <StatsCard
            title="Namespaces"
            value="3"
          />
        </div>

        <PodsTable pods={pods} />
      </div>
    </div>
  );
}

export default App;