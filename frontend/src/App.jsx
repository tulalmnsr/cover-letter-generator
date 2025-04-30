import React, { useState } from "react";

export default function App() {
  const [pdfFiles, setPdfFiles] = useState([]); // Store all PDFs uploaded
  const [csvFile, setCsvFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the PDF file selection
  const handlePdfChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setPdfFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult("");

    const formData = new FormData();
    pdfFiles.forEach((file) => formData.append("pdfs", file));
    formData.append("csv", csvFile);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      if (!res.ok) {
        setError(text);
      } else {
        setResult(text);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        AI Cover Letter Generator
      </h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <strong>Upload Past Cover Letters (PDF) [Required]</strong>:
        </label>
        <br />
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handlePdfChange}
        />
      </div>

      <div>
        {pdfFiles.length > 0 && (
          <div>
            <h3>Uploaded PDFs:</h3>
            <ul>
              {pdfFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <strong>Upload Job URLs CSV</strong>:
        </label>
        <br />
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !csvFile || pdfFiles.length < 3}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: pdfFiles.length < 3 || !csvFile ? "#999" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: pdfFiles.length < 3 || !csvFile ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {pdfFiles.length < 3 && (
        <p style={{ color: "red", marginTop: "0.5rem" }}>
          Please upload at least 3 PDF cover letters.
        </p>
      )}

      {error && (
        <pre
          style={{
            background: "#ffe5e5",
            color: "#900",
            padding: "1rem",
            marginTop: "1rem",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </pre>
      )}

      {result && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            marginTop: "1rem",

            borderRadius: "6px",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
