import { useState,loadEnv } from "react";
import "./App.css";

const env = loadEnv(mode, process.cwd())


function App() {
  const [file, setFile] = useState(null);
  const [keyword, setKeyword] = useState("");   // 🔥 NEW
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !keyword) {
      alert("Please select a file and enter a keyword");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("keyword", keyword);   // 🔥 NEW

    setLoading(true);

    try {
      const res = await fetch(env.VITE_PIPELINE_GATEWAY_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔍 Parallel Search System</h1>

      {/* File Upload */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      {/* 🔥 Keyword Input */}
      <input
        type="text"
        placeholder="Enter keyword (e.g. ai)"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Processing..." : "Search"}
      </button>

      {result && (
        <div className="result">
          <h2>Keyword: {result.keyword}</h2>
          <h3>Total Matches: {result.total_matches}</h3>

          <h3>Sample Output:</h3>
          <ul>
            {result.sample_output.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;