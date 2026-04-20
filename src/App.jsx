import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [keyword, setKeyword] = useState("");

  const [parallelResult, setParallelResult] = useState(null);
  const [serialResult, setSerialResult] = useState(null);

  const [parallelTime, setParallelTime] = useState(null);
  const [serialTime, setSerialTime] = useState(null);

  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_PIPELINE_GATEWAY_URL;

  const handleUpload = async () => {
    if (!file || !keyword) {
      alert("Please select a file and enter a keyword");
      return;
    }

    setLoading(true);

    // prepare form data
    const formData1 = new FormData();
    formData1.append("file", file);
    formData1.append("keyword", keyword);

    const formData2 = new FormData();
    formData2.append("file", file);
    formData2.append("keyword", keyword);

    try {
      // 🔥 PARALLEL API CALL
      const startParallel = performance.now();

      const resParallel = await fetch(`${BASE_URL}/process`, {
        method: "POST",
        body: formData1,
      });

      const dataParallel = await resParallel.json();

      const endParallel = performance.now();

      // 🔥 SERIAL API CALL
      const startSerial = performance.now();

      const resSerial = await fetch(`${BASE_URL}/process_serial`, {
        method: "POST",
        body: formData2,
      });

      const dataSerial = await resSerial.json();

      const endSerial = performance.now();

      // store results
      setParallelResult(dataParallel);
      setSerialResult(dataSerial);

      setParallelTime((endParallel - startParallel).toFixed(2));
      setSerialTime((endSerial - startSerial).toFixed(2));

    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔍 Parallel vs Serial Search</h1>

      {/* File Upload */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      {/* Keyword Input */}
      <input
        type="text"
        placeholder="Enter keyword (e.g. Dhruv)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Processing..." : "Run Comparison"}
      </button>

      {/* RESULTS */}
      {parallelResult && serialResult && (
        <div className="result">

          <h2>Keyword: {keyword}</h2>

          <h3>⚡ Parallel Result</h3>
          <p>Total Matches: {parallelResult.total_matches}</p>
          <p>Time Taken: {parallelTime} ms</p>

          <h3>🐢 Serial Result</h3>
          <p>Total Matches: {serialResult.total_matches}</p>
          <p>Time Taken: {serialTime} ms</p>

          <h3>📊 Performance Difference</h3>
          <p>
            Speed Improvement:{" "}
            {(serialTime - parallelTime).toFixed(2)} ms faster
          </p>

        </div>
      )}
    </div>
  );
}

export default App;