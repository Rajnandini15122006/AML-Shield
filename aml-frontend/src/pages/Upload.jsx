import { useState, useContext } from "react";
import { FaCloudUploadAlt, FaCheckCircle, FaSpinner, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

export default function Upload() {
  const { datasetUploaded, fetchTransactions } = useContext(DataContext);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setErrorMsg("Invalid file format. Please upload a CSV, XLSX, or XLS file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      setErrorMsg("Upload failed. Please ensure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Layout active="Upload Dataset">
      {/* TOPBAR */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "-1px",
            color: "#1E3A8A",
            marginBottom: "8px"
          }}
        >
          Data Ingestion Console
        </h1>
        <p style={{ color: "#475569", fontSize: "15px" }}>
          Ingest cryptocurrency node networks, transaction logs, and ledger data
        </p>
      </div>

      {/* MAIN UPLOAD CARD */}
      <div className="corporate-card" style={{ padding: "40px", background: "#FFFFFF" }}>
        
        {/* DRAG AND DROP ZONE */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{
            border: dragActive ? "2px dashed #1E3A8A" : "2px dashed #CBD5E1",
            borderRadius: "20px",
            padding: "80px 40px",
            textAlign: "center",
            background: dragActive ? "rgba(30, 58, 138, 0.03)" : "#F8FAFC",
            transition: "all 0.2s ease-in-out",
            position: "relative",
            cursor: "pointer"
          }}
        >
          <input
            type="file"
            id="file-upload-input"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <label htmlFor="file-upload-input" style={{ cursor: "pointer", width: "100%", height: "100%", display: "block" }}>
            <FaCloudUploadAlt size={70} color={dragActive ? "#1E3A8A" : "#64748B"} style={{ marginBottom: "20px", transition: "color 0.2s" }} />
            <h3 style={{ color: "#0F172A", fontSize: "20px", marginBottom: "10px", fontWeight: "700" }}>
              Drag and drop transaction dataset here
            </h3>
            <p style={{ color: "#64748B", marginBottom: "25px", fontSize: "14px" }}>or click to browse local files</p>
            <span className="neon-btn" style={{ padding: "12px 28px", display: "inline-block", background: "#1E3A8A", color: "#FFFFFF" }}>
              Select File
            </span>
          </label>
        </div>

        {/* STATUS AND MESSAGES */}
        {(loading || success || errorMsg) && (
          <div
            className="corporate-card"
            style={{
              marginTop: "30px",
              padding: "20px 25px",
              background: "#FFFFFF",
              border: success
                ? "1px solid rgba(16, 185, 129, 0.3)"
                : errorMsg
                ? "1px solid rgba(220, 38, 38, 0.3)"
                : "1px solid rgba(30, 58, 138, 0.3)"
            }}
          >
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#1E3A8A" }}>
                <FaSpinner className="spin" size={24} style={{ animation: "spin 1s linear infinite" }} />
                <div>
                  <span style={{ fontWeight: "700", color: "#0F172A" }}>Ingesting {fileName}...</span>
                  <p style={{ color: "#475569", fontSize: "13px", margin: "4px 0 0" }}>Running graph neural node categorization, feature engineering, and threat classifications...</p>
                </div>
              </div>
            )}

            {success && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#059669" }}>
                <FaCheckCircle size={26} />
                <div>
                  <span style={{ fontWeight: "700", color: "#0F172A" }}>Ingestion Successful: {fileName}</span>
                  <p style={{ color: "#475569", fontSize: "13px", margin: "4px 0 0" }}>Ledger details successfully mapped and risk scored. Navigate to the overview map or explorer dashboard to inspect details.</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "#DC2626" }}>
                <div style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>!</div>
                <div>
                  <span style={{ fontWeight: "700", color: "#0F172A" }}>Data Ingestion Error</span>
                  <p style={{ color: "#475569", fontSize: "13px", margin: "4px 0 0" }}>{errorMsg}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADDITIONAL INFORMATION */}
        <div style={{ marginTop: "40px", borderTop: "1px solid #E2E8F0", paddingTop: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
            <FaInfoCircle color="#1E3A8A" />
            <h3 style={{ color: "#0F172A", fontSize: "16px", fontWeight: "700", margin: 0 }}>Required Dataset Attributes</h3>
          </div>
          <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
            The ledger ingestion engine extracts relational node connections based on the following key headers:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            {[
              { name: "transactionId", desc: "Unique transaction identifier / hash" },
              { name: "sender / source", desc: "Originating wallet key address" },
              { name: "receiver / destination", desc: "Target recipient wallet key address" },
              { name: "amount", desc: "Volume of transaction (tokens / BTC)" },
              { name: "status", desc: "Transaction state (Flagged, Approved)" }
            ].map((col) => (
              <div key={col.name} style={{ background: "#F8FAFC", padding: "15px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                <code style={{ color: "#1E3A8A", fontWeight: "700", fontSize: "13px", fontFamily: "monospace" }}>{col.name}</code>
                <p style={{ color: "#475569", fontSize: "12px", margin: "5px 0 0", lineHeight: "1.4" }}>{col.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}