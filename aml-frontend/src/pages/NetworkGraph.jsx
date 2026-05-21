import { useState, useContext, useEffect, useMemo } from "react";
import { FaProjectDiagram, FaShieldAlt, FaExclamationTriangle, FaSync, FaSearch, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { DataContext } from "../context/DataContext";
import Layout from "../components/Layout";

export default function NetworkGraph() {
  const { datasetUploaded, transactions } = useContext(DataContext);
  const [graphGenerated, setGraphGenerated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Compute graph nodes and edges when transactions update, search changes, or selection changes
  useEffect(() => {
    if (!transactions.length || !graphGenerated) return;

    const uniqueWallets = new Set();
    const walletRisks = {};
    const walletTransactions = {};

    transactions.forEach((tx) => {
      if (tx.sender) {
        uniqueWallets.add(tx.sender);
        if (tx.risk === "High Risk") walletRisks[tx.sender] = "High Risk";
        else if (tx.risk === "Medium Risk" && walletRisks[tx.sender] !== "High Risk") walletRisks[tx.sender] = "Medium Risk";
        else if (!walletRisks[tx.sender]) walletRisks[tx.sender] = "Low Risk";

        walletTransactions[tx.sender] = (walletTransactions[tx.sender] || 0) + 1;
      }
      if (tx.receiver) {
        uniqueWallets.add(tx.receiver);
        if (tx.risk === "High Risk") walletRisks[tx.receiver] = "High Risk";
        else if (tx.risk === "Medium Risk" && walletRisks[tx.receiver] !== "High Risk") walletRisks[tx.receiver] = "Medium Risk";
        else if (!walletRisks[tx.receiver]) walletRisks[tx.receiver] = "Low Risk";

        walletTransactions[tx.receiver] = (walletTransactions[tx.receiver] || 0) + 1;
      }
    });

    // Take top 18 wallets by activity to prevent clutter
    const walletArray = Array.from(uniqueWallets)
      .sort((a, b) => (walletTransactions[b] || 0) - (walletTransactions[a] || 0))
      .slice(0, 18);

    const generatedNodes = [];
    const generatedEdges = [];

    // Calculate node coordinates in a circular arrangement
    walletArray.forEach((wallet, index) => {
      const angle = (index / walletArray.length) * 2 * Math.PI;
      const radius = index % 2 === 0 ? 220 : 340; // layered circle layout
      const x = 500 + radius * Math.cos(angle);
      const y = 350 + radius * Math.sin(angle);

      const risk = walletRisks[wallet] || "Low Risk";
      const isSearched = searchQuery && wallet.toLowerCase().includes(searchQuery.toLowerCase());
      const isSelected = selectedWallet === wallet;

      const nodeColor = risk === "High Risk" ? "#DC2626" : risk === "Medium Risk" ? "#D97706" : "#1E3A8A";
      
      let nodeShadow = "0 2px 6px rgba(0,0,0,0.06)";
      if (isSelected) {
        nodeShadow = "0 0 15px rgba(30, 58, 138, 0.25)";
      } else if (isSearched) {
        nodeShadow = "0 0 12px rgba(59, 130, 246, 0.25)";
      }

      generatedNodes.push({
        id: wallet,
        data: { label: `${wallet.substring(0, 8)}...` },
        position: { x, y },
        style: {
          background: isSelected ? "#EFF6FF" : "#FFFFFF",
          color: "#0F172A",
          border: isSelected 
            ? "3px solid #1E3A8A" 
            : isSearched 
            ? "2px solid #3B82F6" 
            : `2px solid ${nodeColor}`,
          borderRadius: "10px",
          padding: "12px",
          fontSize: "11px",
          fontFamily: "monospace",
          boxShadow: nodeShadow,
          width: 130,
          textAlign: "center",
          fontWeight: isSelected || isSearched ? "bold" : "normal",
          cursor: "pointer"
        }
      });
    });

    // Build connections/edges
    transactions.forEach((tx, idx) => {
      if (walletArray.includes(tx.sender) && walletArray.includes(tx.receiver)) {
        const isHigh = tx.risk === "High Risk";
        const edgeColor = isHigh ? "#DC2626" : tx.risk === "Medium Risk" ? "#D97706" : "#CBD5E1";
        
        generatedEdges.push({
          id: `e-${idx}-${tx.transactionId}`,
          source: tx.sender,
          target: tx.receiver,
          label: `${tx.amount} BTC`,
          animated: isHigh,
          style: { stroke: edgeColor, strokeWidth: isHigh ? 3 : 1.5 },
          labelStyle: { fill: "#475569", fontSize: "10px", fontWeight: "600", fillOpacity: 0.8 },
          labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.95 }
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [transactions, graphGenerated, searchQuery, selectedWallet, setNodes, setEdges]);

  // Network statistics
  const metrics = useMemo(() => {
    if (!transactions.length) return { nodes: 0, edges: 0, highRisk: 0 };
    const unique = new Set(transactions.flatMap((tx) => [tx.sender, tx.receiver]).filter(Boolean));
    const high = transactions.filter((t) => t.risk === "High Risk").length;
    return {
      nodes: unique.size,
      edges: transactions.length,
      highRisk: high
    };
  }, [transactions]);

  // Dynamic calculations for selected wallet details panel
  const walletDetails = useMemo(() => {
    if (!selectedWallet || !transactions.length) return null;

    const relatedTxs = transactions.filter(
      (tx) => tx.sender === selectedWallet || tx.receiver === selectedWallet
    );

    let highestRisk = "Low Risk";
    let totalSent = 0;
    let totalReceived = 0;

    relatedTxs.forEach((tx) => {
      // Determine highest risk category
      if (tx.risk === "High Risk") highestRisk = "High Risk";
      else if (tx.risk === "Medium Risk" && highestRisk !== "High Risk") highestRisk = "Medium Risk";

      // Sum sent vs received volume
      const val = parseFloat(tx.amount) || 0;
      if (tx.sender === selectedWallet) {
        totalSent += val;
      }
      if (tx.receiver === selectedWallet) {
        totalReceived += val;
      }
    });

    return {
      address: selectedWallet,
      risk: highestRisk,
      txCount: relatedTxs.length,
      sentVolume: totalSent.toFixed(4),
      recvVolume: totalReceived.toFixed(4),
      recentTxs: relatedTxs.slice(0, 5)
    };
  }, [selectedWallet, transactions]);

  const onNodeClick = (event, node) => {
    setSelectedWallet(node.id);
  };

  return (
    <Layout active="Network Visualization">
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
            Network Visualizer
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Dynamic node connections showing peer-to-peer threat networks
          </p>
        </div>

        {/* SEARCH / HIGHLIGHT */}
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
            placeholder="Highlight wallet key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              color: "#0F172A",
              fontSize: "14px",
              width: "200px"
            }}
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {!datasetUploaded && (
        <div className="corporate-card" style={{ padding: "80px 40px", textAlign: "center", background: "#FFFFFF" }}>
          <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No Dataset Uploaded Yet</h2>
          <p style={{ color: "#475569", fontSize: "17px" }}>Upload a transaction dataset to map network vectors.</p>
        </div>
      )}

      {/* GRAPH AREA */}
      {datasetUploaded && (
        <>
          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "25px", marginBottom: "35px" }}>
            <StatCard icon={<FaProjectDiagram size={20} />} title="Total Active Wallets" value={metrics.nodes} color="#1E3A8A" />
            <StatCard icon={<FaShieldAlt size={20} />} title="Total Ledger Links" value={metrics.edges} color="#3B82F6" />
            <StatCard icon={<FaExclamationTriangle size={20} />} title="High Threat Vertices" value={metrics.highRisk} color="#DC2626" danger />
          </div>

          <div className="corporate-card" style={{ padding: "30px", background: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>Transaction Relationship Graph</h2>
                <p style={{ color: "#475569", fontSize: "14px" }}>
                  Interactive D3 relational mapping. Click any wallet node to audit localized threat parameters.
                </p>
              </div>

              <button
                onClick={() => setGraphGenerated(true)}
                className="neon-btn"
                style={{ padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: "10px", background: "#1E3A8A", color: "#FFFFFF" }}
              >
                <FaSync />
                Generate Map Layout
              </button>
            </div>

            {/* REACT FLOW CANVAS & DETAILS FLEX GRID */}
            {!graphGenerated ? (
              <div style={{ height: "600px", borderRadius: "20px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid #E2E8F0" }}>
                <div>
                  <h2 style={{ color: "#0F172A", marginBottom: "15px", fontSize: "18px" }}>Relational Canvas Off-line</h2>
                  <p style={{ color: "#475569" }}>Click "Generate Map Layout" to initialize the interactive node visualization grid.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "25px", height: "620px", alignItems: "stretch" }}>
                
                {/* FLOW CANVAS */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    overflow: "hidden",
                    position: "relative"
                  }}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    fitView
                  >
                    <Background color="#CBD5E1" gap={16} />
                    <Controls style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "10px", color: "#0F172A" }} />
                    <MiniMap
                      nodeStrokeColor={(n) => {
                        if (n.style?.border?.includes("#DC2626")) return "#DC2626";
                        if (n.style?.border?.includes("#D97706")) return "#D97706";
                        return "#1E3A8A";
                      }}
                      nodeColor={(n) => "#FFFFFF"}
                      maskColor="rgba(241, 245, 249, 0.7)"
                      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px" }}
                    />
                  </ReactFlow>
                </div>

                {/* INTERACTIVE DETAILS PANEL */}
                {walletDetails && (
                  <div
                    className="corporate-card"
                    style={{
                      width: "360px",
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "20px",
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      overflowY: "auto"
                    }}
                  >
                    {/* Panel Header */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: 0 }}>Wallet Audit Panel</h3>
                        <button
                          onClick={() => setSelectedWallet(null)}
                          style={{ background: "transparent", color: "#64748B", cursor: "pointer", border: "none" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#0F172A"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>

                      {/* Wallet Hash */}
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>Address Hash</span>
                        <p style={{ fontSize: "13px", fontFamily: "monospace", color: "#1E3A8A", wordBreak: "break-all", margin: "4px 0 0 0", fontWeight: "700" }}>
                          {walletDetails.address}
                        </p>
                      </div>

                      {/* Audit Metrics */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
                        <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                          <span style={{ fontSize: "9px", color: "#64748B", textTransform: "uppercase" }}>Risk Rating</span>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "800",
                              margin: "4px 0 0 0",
                              color: walletDetails.risk === "High Risk" ? "#DC2626" : walletDetails.risk === "Medium Risk" ? "#D97706" : "#059669"
                            }}
                          >
                            {walletDetails.risk}
                          </p>
                        </div>
                        <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                          <span style={{ fontSize: "9px", color: "#64748B", textTransform: "uppercase" }}>Interactions</span>
                          <p style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", margin: "4px 0 0 0" }}>
                            {walletDetails.txCount} txs
                          </p>
                        </div>
                      </div>

                      {/* Volume Details */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid #F1F5F9", paddingBottom: "8px" }}>
                          <span style={{ color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><FaArrowUp size={10} color="#DC2626" /> Sent Volume</span>
                          <span style={{ fontWeight: "700", color: "#0F172A" }}>{walletDetails.sentVolume} BTC</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                          <span style={{ color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}><FaArrowDown size={10} color="#059669" /> Received Volume</span>
                          <span style={{ fontWeight: "700", color: "#0F172A" }}>{walletDetails.recvVolume} BTC</span>
                        </div>
                      </div>

                      {/* Recent Flows */}
                      <div>
                        <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "10px" }}>Recent Routes</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {walletDetails.recentTxs.map((t, i) => {
                            const isSender = t.sender === selectedWallet;
                            return (
                              <div
                                key={i}
                                style={{
                                  background: "#F8FAFC",
                                  border: "1px solid #E2E8F0",
                                  padding: "8px 12px",
                                  borderRadius: "10px",
                                  fontSize: "12px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}
                              >
                                <span style={{ color: isSender ? "#DC2626" : "#059669", fontWeight: "600" }}>
                                  {isSender ? "OUT" : "IN"}
                                </span>
                                <span style={{ color: "#475569", fontFamily: "monospace" }}>
                                  {isSender ? `${t.receiver.substring(0, 6)}...` : `${t.sender.substring(0, 6)}...`}
                                </span>
                                <span style={{ fontWeight: "600", color: "#0F172A" }}>
                                  {t.amount} BTC
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
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
        border: danger ? "1px solid rgba(220, 38, 38, 0.25)" : "1px solid #E2E8F0"
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