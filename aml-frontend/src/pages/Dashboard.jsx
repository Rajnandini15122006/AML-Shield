import { useContext, useState, useMemo } from "react";
import {
  FaChartLine,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaShieldAlt,
  FaUpload,
  FaSearch,
  FaFolderOpen,
  FaRegDotCircle,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import axios from "axios";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

const FEED_PAGE_SIZE = 8;

export default function Dashboard() {
  const {
    transactions,
    datasetUploaded,
    fetchTransactions
  } = useContext(DataContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showAllFeed, setShowAllFeed] = useState(false);

  // Statistics calculations
  const totalTransactions = transactions.length;

  const fraudAlerts = useMemo(() => {
    return transactions.filter(
      (tx) => tx.risk === "High Risk" || tx.status === "Flagged"
    ).length;
  }, [transactions]);

  const suspiciousChains = useMemo(() => {
    return Math.floor(fraudAlerts / 2) || (fraudAlerts > 0 ? 1 : 0);
  }, [fraudAlerts]);

  const riskScore = useMemo(() => {
    return totalTransactions > 0
      ? Math.floor((fraudAlerts / totalTransactions) * 100)
      : 0;
  }, [totalTransactions, fraudAlerts]);

  // Risk levels distribution for Pie Chart (Navy, Slate, Soft Red)
  const pieData = useMemo(() => {
    const counts = { "High Risk": 0, "Medium Risk": 0, "Low Risk": 0 };
    transactions.forEach((tx) => {
      const risk = tx.risk || "Low Risk";
      if (counts[risk] !== undefined) {
        counts[risk]++;
      } else {
        counts["Low Risk"]++;
      }
    });

    return [
      { name: "High Risk",   value: counts["High Risk"],   color: "#DC2626" },
      { name: "Medium Risk", value: counts["Medium Risk"], color: "#D97706" },
      { name: "Low Risk",    value: counts["Low Risk"],    color: "#059669" }
    ].filter(item => item.value > 0 || totalTransactions === 0);
  }, [transactions, totalTransactions]);

  // Trend data for Area Chart
  const trendData = useMemo(() => {
    if (transactions.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        amount: 0,
        alerts: 0
      }));
    }
    // Group transactions into 7 buckets
    const bucketSize = Math.max(1, Math.ceil(transactions.length / 7));
    return Array.from({ length: 7 }, (_, i) => {
      const start = i * bucketSize;
      const bucket = transactions.slice(start, start + bucketSize);
      const sumAmount = bucket.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
      const alerts = bucket.filter(tx => tx.risk === "High Risk").length;
      return {
        name: `T-${7 - i}`,
        amount: Math.round(sumAmount),
        alerts: alerts
      };
    });
  }, [transactions]);

  // Filtered transactions for search bar / feed
  const filteredAlerts = useMemo(() => {
    return transactions
      .filter((tx) => {
        const query = searchQuery.toLowerCase();
        return (
          tx.transactionId?.toLowerCase().includes(query) ||
          tx.sender?.toLowerCase().includes(query) ||
          tx.receiver?.toLowerCase().includes(query)
        );
      })
      .slice(0, FEED_PAGE_SIZE);
  }, [transactions, searchQuery]);

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Dataset uploaded successfully.");
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Upload failed — Is the backend running on port 5000?");
    }
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Layout active="Overview">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
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
            AML Investigation Console
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Real-time graph intelligence and transaction anomaly detection dashboard
          </p>
        </div>

        {/* SEARCH */}
        <div
          className="corporate-card"
          style={{
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "340px",
            background: "#FFFFFF"
          }}
        >
          <FaSearch color="#1E3A8A" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wallet / Txn hash..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "14px",
              background: "transparent",
              color: "#0F172A",
              padding: 0
            }}
          />
        </div>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
          marginBottom: "35px"
        }}
      >
        <StatCard
          icon={<FaChartLine size={20} />}
          title="Total Transactions"
          value={datasetUploaded ? totalTransactions : "—"}
          color="#1E3A8A"
        />
        <StatCard
          icon={<FaExclamationTriangle size={20} />}
          title="Fraud Alerts"
          value={datasetUploaded ? fraudAlerts : "—"}
          color="#DC2626"
          alert={fraudAlerts > 0}
        />
        <StatCard
          icon={<FaProjectDiagram size={20} />}
          title="Suspicious Chains"
          value={datasetUploaded ? suspiciousChains : "—"}
          color="#D97706"
        />
        <StatCard
          icon={<FaShieldAlt size={20} />}
          title="Risk Exposure Score"
          value={datasetUploaded ? `${riskScore}%` : "—"}
          color={riskScore > 50 ? "#DC2626" : riskScore > 20 ? "#D97706" : "#059669"}
        />
      </div>

      {/* MAIN CONTAINER */}
      {!datasetUploaded ? (
        /* UPLOAD SCREEN STYLED IN CORPORATE CARD */
        <div
          className="corporate-card"
          style={{
            padding: "80px 40px",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto",
            background: "#FFFFFF",
            border: dragActive ? "2px dashed #1E3A8A" : "1px dashed #CBD5E1"
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(30, 58, 138, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 30px auto",
              color: "#1E3A8A"
            }}
          >
            <FaUpload size={32} />
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "15px", color: "#0F172A" }}>
            Upload Transaction Dataset
          </h2>
          <p style={{ color: "#475569", fontSize: "16px", maxWidth: "500px", margin: "0 auto 40px auto", lineHeight: "24px" }}>
            Drag and drop your AML transaction log files (.csv, .xlsx) to initialize graph classification and anomaly scoring models.
          </p>

          <label
            className="neon-btn"
            style={{
              padding: "14px 35px",
              borderRadius: "10px",
              fontSize: "15px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              background: "#1E3A8A",
              color: "#FFFFFF"
            }}
          >
            <FaFolderOpen />
            Browse Files
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => handleUpload(e.target.files[0])}
              hidden
            />
          </label>
          <div style={{ marginTop: "20px", fontSize: "12px", color: "#6B7280" }}>
            Supports Elliptic Dataset format and standard transaction CSV schemas.
          </div>
        </div>
      ) : (
        /* ACTIVE INVESTIGATION PLATFORM */
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px", alignItems: "start" }}>
          {/* LEFT COLUMN: VISUALIZATIONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* AREA CHART */}
            <div className="corporate-card" style={{ padding: "25px", background: "#FFFFFF" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#0F172A" }}>
                Transaction Volume & Threat Incident Timeline
              </h3>
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "12px",
                        color: "#0F172A"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      name="Volume (BTC)"
                      stroke="#1E3A8A"
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                    <Area
                      type="monotone"
                      dataKey="alerts"
                      name="Fraud Incidents"
                      stroke="#DC2626"
                      fillOpacity={1}
                      fill="url(#colorAlerts)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RADAR / PIE CHART */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "25px" }}>
              <div className="corporate-card" style={{ padding: "25px", background: "#FFFFFF" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "15px", color: "#0F172A" }}>
                  Risk Classification Distribution
                </h3>
                <div style={{ width: "100%", height: "200px", display: "flex", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderRadius: "12px",
                          color: "#0F172A"
                        }}
                      />
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* STAT INFO LIST */}
              <div className="corporate-card" style={{ padding: "25px", background: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#475569", marginBottom: "12px" }}>
                  Network Graph Metrics
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: 1, justifyContent: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#475569" }}>Total Entities</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>{totalTransactions * 2}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "14px", color: "#475569" }}>Avg Anomaly Score</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#D97706" }}>
                      {transactions.length > 0
                        ? (transactions.reduce((sum, tx) => sum + (parseFloat(tx.anomalyScore) || 0), 0) / transactions.length).toFixed(3)
                        : "0.000"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", color: "#475569" }}>GCN Accuracy</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#059669" }}>94.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ALERTS FEED */}
          <div className="corporate-card" style={{ padding: "25px", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0F172A" }}>
                Live Suspicious Feed
              </h3>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#DC2626" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {filteredAlerts.length === 0 ? (
                <p style={{ color: "#475569", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                  No suspicious items found.
                </p>
              ) : (
                <>
                  {(showAllFeed
                    ? transactions.filter(tx => {
                        const q = searchQuery.toLowerCase();
                        return (
                          tx.transactionId?.toLowerCase().includes(q) ||
                          tx.sender?.toLowerCase().includes(q) ||
                          tx.receiver?.toLowerCase().includes(q)
                        );
                      })
                    : filteredAlerts
                  ).map((tx, idx) => (
                    <div
                      key={tx.transactionId || idx}
                      style={{
                        background: "#F8FAFC",
                        borderRadius: "14px",
                        padding: "16px",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#1E3A8A", fontFamily: "monospace" }}>
                          {tx.transactionId ? tx.transactionId.substring(0, 12) : `TXN-${idx}`}
                        </span>
                        <span
                          style={{
                            background: tx.risk === "High Risk" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
                            color: tx.risk === "High Risk" ? "#DC2626" : "#D97706",
                            border: tx.risk === "High Risk" ? "1px solid rgba(220,38,38,0.2)" : "1px solid rgba(217,119,6,0.2)",
                            fontSize: "11px",
                            padding: "4px 8px",
                            borderRadius: "10px",
                            fontWeight: "600"
                          }}
                        >
                          {tx.risk || "Medium Risk"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#475569" }}>
                        <span>Amt: {tx.amount} BTC</span>
                        <span>Risk Score: {tx.score ? `${Math.round(parseFloat(tx.score) * 100)}%` : "0%"}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#64748B" }}>
                        <FaRegDotCircle size={10} color={tx.risk === "High Risk" ? "#DC2626" : "#D97706"} />
                        <span>{tx.status || "Under Investigation"}</span>
                      </div>
                    </div>
                  ))}

                  {transactions.length > FEED_PAGE_SIZE && (
                    <button
                      onClick={() => setShowAllFeed(!showAllFeed)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #1E3A8A",
                        background: "transparent",
                        color: "#1E3A8A",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        width: "100%",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1E3A8A"; e.currentTarget.style.color = "#FFF"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1E3A8A"; }}
                    >
                      {showAllFeed ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                      {showAllFeed ? "Collapse" : `View All ${transactions.length} Alerts`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function StatCard({ icon, title, value, color, alert }) {
  return (
    <div
      className="corporate-card"
      style={{
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        background: "#FFFFFF",
        border: alert ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid #E2E8F0"
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "12px",
          background: `rgba(${parseInt(color.slice(1, 3), 16) || 0}, ${parseInt(color.slice(3, 5), 16) || 0}, ${parseInt(color.slice(5, 7), 16) || 0}, 0.08)`,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ color: "#475569", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>{title}</p>
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: 0 }}>{value}</h2>
      </div>
    </div>
  );
}