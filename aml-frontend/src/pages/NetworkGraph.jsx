import { useState, useContext, useEffect, useMemo } from "react";
import { 
  FaProjectDiagram, 
  FaShieldAlt, 
  FaExclamationTriangle, 
  FaSync, 
  FaSearch, 
  FaTimes, 
  FaArrowUp, 
  FaArrowDown,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaUndo,
  FaClock,
  FaRoute
} from "react-icons/fa";
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

  // Chronological Playback Timeline States
  const [isPlaybackMode, setIsPlaybackMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // 1000ms default

  // Pathfinder States
  const [pathStartWallet, setPathStartWallet] = useState("");
  const [pathEndWallet, setPathEndWallet] = useState("");
  const [highlightedPathNodes, setHighlightedPathNodes] = useState(new Set());
  const [highlightedPathEdges, setHighlightedPathEdges] = useState(new Set());
  const [pathSteps, setPathSteps] = useState([]);
  const [pathError, setPathError] = useState(null);

  // 1. Sort all transactions chronologically (by createdAt, then transactionId)
  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    return [...transactions].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA !== timeB) return timeA - timeB;
      return (a.transactionId || "").localeCompare(b.transactionId || "", undefined, { numeric: true, sensitivity: "base" });
    });
  }, [transactions]);

  // 2. Pre-calculate the stable top 18 active wallets across the entire dataset to prevent layout jumping
  const stableWallets = useMemo(() => {
    if (!sortedTransactions.length) return [];
    const walletTxCounts = {};
    sortedTransactions.forEach((tx) => {
      if (tx.sender) walletTxCounts[tx.sender] = (walletTxCounts[tx.sender] || 0) + 1;
      if (tx.receiver) walletTxCounts[tx.receiver] = (walletTxCounts[tx.receiver] || 0) + 1;
    });
    return Object.keys(walletTxCounts)
      .sort((a, b) => walletTxCounts[b] - walletTxCounts[a])
      .slice(0, 18);
  }, [sortedTransactions]);

  // 3. Filter transactions between these stable wallets
  const activeTxns = useMemo(() => {
    return sortedTransactions.filter(
      (tx) => stableWallets.includes(tx.sender) && stableWallets.includes(tx.receiver)
    );
  }, [sortedTransactions, stableWallets]);

  // BFS Algorithm to find shortest path between start and end wallet using activeTxns
  const findShortestPath = (start, end) => {
    if (!start || !end) return null;
    const adj = {};
    activeTxns.forEach(tx => {
      if (!tx.sender || !tx.receiver) return;
      if (!adj[tx.sender]) adj[tx.sender] = [];
      adj[tx.sender].push({ receiver: tx.receiver, transaction: tx });
    });

    const queue = [{ node: start, path: [start], edges: [] }];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const { node, path, edges } = queue.shift();

      if (node === end) {
        return { path, edges };
      }

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.receiver)) {
          visited.add(neighbor.receiver);
          queue.push({
            node: neighbor.receiver,
            path: [...path, neighbor.receiver],
            edges: [...edges, neighbor.transaction]
          });
        }
      }
    }
    return null;
  };

  const handleTracePath = () => {
    if (!pathStartWallet || !pathEndWallet) {
      setPathError("Please select both source and destination wallets.");
      return;
    }
    if (pathStartWallet === pathEndWallet) {
      setPathError("Source and destination wallets must be different.");
      return;
    }

    const result = findShortestPath(pathStartWallet, pathEndWallet);
    if (result) {
      setHighlightedPathNodes(new Set(result.path));
      setHighlightedPathEdges(new Set(result.edges.map(e => e.transactionId)));
      setPathSteps(result.edges);
      setPathError(null);
    } else {
      // Try reverse direction
      const reverseResult = findShortestPath(pathEndWallet, pathStartWallet);
      if (reverseResult) {
        setHighlightedPathNodes(new Set(reverseResult.path));
        setHighlightedPathEdges(new Set(reverseResult.edges.map(e => e.transactionId)));
        setPathSteps(reverseResult.edges);
        setPathError(`No direct path. Showing reverse flow direction.`);
      } else {
        setHighlightedPathNodes(new Set());
        setHighlightedPathEdges(new Set());
        setPathSteps([]);
        setPathError("No connection path detected in either direction.");
      }
    }
  };

  const handleClearPath = () => {
    setPathStartWallet("");
    setPathEndWallet("");
    setHighlightedPathNodes(new Set());
    setHighlightedPathEdges(new Set());
    setPathSteps([]);
    setPathError(null);
  };

  // 4. Timer loop for autoplay
  useEffect(() => {
    let interval = null;
    if (isPlaying && isPlaybackMode) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= activeTxns.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPlaybackMode, playbackSpeed, activeTxns.length]);

  const handlePlayPause = () => {
    if (!isPlaybackMode) {
      setIsPlaybackMode(true);
      setCurrentStep(activeTxns.length > 0 ? 1 : 0);
      setIsPlaying(true);
    } else {
      if (currentStep >= activeTxns.length) {
        setCurrentStep(0);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Compute graph nodes and edges based on playback step or full graph mode
  useEffect(() => {
    if (!transactions.length || !graphGenerated) return;

    // Define the subset of transactions to render at this moment
    const visibleTxns = isPlaybackMode 
      ? activeTxns.slice(0, currentStep)
      : activeTxns; // default to full graph between the top active wallets

    // Find wallets that have appeared up to this point
    const appearedWallets = new Set();
    const walletRisks = {};
    const walletTransactions = {};

    visibleTxns.forEach((tx) => {
      if (tx.sender) {
        appearedWallets.add(tx.sender);
        if (tx.risk === "High Risk") walletRisks[tx.sender] = "High Risk";
        else if (tx.risk === "Medium Risk" && walletRisks[tx.sender] !== "High Risk") walletRisks[tx.sender] = "Medium Risk";
        else if (!walletRisks[tx.sender]) walletRisks[tx.sender] = "Low Risk";

        walletTransactions[tx.sender] = (walletTransactions[tx.sender] || 0) + 1;
      }
      if (tx.receiver) {
        appearedWallets.add(tx.receiver);
        if (tx.risk === "High Risk") walletRisks[tx.receiver] = "High Risk";
        else if (tx.risk === "Medium Risk" && walletRisks[tx.receiver] !== "High Risk") walletRisks[tx.receiver] = "Medium Risk";
        else if (!walletRisks[tx.receiver]) walletRisks[tx.receiver] = "Low Risk";

        walletTransactions[tx.receiver] = (walletTransactions[tx.receiver] || 0) + 1;
      }
    });

    const newestTx = isPlaybackMode && currentStep > 0 ? activeTxns[currentStep - 1] : null;

    const generatedNodes = [];
    const generatedEdges = [];
    const isPathTraced = highlightedPathNodes.size > 0;

    // Calculate node coordinates in a circular arrangement (stable coordinates)
    stableWallets.forEach((wallet, index) => {
      // In playback mode, only render wallets that have appeared in the transactions so far
      if (isPlaybackMode && !appearedWallets.has(wallet)) {
        return;
      }

      const angle = (index / stableWallets.length) * 2 * Math.PI;
      const radius = index % 2 === 0 ? 220 : 340; // layered circle layout
      const x = 500 + radius * Math.cos(angle);
      const y = 350 + radius * Math.sin(angle);

      const risk = walletRisks[wallet] || "Low Risk";
      const isSearched = searchQuery && wallet.toLowerCase().includes(searchQuery.toLowerCase());
      const isSelected = selectedWallet === wallet;
      const isNewestParticipant = newestTx && (wallet === newestTx.sender || wallet === newestTx.receiver);
      const isPathNode = highlightedPathNodes.has(wallet);

      // Node border color: transitioning from green (low) to orange (medium) to red (high)
      const nodeColor = risk === "High Risk" ? "#DC2626" : risk === "Medium Risk" ? "#D97706" : "#10B981";
      
      let borderStyle = isNewestParticipant
        ? "3px solid #3B82F6"
        : (isSelected 
        ? "3px solid #1E3A8A" 
        : isSearched 
        ? "2px solid #3B82F6" 
        : `2px solid ${nodeColor}`);

      let bgStyle = isNewestParticipant ? "#DBEAFE" : (isSelected ? "#EFF6FF" : "#FFFFFF");
      let nodeShadow = "0 2px 6px rgba(0,0,0,0.06)";

      if (isPathTraced) {
        if (isPathNode) {
          borderStyle = "3px solid #D97706";
          bgStyle = isSelected ? "#FFFBEB" : "#FFFDF5";
          nodeShadow = "0 0 20px rgba(217, 119, 6, 0.65)";
        }
      } else {
        if (isNewestParticipant) {
          nodeShadow = "0 0 20px rgba(59, 130, 246, 0.8)";
        } else if (isSelected) {
          nodeShadow = "0 0 15px rgba(30, 58, 138, 0.25)";
        } else if (isSearched) {
          nodeShadow = "0 0 12px rgba(59, 130, 246, 0.25)";
        }
      }

      generatedNodes.push({
        id: wallet,
        data: { label: `${wallet.substring(0, 8)}...` },
        position: { x, y },
        style: {
          background: bgStyle,
          color: "#0F172A",
          border: borderStyle,
          borderRadius: "10px",
          padding: "12px",
          fontSize: "11px",
          fontFamily: "monospace",
          boxShadow: nodeShadow,
          width: 130,
          textAlign: "center",
          fontWeight: isNewestParticipant || isSelected || isSearched || isPathNode ? "bold" : "normal",
          cursor: "pointer",
          opacity: isPathTraced && !isPathNode ? 0.15 : 1
        }
      });
    });

    // Build connections/edges
    visibleTxns.forEach((tx, idx) => {
      if (stableWallets.includes(tx.sender) && stableWallets.includes(tx.receiver)) {
        const isHigh = tx.risk === "High Risk";
        const isNewest = newestTx && tx.transactionId === newestTx.transactionId && tx.sender === newestTx.sender && tx.receiver === newestTx.receiver;
        const isPathEdge = isPathTraced && highlightedPathEdges.has(tx.transactionId);
        
        // Use custom edge color
        const edgeColor = isHigh ? "#DC2626" : tx.risk === "Medium Risk" ? "#D97706" : "#10B981";
        
        let edgeStroke = isNewest ? "#3B82F6" : edgeColor;
        let edgeWidth = isNewest ? 4.5 : (isHigh ? 3 : 1.5);
        let edgeAnimated = isHigh || isNewest;

        if (isPathTraced && isPathEdge) {
          edgeStroke = "#D97706";
          edgeWidth = 4.5;
          edgeAnimated = true;
        }

        generatedEdges.push({
          id: `e-${idx}-${tx.transactionId}`,
          source: tx.sender,
          target: tx.receiver,
          label: `${tx.amount} BTC`,
          animated: edgeAnimated,
          style: { 
            stroke: edgeStroke, 
            strokeWidth: edgeWidth,
            strokeDasharray: isNewest && !isPathEdge ? "5 5" : undefined,
            opacity: isPathTraced && !isPathEdge ? 0.15 : 1
          },
          labelStyle: { 
            fill: "#475569", 
            fontSize: "10px", 
            fontWeight: "600", 
            fillOpacity: isPathTraced && !isPathEdge ? 0.15 : 0.8 
          },
          labelBgStyle: { 
            fill: "#FFFFFF", 
            fillOpacity: isPathTraced && !isPathEdge ? 0.15 : 0.95 
          }
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [
    transactions,
    graphGenerated,
    searchQuery,
    selectedWallet,
    setNodes,
    setEdges,
    isPlaybackMode,
    currentStep,
    activeTxns,
    stableWallets,
    highlightedPathNodes,
    highlightedPathEdges
  ]);

  // Network statistics (updated dynamically for playback mode)
  const metrics = useMemo(() => {
    const targetTxns = (isPlaybackMode && datasetUploaded)
      ? activeTxns.slice(0, currentStep)
      : transactions;

    if (!targetTxns.length) return { nodes: 0, edges: 0, highRisk: 0 };
    const unique = new Set(targetTxns.flatMap((tx) => [tx.sender, tx.receiver]).filter(Boolean));
    const high = targetTxns.filter((t) => t.risk === "High Risk").length;
    return {
      nodes: unique.size,
      edges: targetTxns.length,
      highRisk: high
    };
  }, [transactions, isPlaybackMode, currentStep, activeTxns, datasetUploaded]);

  // Dynamic calculations for selected wallet details panel (updated dynamically for playback mode)
  const walletDetails = useMemo(() => {
    if (!selectedWallet || !transactions.length) return null;

    const targetTxns = (isPlaybackMode && datasetUploaded)
      ? activeTxns.slice(0, currentStep)
      : transactions;

    const relatedTxs = targetTxns.filter(
      (tx) => tx.sender === selectedWallet || tx.receiver === selectedWallet
    );

    if (relatedTxs.length === 0) return null;

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
  }, [selectedWallet, transactions, isPlaybackMode, currentStep, activeTxns, datasetUploaded]);

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
                      position="top-right"
                      nodeStrokeColor={(n) => {
                        if (n.style?.border?.includes("#DC2626")) return "#DC2626";
                        if (n.style?.border?.includes("#D97706")) return "#D97706";
                        return "#10B981";
                      }}
                      nodeColor={(n) => "#FFFFFF"}
                      maskColor="rgba(241, 245, 249, 0.7)"
                      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "10px" }}
                    />
                  </ReactFlow>

                  {/* PATHFINDER CONTROL CONSOLE OVERLAY */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                      width: "320px",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid #E2E8F0",
                      borderRadius: "16px",
                      padding: "18px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                      zIndex: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px" }}>
                      <FaRoute color="#D97706" size={16} />
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Multi-Hop Pathfinder
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", display: "block", marginBottom: "4px" }}>SOURCE WALLET</label>
                        <select
                          value={pathStartWallet}
                          onChange={(e) => {
                            setPathStartWallet(e.target.value);
                            setPathError(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "12px",
                            color: "#0F172A",
                            background: "#FFFFFF",
                            fontFamily: "monospace"
                          }}
                        >
                          <option value="">Select source...</option>
                          {stableWallets.map(w => (
                            <option key={w} value={w}>{w.substring(0, 16)}...</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "10px", fontWeight: "700", color: "#64748B", display: "block", marginBottom: "4px" }}>DESTINATION WALLET</label>
                        <select
                          value={pathEndWallet}
                          onChange={(e) => {
                            setPathEndWallet(e.target.value);
                            setPathError(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "12px",
                            color: "#0F172A",
                            background: "#FFFFFF",
                            fontFamily: "monospace"
                          }}
                        >
                          <option value="">Select destination...</option>
                          {stableWallets.map(w => (
                            <option key={w} value={w}>{w.substring(0, 16)}...</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleTracePath}
                        style={{
                          flex: 1.5,
                          padding: "10px 14px",
                          background: "#D97706",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        <FaRoute size={12} />
                        Trace Flow
                      </button>

                      <button
                        onClick={handleClearPath}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: "#F1F5F9",
                          color: "#475569",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "12px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}
                      >
                        Clear Path
                      </button>
                    </div>

                    {pathError && (
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: pathError.includes("reverse") ? "#FEF3C7" : "#FEE2E2",
                          border: `1px solid ${pathError.includes("reverse") ? "#FDE68A" : "#FCA5A5"}`,
                          color: pathError.includes("reverse") ? "#92400E" : "#991B1B",
                          fontSize: "11px",
                          fontWeight: "600",
                          lineHeight: "1.4"
                        }}
                      >
                        {pathError}
                      </div>
                    )}

                    {/* Hop List details inside console */}
                    {pathSteps.length > 0 && (
                      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "12px", maxHeight: "180px", overflowY: "auto" }}>
                        <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                          Hop Sequence ({pathSteps.length})
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {pathSteps.map((hop, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: "#F8FAFC",
                                border: "1px solid #E2E8F0",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                fontSize: "11px"
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                <span style={{ fontWeight: "800", color: "#D97706" }}>Hop {idx + 1}</span>
                                <span style={{ 
                                  fontWeight: "700", 
                                  color: hop.risk === "High Risk" ? "#DC2626" : hop.risk === "Medium Risk" ? "#D97706" : "#059669" 
                                }}>
                                  {hop.risk}
                                </span>
                              </div>
                              <div style={{ fontFamily: "monospace", color: "#0F172A", wordBreak: "break-all", marginBottom: "2px" }}>
                                {hop.sender.substring(0, 6)}... &rarr; {hop.receiver.substring(0, 6)}...
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                                <span>Amt: {hop.amount} BTC</span>
                                <span>TxID: {hop.transactionId.substring(0, 8)}...</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CHRONOLOGICAL PLAYBACK BAR OVERLAY */}
                  {activeTxns.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        right: "20px",
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid #E2E8F0",
                        borderRadius: "15px",
                        padding: "15px 25px",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}
                    >
                      {/* Top Row: Title & Active Step Status */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaClock color="#1E3A8A" size={14} />
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#1E3A8A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Chronological Playback Timeline
                          </span>
                          {isPlaybackMode && (
                            <span style={{ background: "#EFF6FF", color: "#1E3A8A", fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "20px", border: "1px solid #DBEAFE" }}>
                              Active
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>
                          {isPlaybackMode ? (
                            currentStep === 0 ? (
                              "Timeline Initialized (Start)"
                            ) : (
                              `Step ${currentStep} of ${activeTxns.length} | Visual Wallets: ${nodes.length}`
                            )
                          ) : (
                            "Showing Complete Network Map"
                          )}
                        </div>
                      </div>

                      {/* Middle Row: Range Scrub Slider */}
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748B" }}>T0</span>
                        <input
                          type="range"
                          min="0"
                          max={activeTxns.length}
                          value={isPlaybackMode ? currentStep : activeTxns.length}
                          onChange={(e) => {
                            setIsPlaybackMode(true);
                            setCurrentStep(parseInt(e.target.value));
                            setIsPlaying(false); // Pause auto-playback on scrub
                          }}
                          style={{
                            flex: 1,
                            height: "6px",
                            borderRadius: "3px",
                            outline: "none",
                            cursor: "pointer",
                            accentColor: "#1E3A8A"
                          }}
                        />
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748B" }}>T_END</span>
                      </div>

                      {/* Bottom Row: Controls & Info Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        {/* Control Buttons */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {/* Step Back */}
                          <button
                            onClick={() => {
                              setIsPlaybackMode(true);
                              setIsPlaying(false);
                              setCurrentStep((prev) => Math.max(0, prev - 1));
                            }}
                            disabled={!isPlaybackMode || currentStep === 0}
                            title="Step Backward"
                            style={{
                              background: "#F1F5F9",
                              border: "none",
                              borderRadius: "8px",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: (!isPlaybackMode || currentStep === 0) ? "#CBD5E1" : "#475569",
                              cursor: (!isPlaybackMode || currentStep === 0) ? "not-allowed" : "pointer"
                            }}
                          >
                            <FaStepBackward size={12} />
                          </button>

                          {/* Play / Pause */}
                          <button
                            onClick={handlePlayPause}
                            title={isPlaying ? "Pause" : "Play Timeline"}
                            style={{
                              background: "#1E3A8A",
                              border: "none",
                              borderRadius: "8px",
                              width: "40px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#FFFFFF",
                              cursor: "pointer"
                            }}
                          >
                            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                          </button>

                          {/* Step Forward */}
                          <button
                            onClick={() => {
                              setIsPlaybackMode(true);
                              setIsPlaying(false);
                              setCurrentStep((prev) => Math.min(activeTxns.length, prev + 1));
                            }}
                            disabled={!isPlaybackMode || currentStep === activeTxns.length}
                            title="Step Forward"
                            style={{
                              background: "#F1F5F9",
                              border: "none",
                              borderRadius: "8px",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: (!isPlaybackMode || currentStep === activeTxns.length) ? "#CBD5E1" : "#475569",
                              cursor: (!isPlaybackMode || currentStep === activeTxns.length) ? "not-allowed" : "pointer"
                            }}
                          >
                            <FaStepForward size={12} />
                          </button>

                          {/* Reset to Full View */}
                          <button
                            onClick={() => {
                              setIsPlaybackMode(false);
                              setIsPlaying(false);
                              setCurrentStep(activeTxns.length);
                            }}
                            title="Show Complete Graph"
                            style={{
                              background: "#F1F5F9",
                              border: "none",
                              borderRadius: "8px",
                              padding: "0 12px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#475569",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer"
                            }}
                          >
                            <FaUndo size={10} />
                            Reset
                          </button>
                        </div>

                        {/* Current Transaction Detail Pill */}
                        {isPlaybackMode && currentStep > 0 && activeTxns[currentStep - 1] && (
                          <div
                            style={{
                              background: activeTxns[currentStep - 1].risk === "High Risk" ? "#FEE2E2" : activeTxns[currentStep - 1].risk === "Medium Risk" ? "#FEF3C7" : "#D1FAE5",
                              border: `1px solid ${activeTxns[currentStep - 1].risk === "High Risk" ? "#FCA5A5" : activeTxns[currentStep - 1].risk === "Medium Risk" ? "#FDE68A" : "#6EE7B7"}`,
                              borderRadius: "8px",
                              padding: "4px 12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              color: activeTxns[currentStep - 1].risk === "High Risk" ? "#991B1B" : activeTxns[currentStep - 1].risk === "Medium Risk" ? "#92400E" : "#065F46",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}
                          >
                            <span>TXN: {activeTxns[currentStep - 1].transactionId}</span>
                            <span>•</span>
                            <span>{activeTxns[currentStep - 1].amount} BTC</span>
                            <span>•</span>
                            <span style={{ textTransform: "capitalize" }}>{activeTxns[currentStep - 1].risk}</span>
                          </div>
                        )}

                        {/* Speed Adjuster */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748B" }}>Speed:</span>
                          {[
                            { label: "0.5x", value: 2000 },
                            { label: "1x", value: 1000 },
                            { label: "2x", value: 500 },
                            { label: "5x", value: 200 }
                          ].map((sp) => (
                            <button
                              key={sp.label}
                              onClick={() => setPlaybackSpeed(sp.value)}
                              style={{
                                background: playbackSpeed === sp.value ? "#1E3A8A" : "#F1F5F9",
                                color: playbackSpeed === sp.value ? "#FFFFFF" : "#475569",
                                border: "none",
                                borderRadius: "6px",
                                padding: "2px 8px",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer"
                              }}
                            >
                              {sp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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

                      {/* Pathfinder Quick Actions */}
                      <div style={{ marginBottom: "25px" }}>
                        <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>Pathfinder Actions</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => {
                              setPathStartWallet(walletDetails.address);
                              setPathError(null);
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#D97706",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              textAlign: "center"
                            }}
                          >
                            Set Source
                          </button>
                          <button
                            onClick={() => {
                              setPathEndWallet(walletDetails.address);
                              setPathError(null);
                            }}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              fontSize: "12px",
                              fontWeight: "700",
                              background: "#1E3A8A",
                              color: "#FFFFFF",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              textAlign: "center"
                            }}
                          >
                            Set Dest
                          </button>
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