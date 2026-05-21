import { useState, useContext } from "react";
import { FaSearch, FaDownload, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DataContext } from "../context/DataContext";
import Layout from "../components/Layout";

const PAGE_SIZE = 10;

export default function Transactions() {
  const { datasetUploaded, transactions } = useContext(DataContext);
  const allData = transactions;

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTx, setSelectedTx] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const filteredData = allData.filter((item) => {
    const matchesSearch = (item.transactionId || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRisk = riskFilter === "All" || item.risk === riskFilter;

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <Layout active="Transaction Explorer">
      {/* TOPBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-1px",
              color: "#1E3A8A",
              marginBottom: "8px"
            }}
          >
            Transaction Explorer
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Query, filter, and audit money laundering indicators across entities
          </p>
        </div>

        {/* CONTROLS */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          {/* SEARCH */}
          <div
            className="corporate-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "10px",
              background: "#FFFFFF"
            }}
          >
            <FaSearch color="#1E3A8A" />
            <input
              type="text"
              placeholder="Search hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#0F172A",
                padding: 0,
                fontSize: "14px",
                width: "160px"
              }}
            />
          </div>

          {/* RISK */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">All Risks</option>
            <option value="High Risk">High Risk</option>
            <option value="Medium Risk">Medium Risk</option>
            <option value="Low Risk">Low Risk</option>
          </select>

          {/* STATUS */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">All Statuses</option>
            <option value="Flagged">Flagged</option>
            <option value="Monitor">Monitor</option>
            <option value="Safe">Safe</option>
          </select>

          {/* EXPORT */}
          <button className="neon-btn" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", background: "#1E3A8A", color: "#FFFFFF" }}>
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!datasetUploaded && (
        <div className="corporate-card" style={{ padding: "80px 40px", textAlign: "center", background: "#FFFFFF" }}>
          <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No Dataset Uploaded Yet</h2>
          <p style={{ color: "#475569", fontSize: "17px" }}>
            Upload a transaction dataset to populate the explorer records.
          </p>
        </div>
      )}

      {/* TABLE */}
      {datasetUploaded && (
        <div className="corporate-card" style={{ overflow: "hidden", background: "#FFFFFF" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <tr>
                  {["Transaction ID", "Amount (BTC)", "Risk Level", "Threat Score", "Status"].map((head) => (
                    <th
                      key={head}
                      style={{
                        padding: "18px 24px",
                        textAlign: "left",
                        color: "#475569",
                        fontWeight: "600",
                        fontSize: "13px",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showAll ? filteredData : filteredData.slice(0, PAGE_SIZE)).map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedTx(item)}
                    style={{
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ ...cellStyle, fontFamily: "monospace", color: "#1E3A8A", fontWeight: "600" }}>
                      {item.transactionId}
                    </td>
                    <td style={{ ...cellStyle, fontWeight: "600", color: "#0F172A" }}>
                      {item.amount}
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          background:
                            item.risk === "High Risk"
                              ? "rgba(220,38,38,0.08)"
                              : item.risk === "Medium Risk"
                              ? "rgba(217,119,6,0.08)"
                              : "rgba(5,150,105,0.08)",
                          color:
                            item.risk === "High Risk"
                              ? "#DC2626"
                              : item.risk === "Medium Risk"
                              ? "#D97706"
                              : "#059669",
                          border:
                            item.risk === "High Risk"
                              ? "1px solid rgba(220,38,38,0.2)"
                              : item.risk === "Medium Risk"
                              ? "1px solid rgba(217,119,6,0.2)"
                              : "1px solid rgba(5,150,105,0.2)",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          fontWeight: "600",
                          fontSize: "12px",
                          display: "inline-block"
                        }}
                      >
                        {item.risk || "Low"}
                      </span>
                    </td>
                    <td style={{ ...cellStyle, color: "#475569" }}>
                      {item.score ? `${Math.round(parseFloat(item.score) * 100)}%` : "0%"}
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          background:
                            item.status === "Flagged"
                              ? "rgba(220,38,38,0.08)"
                              : item.status === "Monitor"
                              ? "rgba(217,119,6,0.08)"
                              : "rgba(5,150,105,0.08)",
                          color:
                            item.status === "Flagged"
                              ? "#DC2626"
                              : item.status === "Monitor"
                              ? "#D97706"
                              : "#059669",
                          padding: "4px 10px",
                          borderRadius: "10px",
                          fontWeight: "600",
                          fontSize: "12px"
                        }}
                      >
                        {item.status || "Safe"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VIEW ALL TOGGLE */}
          {filteredData.length > PAGE_SIZE && (
            <div style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
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
                {showAll ? "Collapse" : `View All ${filteredData.length} Records`}
              </button>
            </div>
          )}

          {/* PAGINATION */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              borderTop: "1px solid #E2E8F0",
              flexWrap: "wrap",
              gap: "20px"
            }}
          >
            <p style={{ color: "#475569", fontSize: "14px" }}>
              Showing {filteredData.length} records
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={pageButtonStyle}>Previous</button>
              <button style={{ ...pageButtonStyle, background: "#E2E8F0", color: "#1E3A8A", border: "1px solid #CBD5E1", fontWeight: "700" }}>1</button>
              <button style={pageButtonStyle}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedTx && (
        <div
          onClick={() => setSelectedTx(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="corporate-card"
            style={{
              width: "500px",
              padding: "35px",
              position: "relative",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0"
            }}
          >
            <button
              onClick={() => setSelectedTx(null)}
              style={{
                position: "absolute",
                top: "25px",
                right: "25px",
                background: "transparent",
                color: "#64748B",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0F172A"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
            >
              <FaTimes size={18} />
            </button>

            <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "30px", color: "#0F172A" }}>
              AML Case Investigation
            </h2>

            <Detail title="Transaction ID (Hash)" value={selectedTx.transactionId} mono />
            <Detail title="Sender Wallet Address" value={selectedTx.sender || "—"} mono />
            <Detail title="Receiver Wallet Address" value={selectedTx.receiver || "—"} mono />
            <Detail title="Risk Evaluation" value={`${selectedTx.risk} (${selectedTx.score ? Math.round(parseFloat(selectedTx.score) * 100) : 0}% Confidence Score)`} color={selectedTx.risk === "High Risk" ? "#DC2626" : selectedTx.risk === "Medium Risk" ? "#D97706" : "#059669"} />
            <Detail title="Investigation Status" value={selectedTx.status || "Safe"} />
            <Detail title="Calculated Anomaly Score" value={selectedTx.anomalyScore ? selectedTx.anomalyScore.toFixed(4) : "0.1245"} />
          </div>
        </div>
      )}
    </Layout>
  );
}

function Detail({ title, value, mono, color }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ color: "#64748B", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
        {title}
      </p>
      <h4
        style={{
          color: color || "#0F172A",
          fontSize: "15px",
          fontFamily: mono ? "monospace" : "inherit",
          margin: 0,
          fontWeight: "600",
          wordBreak: "break-all"
        }}
      >
        {value}
      </h4>
    </div>
  );
}

const cellStyle = {
  padding: "16px 24px",
  color: "#334155",
  fontSize: "14px"
};

const selectStyle = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid #D1D5DB",
  background: "#FFFFFF",
  color: "#0F172A",
  fontSize: "14px",
  outline: "none",
  cursor: "pointer"
};

const pageButtonStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #D1D5DB",
  background: "#FFFFFF",
  color: "#475569",
  cursor: "pointer",
  fontSize: "13px"
};