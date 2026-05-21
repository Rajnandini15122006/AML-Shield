import { useContext, useState } from "react";
import { FaHistory, FaFilter, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

const PAGE_SIZE = 10;

export default function History() {
  const { datasetUploaded, transactions } = useContext(DataContext);
  const [riskFilter, setRiskFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = transactions.filter((tx) =>
    riskFilter === "All" ? true : tx.risk === riskFilter
  );

  const handleExportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Transaction ID", "Sender Wallet", "Receiver Wallet", "Amount (BTC)", "Threat Risk", "Status", "Ingestion Date"];
    const rows = filtered.map(tx => [
      tx.transactionId || "",
      tx.sender || "",
      tx.receiver || "",
      tx.amount || "",
      tx.risk || "",
      tx.status || "",
      tx.createdAt ? new Date(tx.createdAt).toISOString() : ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AML_Audit_Logs_${riskFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const riskColor = (risk) =>
    risk === "High Risk" ? "#DC2626" : risk === "Medium Risk" ? "#D97706" : "#059669";
  const riskBg = (risk) =>
    risk === "High Risk" ? "rgba(220,38,38,0.06)" : risk === "Medium Risk" ? "rgba(217,119,6,0.06)" : "rgba(5,150,105,0.06)";
  const riskBorder = (risk) =>
    risk === "High Risk" ? "rgba(220,38,38,0.15)" : risk === "Medium Risk" ? "rgba(217,119,6,0.15)" : "rgba(5,150,105,0.15)";
  const statusColor = (status) =>
    status === "Flagged" ? "#DC2626" : status === "Monitor" ? "#D97706" : "#059669";

  return (
    <Layout active="History">
      {/* TOPBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#1E3A8A",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}
          >
            <FaHistory size={28} color="#1E3A8A" /> Audit Logs & History
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>Full chronological threat ledger and compliance reporting history</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Filter */}
          <div
            className="corporate-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "10px",
              background: "#FFFFFF"
            }}
          >
            <FaFilter color="#1E3A8A" size={12} />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                background: "transparent",
                color: "#0F172A",
                cursor: "pointer"
              }}
            >
              <option value="All">All Risks</option>
              <option value="High Risk">High Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="Low Risk">Low Risk</option>
            </select>
          </div>

          {/* Export */}
          <button 
            onClick={handleExportCSV}
            className="neon-btn" 
            style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", background: "#1E3A8A", color: "#FFFFFF" }}
          >
            <FaDownload /> Export Audit
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!datasetUploaded && (
        <div className="corporate-card" style={{ padding: "80px 40px", textAlign: "center", background: "#FFFFFF" }}>
          <FaHistory size={50} color="#94A3B8" style={{ marginBottom: "24px" }} />
          <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No History Yet</h2>
          <p style={{ color: "#475569", fontSize: "17px" }}>Upload a transaction dataset to view the full audit history.</p>
        </div>
      )}

      {/* HISTORY TABLE */}
      {datasetUploaded && (
        <div className="corporate-card" style={{ overflow: "hidden", background: "#FFFFFF" }}>
          {/* Summary bar */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", gap: "25px", flexWrap: "wrap", fontSize: "14px" }}>
            <span style={{ color: "#475569" }}>Total Audit Trail: <strong style={{ color: "#0F172A" }}>{filtered.length}</strong> records</span>
            <span style={{ color: "#DC2626", fontWeight: "600" }}>High Threat: <strong>{filtered.filter(t => t.risk === "High Risk").length}</strong></span>
            <span style={{ color: "#D97706", fontWeight: "600" }}>Suspicious: <strong>{filtered.filter(t => t.risk === "Medium Risk").length}</strong></span>
            <span style={{ color: "#059669", fontWeight: "600" }}>Cleared: <strong>{filtered.filter(t => t.risk === "Low Risk").length}</strong></span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <tr>
                  {["#", "Transaction ID", "Sender Wallet", "Receiver Wallet", "Amount (BTC)", "Threat", "Decision Status", "Ingested Date"].map((h) => (
                    <th key={h} style={{ padding: "16px 20px", textAlign: "left", color: "#475569", fontWeight: "600", fontSize: "13px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showAll ? filtered : filtered.slice(0, PAGE_SIZE)).map((tx, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 20px", color: "#94A3B8", fontSize: "14px" }}>{i + 1}</td>
                    <td style={{ padding: "16px 20px", color: "#1E3A8A", fontWeight: "600", fontSize: "14px", fontFamily: "monospace" }}>
                      {tx.transactionId || "—"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#334155", fontSize: "14px", fontFamily: "monospace" }}>
                      {tx.sender || "—"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#334155", fontSize: "14px", fontFamily: "monospace" }}>
                      {tx.receiver || "—"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#0F172A", fontWeight: "700", fontSize: "14px" }}>
                      {tx.amount}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          background: riskBg(tx.risk),
                          color: riskColor(tx.risk),
                          border: `1px solid ${riskBorder(tx.risk)}`,
                          padding: "4px 10px",
                          borderRadius: "10px",
                          fontWeight: "600",
                          fontSize: "12px"
                        }}
                      >
                        {tx.risk || "Low Risk"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ color: statusColor(tx.status), fontWeight: "600", fontSize: "13px" }}>
                        {tx.status || "Safe"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748B", fontSize: "13px" }}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VIEW ALL TOGGLE */}
          {filtered.length > PAGE_SIZE && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
              <button
                onClick={() => setShowAll(!showAll)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 28px",
                  borderRadius: "10px",
                  border: "1px solid #1E3A8A",
                  background: "transparent",
                  color: "#1E3A8A",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1E3A8A"; e.currentTarget.style.color = "#FFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1E3A8A"; }}
              >
                {showAll ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                {showAll ? "Collapse" : `View All ${filtered.length} Audit Entries`}
              </button>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: "18px 24px", borderTop: "1px solid #E2E8F0", color: "#475569", fontSize: "13px" }}>
            Showing {filtered.length} of {transactions.length} audit records
          </div>
        </div>
      )}
    </Layout>
  );
}