import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3007/api/v1/health")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setMessage("Không kết nối được Backend");
      });
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Clinic Booking</h1>

      <p>Backend response:</p>

      <strong>{message}</strong>
    </div>
  );
}

export default App;