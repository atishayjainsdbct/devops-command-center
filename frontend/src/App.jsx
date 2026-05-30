import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [pods, setPods] = useState([]);

  useEffect(() => {
    console.log("Fetching pods...");

    api.get("/pods")
      .then((response) => {
        console.log("API RESPONSE:", response.data);
        console.log("COUNT:", response.data.length);

        setPods(response.data);
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  }, []);

  return (
    <div>
      <div style={{ padding: "20px" }}>
  <h1>DevOps Command Center</h1>

  <h2>Total Pods: {pods.length}</h2>

  <table border="1" cellPadding="10">
    <thead>
      <tr>
        <th>Name</th>
        <th>Namespace</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {pods.map((pod) => (
        <tr key={pod.name}>
          <td>{pod.name}</td>
          <td>{pod.namespace}</td>
          <td>{pod.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default App;