import { useContext, useMemo, useState } from "react";
import { FaLink, FaExclamationTriangle, FaProjectDiagram, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

const PAGE_SIZE = 8;

export default function SuspiciousChains() {
  const { datasetUploaded, transactions } = useContext(DataContext);
  const [showAll, setShowAll] = useState(false);

  // Build chains: group by sender and create paths
  const chains = useMemo(() => {
    if (!transactions.length) return [];

    // Build adjacency map: sender -> list of receivers
    const adjacency = {};
    transactions.forEach((tx) => {
      const sender = tx.sender || "Unknown";
      const receiver = tx.receiver || "Unknown";
      if (!adjacency[sender]) adjacency[sender] = [];
      if (!adjacency[sender].includes(receiver)) {
        adjacency[sender].push(receiver);
      }
    });

    // Detect chains of length >= 2 hops
    const detectedChains = [];
    const visited = new Set();

    const buildChain = (start, path) => {
      const nexts = adjacency[start] || [];
      if (nexts.length === 0 || path.length >= 4) {
        if (path.length >= 2) {
          const chainStr = path.join(" → ");
          if (!visited.has(chainStr)) {
            visited.add(chainStr);
            const hops = path.length - 1;
            const hasHighRisk = transactions.some(
              (tx) => (tx.sender === path[0] || tx.receiver === path[path.length - 1]) && tx.risk === "High Risk"
            );
            detectedChains.push({
              chain: chainStr,
              hops,
              risk: hasHighRisk ? "High Risk" : hops >= 3 ? "Moderate Risk" : "Low Risk",
            });
          }
        }
        return;
      }
      for (const next of nexts.slice(0, 3)) {
        if (!path.includes(next)) {
          buildChain(next, [...path, next]);
        }
      }
    };

    Object.keys(adjacency).slice(0, 20).forEach((sender) => {
      buildChain(sender, [sender]);
    });

    return detectedChains.sort((a, b) => {
      const order = { "High Risk": 0, "Moderate Risk": 1, "Low Risk": 2 };
      return (order[a.risk] ?? 3) - (order[b.risk] ?? 3);
    });
  }, [transactions]);

  const highRisk = chains.filter((c) => c.risk === "High Risk").length;
  const moderateRisk = chains.filter((c) => c.risk === "Moderate Risk").length;
  const wallets = new Set(
    transactions.flatMap((tx) => [tx.sender, tx.receiver]).filter(Boolean)
  ).size;

  return (
    <Layout active="Fraud Chains">
      {/* TOPBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
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
            Suspicious Chains
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Traces multi-hop transaction pathways to locate coin mixers and laundering layers
          </p>
        </div>
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
            placeholder="Search chains..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#0F172A",
              fontSize: "14px",
              width: "180px"
            }}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {!datasetUploaded && (
        <div className="corporate-card" style={{ padding: "80px 40px", textAlign: "center", background: "#FFFFFF" }}>
          <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No Dataset Uploaded Yet</h2>
          <p style={{ color: "#475569", fontSize: "17px" }}>Upload a dataset to detect suspicious laundering chains</p>
        </div>
      )}

      {/* MAIN */}
      {datasetUploaded && (
        <>
          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "25px", marginBottom: "35px" }}>
            <StatCard icon={<FaLink size={20} />} title="Detected Chains" value={chains.length} color="#1E3A8A" />
            <StatCard icon={<FaProjectDiagram size={20} />} title="Analyzed Wallets" value={wallets} color="#3B82F6" />
            <StatCard icon={<FaExclamationTriangle size={20} />} title="High Risk Paths" value={highRisk} color="#DC2626" danger />
          </div>

          {/* CHAINS LIST */}
          <div className="corporate-card" style={{ padding: "35px", background: "#FFFFFF" }}>
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Laundering Chain Detection Engine</h2>
              <p style={{ color: "#475569", fontSize: "14px" }}>
                {chains.length} suspicious multi-hop pathways flagged — {highRisk} high risk, {moderateRisk} moderate risk
              </p>
            </div>

            {chains.length === 0 ? (
              <div style={{ height: "300px", borderRadius: "20px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid #E2E8F0" }}>
                <div>
                  <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No Laundering Loops Flagged</h2>
                  <p style={{ color: "#475569" }}>Upload a dataset with linked sender/receiver transactions to detect chains.</p>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gap: "18px" }}>
                  {(showAll ? chains : chains.slice(0, PAGE_SIZE)).map((item, i) => (
                    <ChainCard key={i} chain={item.chain} risk={item.risk} hops={item.hops} />
                  ))}
                </div>

                {chains.length > PAGE_SIZE && (
                  <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <button
                      onClick={() => setShowAll(!showAll)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 24px",
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
                      {showAll ? `Collapse` : `View All ${chains.length} Chains`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

function ChainCard({ chain, risk, hops }) {
  const riskColor = risk === "High Risk" ? "#DC2626" : risk === "Moderate Risk" ? "#D97706" : "#059669";
  const riskBg = risk === "High Risk" ? "rgba(220,38,38,0.06)" : risk === "Moderate Risk" ? "rgba(217,119,6,0.06)" : "rgba(5,150,105,0.06)";
  const riskBorder = risk === "High Risk" ? "rgba(220,38,38,0.15)" : risk === "Moderate Risk" ? "rgba(217,119,6,0.15)" : "rgba(5,150,105,0.15)";

  return (
    <div
      style={{
        background: "#F8FAFC",
        borderRadius: "12px",
        padding: "24px 28px",
        border: "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E3A8A"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
    >
      <div>
        <h3 style={{ color: "#0F172A", marginBottom: "6px", fontSize: "15px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "-0.2px" }}>
          {chain}
        </h3>
        <p style={{ color: "#475569", fontSize: "13px" }}>
          Multi-hop transfer chain detected across {hops} distinct ledger jumps
        </p>
      </div>
      <span
        style={{
          background: riskBg,
          color: riskColor,
          border: `1px solid ${riskBorder}`,
          padding: "6px 14px",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "13px",
          whiteSpace: "nowrap"
        }}
      >
        {risk}
      </span>
    </div>
  );
}

function StatCard({ icon, title, value, color, danger }) {
  return (
    <div
      className="corporate-card"
      style={{
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        background: "#FFFFFF",
        border: danger ? "1px solid rgba(220, 38, 38, 0.2)" : "1px solid #E2E8F0"
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