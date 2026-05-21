import { useState, useContext, useEffect, useMemo } from "react";
import { 
  FaFlask, 
  FaPlay, 
  FaSync, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaSlidersH, 
  FaArrowUp, 
  FaArrowDown, 
  FaInfoCircle, 
  FaDatabase,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import Layout from "../components/Layout";

export default function Playground() {
  const { datasetUploaded, transactions, fetchTransactions } = useContext(DataContext);
  
  // Form states
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [commit, setCommit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Simulator results
  const [simulatedTransactions, setSimulatedTransactions] = useState([]);
  const [simulatedId, setSimulatedId] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);

  // ReactFlow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Extract unique wallets from original transactions for autocomplete
  const existingWallets = useMemo(() => {
    const wallets = new Set();
    transactions.forEach(tx => {
      if (tx.sender) wallets.add(tx.sender);
      if (tx.receiver) wallets.add(tx.receiver);
    });
    return Array.from(wallets);
  }, [transactions]);

  // Compute helper to get wallet risks dictionary
  const computeWalletRisks = (txList) => {
    const risks = {};
    txList.forEach((tx) => {
      if (tx.sender) {
        if (tx.risk === "High Risk") risks[tx.sender] = "High Risk";
        else if (tx.risk === "Medium Risk" && risks[tx.sender] !== "High Risk") risks[tx.sender] = "Medium Risk";
        else if (!risks[tx.sender]) risks[tx.sender] = "Low Risk";
      }
      if (tx.receiver) {
        if (tx.risk === "High Risk") risks[tx.receiver] = "High Risk";
        else if (tx.risk === "Medium Risk" && risks[tx.receiver] !== "High Risk") risks[tx.receiver] = "Medium Risk";
        else if (!risks[tx.receiver]) risks[tx.receiver] = "Low Risk";
      }
    });
    return risks;
  };

  // Original statistics
  const originalStats = useMemo(() => {
    if (!transactions.length) return { total: 0, high: 0, medium: 0, low: 0 };
    const high = transactions.filter(t => t.risk === "High Risk").length;
    const medium = transactions.filter(t => t.risk === "Medium Risk").length;
    const low = transactions.filter(t => t.risk === "Low Risk").length;
    return { total: transactions.length, high, medium, low };
  }, [transactions]);

  // Simulated statistics
  const simulatedStats = useMemo(() => {
    const txList = simulatedTransactions.length ? simulatedTransactions : transactions;
    if (!txList.length) return { total: 0, high: 0, medium: 0, low: 0 };
    const high = txList.filter(t => t.risk === "High Risk").length;
    const medium = txList.filter(t => t.risk === "Medium Risk").length;
    const low = txList.filter(t => t.risk === "Low Risk").length;
    return { total: txList.length, high, medium, low };
  }, [simulatedTransactions, transactions]);

  // Risk changes comparison list
  const riskChanges = useMemo(() => {
    if (!simulatedTransactions.length) return [];
    const beforeRisks = computeWalletRisks(transactions);
    const afterRisks = computeWalletRisks(simulatedTransactions);
    
    const changes = [];
    Object.keys(afterRisks).forEach(wallet => {
      const before = beforeRisks[wallet] || "Low Risk";
      const after = afterRisks[wallet];
      if (before !== after) {
        changes.push({ wallet, before, after });
      }
    });
    return changes;
  }, [simulatedTransactions, transactions]);

  // Handle run simulation form submission
  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!sender.trim() || !receiver.trim() || !amount.trim()) {
      setErrorMsg("All input fields are required.");
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        sender: sender.trim(),
        receiver: receiver.trim(),
        amount: parseFloat(amount),
        commit
      };

      const response = await axios.post("/api/transactions/simulate", payload);
      const data = response.data;
      
      setSimulatedTransactions(data.transactions);
      setSimulatedId(data.simulatedId);
      
      if (commit) {
        setSuccessMsg("Simulation successfully saved and committed to database!");
        await fetchTransactions(); // Refresh context
      } else {
        setSuccessMsg("Simulation run complete. Visualizing GNN impact on local cluster.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Simulation pipeline run failed.");
    } finally {
      setLoading(false);
    }
  };

  // Reset simulation state
  const handleReset = () => {
    setSender("");
    setReceiver("");
    setAmount("");
    setCommit(false);
    setErrorMsg("");
    setSuccessMsg("");
    setSimulatedTransactions([]);
    setSimulatedId("");
    setSelectedWallet(null);
  };

  // Build and render circular graph matching circular node arrangement
  useEffect(() => {
    const activeTxList = simulatedTransactions.length ? simulatedTransactions : transactions;
    if (!activeTxList.length) return;

    const uniqueWallets = new Set();
    const walletTransactions = {};

    activeTxList.forEach((tx) => {
      if (tx.sender) {
        uniqueWallets.add(tx.sender);
        walletTransactions[tx.sender] = (walletTransactions[tx.sender] || 0) + 1;
      }
      if (tx.receiver) {
        uniqueWallets.add(tx.receiver);
        walletTransactions[tx.receiver] = (walletTransactions[tx.receiver] || 0) + 1;
      }
    });

    // Make sure our simulated nodes are visible in the layout even if activity is low
    if (sender.trim()) uniqueWallets.add(sender.trim());
    if (receiver.trim()) uniqueWallets.add(receiver.trim());

    // Sort by transaction density and fetch top active wallets
    const walletArray = Array.from(uniqueWallets)
      .sort((a, b) => (walletTransactions[b] || 0) - (walletTransactions[a] || 0));
    
    let displayWallets = walletArray.slice(0, 18);
    
    // Explicitly force insertion of simulated nodes
    if (sender.trim() && !displayWallets.includes(sender.trim())) {
      displayWallets.push(sender.trim());
    }
    if (receiver.trim() && !displayWallets.includes(receiver.trim())) {
      displayWallets.push(receiver.trim());
    }

    const generatedNodes = [];
    const generatedEdges = [];
    const beforeRisks = computeWalletRisks(transactions);
    const afterRisks = simulatedTransactions.length ? computeWalletRisks(simulatedTransactions) : beforeRisks;

    displayWallets.forEach((wallet, index) => {
      const angle = (index / displayWallets.length) * 2 * Math.PI;
      const radius = index % 2 === 0 ? 190 : 290; // Circular spacing layers
      const x = 380 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      const risk = afterRisks[wallet] || "Low Risk";
      const isSimulatedNode = wallet === sender.trim() || wallet === receiver.trim();
      const isSelected = selectedWallet === wallet;

      const nodeColor = risk === "High Risk" ? "#DC2626" : risk === "Medium Risk" ? "#D97706" : "#1E3A8A";
      
      generatedNodes.push({
        id: wallet,
        data: { label: `${wallet.substring(0, 8)}...` },
        position: { x, y },
        style: {
          background: isSelected ? "#F0FDF4" : isSimulatedNode ? "#FEF3C7" : "#FFFFFF",
          color: "#0F172A",
          border: isSelected 
            ? "3px solid #10B981" 
            : isSimulatedNode 
            ? "2px dashed #D97706" 
            : `2px solid ${nodeColor}`,
          borderRadius: "10px",
          padding: "12px",
          fontSize: "11px",
          fontFamily: "monospace",
          boxShadow: isSelected ? "0 0 15px rgba(16, 185, 129, 0.25)" : "0 2px 6px rgba(0,0,0,0.06)",
          width: 125,
          textAlign: "center",
          fontWeight: isSelected || isSimulatedNode ? "bold" : "normal",
          cursor: "pointer"
        }
      });
    });

    activeTxList.forEach((tx, idx) => {
      if (displayWallets.includes(tx.sender) && displayWallets.includes(tx.receiver)) {
        const isSimTx = tx.transactionId === simulatedId || tx.transactionId.startsWith("SIM-");
        const isHigh = tx.risk === "High Risk";
        
        let edgeColor = isHigh ? "#DC2626" : tx.risk === "Medium Risk" ? "#D97706" : "#CBD5E1";
        if (isSimTx) {
          edgeColor = "#F59E0B"; // Gold color for simulated pipeline path
        }

        generatedEdges.push({
          id: `e-${idx}-${tx.transactionId}`,
          source: tx.sender,
          target: tx.receiver,
          label: `${tx.amount} BTC${isSimTx ? " [SIM]" : ""}`,
          animated: isHigh || isSimTx,
          style: { 
            stroke: edgeColor, 
            strokeWidth: isSimTx ? 3 : isHigh ? 2.5 : 1.5,
            strokeDasharray: isSimTx ? "5,5" : undefined
          },
          labelStyle: { fill: isSimTx ? "#D97706" : "#475569", fontSize: "10px", fontWeight: "700" },
          labelBgStyle: { fill: "#FFFFFF", fillOpacity: 0.95 }
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [transactions, simulatedTransactions, simulatedId, selectedWallet, sender, receiver]);

  // Selected Wallet node details card computation
  const walletDetails = useMemo(() => {
    if (!selectedWallet) return null;
    const activeList = simulatedTransactions.length ? simulatedTransactions : transactions;
    const related = activeList.filter(t => t.sender === selectedWallet || t.receiver === selectedWallet);
    
    let totalSent = 0;
    let totalRecv = 0;
    let maxRisk = "Low Risk";

    related.forEach(t => {
      const val = parseFloat(t.amount) || 0;
      if (t.sender === selectedWallet) totalSent += val;
      if (t.receiver === selectedWallet) totalRecv += val;
      
      if (t.risk === "High Risk") maxRisk = "High Risk";
      else if (t.risk === "Medium Risk" && maxRisk !== "High Risk") maxRisk = "Medium Risk";
    });

    return {
      address: selectedWallet,
      risk: maxRisk,
      txCount: related.length,
      sent: totalSent.toFixed(4),
      recv: totalRecv.toFixed(4),
      recent: related.slice(0, 5)
    };
  }, [selectedWallet, transactions, simulatedTransactions]);

  const onNodeClick = (event, node) => {
    setSelectedWallet(node.id);
  };

  return (
    <Layout active="Scenario Playground">
      {/* HEADER */}
      <div style={{ marginBottom: "35px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "-1px",
            color: "#1E3A8A",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <FaFlask /> Scenario Playground
        </h1>
        <p style={{ color: "#475569", fontSize: "15px" }}>
          Compliance Sandbox Workspace. Simulate ledger injections to trace real-time GNN risk propagation.
        </p>
      </div>

      {!datasetUploaded && (
        <div className="corporate-card" style={{ padding: "80px 40px", textAlign: "center", background: "#FFFFFF" }}>
          <h2 style={{ color: "#0F172A", marginBottom: "15px" }}>No Dataset Uploaded Yet</h2>
          <p style={{ color: "#475569", fontSize: "17px" }}>Upload a core transaction ledger file first to start simulating scenarios.</p>
        </div>
      )}

      {datasetUploaded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* DELTA PANEL COMPARISON HEADER */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF", borderLeft: "4px solid #1E3A8A" }}>
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>LEDGER STATE</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#0F172A" }}>{originalStats.total}</span>
                <span style={{ color: "#64748B", fontSize: "13px" }}>Original Txs</span>
              </div>
            </div>

            <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF", borderLeft: "4px solid #3B82F6" }}>
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>SIMULATED STATE</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#3B82F6" }}>{simulatedStats.total}</span>
                <span style={{ color: "#64748B", fontSize: "13px" }}>Total nodes</span>
              </div>
            </div>

            <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF", borderLeft: "4px solid #DC2626" }}>
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>HIGH THREAT LEVEL</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#DC2626" }}>
                  {simulatedStats.high}
                </span>
                {simulatedTransactions.length > 0 && simulatedStats.high - originalStats.high !== 0 && (
                  <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: "700" }}>
                    ({simulatedStats.high - originalStats.high > 0 ? "+" : ""}{simulatedStats.high - originalStats.high})
                  </span>
                )}
                <span style={{ color: "#64748B", fontSize: "13px" }}>Flagged cases</span>
              </div>
            </div>

            <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF", borderLeft: "4px solid #D97706" }}>
              <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>RISK PROPAGATIONS</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#D97706" }}>{riskChanges.length}</span>
                <span style={{ color: "#64748B", fontSize: "13px" }}>Wallets shifted</span>
              </div>
            </div>
          </div>

          {/* MAIN SIMULATOR CONTAINER */}
          <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "30px", alignItems: "stretch" }}>
            
            {/* CONTROL PANEL */}
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <div className="corporate-card" style={{ padding: "30px", background: "#FFFFFF" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0F172A", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaSlidersH /> Ingestion Sliders
                </h3>
                
                {errorMsg && (
                  <div style={{ background: "#FEE2E2", borderLeft: "4px solid #EF4444", padding: "12px", borderRadius: "6px", color: "#B91C1C", fontSize: "13px", marginBottom: "15px" }}>
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div style={{ background: "#ECFDF5", borderLeft: "4px solid #10B981", padding: "12px", borderRadius: "6px", color: "#047857", fontSize: "13px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCheck size={12} /> {successMsg}
                  </div>
                )}

                <form onSubmit={handleRunSimulation} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  
                  {/* Sender Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>Sender Wallet Address</label>
                    <input 
                      type="text"
                      list="wallets"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Input sender hash key..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "13px", fontFamily: "monospace" }}
                    />
                  </div>

                  {/* Receiver Address */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>Receiver Wallet Address</label>
                    <input 
                      type="text"
                      list="wallets"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="Input receiver hash key..."
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "13px", fontFamily: "monospace" }}
                    />
                  </div>

                  {/* Datatlist for Autocomplete */}
                  <datalist id="wallets">
                    {existingWallets.map((wallet) => (
                      <option key={wallet} value={wallet} />
                    ))}
                  </datalist>

                  {/* Amount (BTC) */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#64748B", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>Transaction Amount (BTC)</label>
                    <input 
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0000"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "13px" }}
                    />
                  </div>

                  {/* Commit Checkbox */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                    <input 
                      type="checkbox"
                      id="commit-checkbox"
                      checked={commit}
                      onChange={(e) => setCommit(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }}
                    />
                    <label htmlFor="commit-checkbox" style={{ fontSize: "13px", color: "#334155", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaDatabase size={12} color="#1E3A8A" /> Commit to Database
                    </label>
                  </div>

                  {/* CTA Buttons */}
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: "#1E3A8A",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? (
                        <FaSync className="spin" style={{ animation: "spin 1s linear infinite" }} />
                      ) : (
                        <FaPlay size={10} />
                      )}
                      {loading ? "Simulating..." : "Run Simulation"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      style={{
                        background: "#F1F5F9",
                        color: "#475569",
                        border: "1px solid #E2E8F0",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer"
                      }}
                    >
                      Reset
                    </button>
                  </div>

                </form>
              </div>

              {/* RISK CHANGE DETECTOR LOG */}
              {simulatedTransactions.length > 0 && (
                <div className="corporate-card" style={{ padding: "25px", background: "#FFFFFF", flex: 1, maxHeight: "250px", overflowY: "auto" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0F172A", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaExclamationTriangle color="#D97706" /> Risk Shifts Detected
                  </h4>
                  
                  {riskChanges.length === 0 ? (
                    <p style={{ color: "#64748B", fontSize: "13px", textAlign: "center", marginTop: "15px" }}>
                      GNN node risk propagation resulted in no class changes.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {riskChanges.map((change, i) => (
                        <div 
                          key={i}
                          style={{
                            background: "#FFFBEB",
                            border: "1px solid #FDE68A",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            fontSize: "12px"
                          }}
                        >
                          <span style={{ fontFamily: "monospace", fontWeight: "700", color: "#1E3A8A", display: "block", marginBottom: "4px" }}>
                            {change.wallet.substring(0, 16)}...
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
                            <span>{change.before}</span>
                            <span>➔</span>
                            <span style={{ fontWeight: "700", color: change.after === "High Risk" ? "#DC2626" : "#D97706" }}>
                              {change.after}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* REACTFLOW VISUAL CANVAS */}
            <div className="corporate-card" style={{ padding: "20px", background: "#FFFFFF", display: "flex", gap: "20px", height: "650px" }}>
              <div style={{ flex: 1, position: "relative", border: "1px solid #E2E8F0", borderRadius: "12px", background: "#F8FAFC", overflow: "hidden" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  fitView
                >
                  <Background color="#CBD5E1" gap={16} />
                  <Controls style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "8px" }} />
                  <MiniMap 
                    nodeStrokeColor={(n) => {
                      if (n.style?.border?.includes("#DC2626")) return "#DC2626";
                      if (n.style?.border?.includes("#D97706")) return "#D97706";
                      return "#1E3A8A";
                    }}
                    nodeColor={() => "#FFFFFF"}
                    maskColor="rgba(241, 245, 249, 0.7)"
                    style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                  />
                </ReactFlow>

                {/* Simulated Path Indicator Badge */}
                {simulatedId && (
                  <div style={{ position: "absolute", top: "15px", left: "15px", background: "rgba(254, 243, 199, 0.95)", border: "1px solid #FCD34D", color: "#B45309", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", pointerEvents: "none" }}>
                    ⚡ SIMULATING PATH ACTIVE
                  </div>
                )}
              </div>

              {/* AUDIT NODE SIDEBAR */}
              {walletDetails && (
                <div style={{ width: "320px", display: "flex", flexDirection: "column", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "20px", background: "#FFFFFF", overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0F172A", margin: 0 }}>Wallet Audit</h4>
                    <button 
                      onClick={() => setSelectedWallet(null)}
                      style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase" }}>Wallet key</span>
                    <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#1E3A8A", wordBreak: "break-all", fontWeight: "700", margin: "4px 0" }}>
                      {walletDetails.address}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                    <div style={{ background: "#F8FAFC", padding: "8px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "9px", color: "#64748B" }}>Risk Level</span>
                      <p style={{ fontSize: "12px", fontWeight: "800", margin: "2px 0 0 0", color: walletDetails.risk === "High Risk" ? "#DC2626" : walletDetails.risk === "Medium Risk" ? "#D97706" : "#059669" }}>
                        {walletDetails.risk}
                      </p>
                    </div>
                    <div style={{ background: "#F8FAFC", padding: "8px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: "9px", color: "#64748B" }}>Total Txs</span>
                      <p style={{ fontSize: "12px", fontWeight: "800", margin: "2px 0 0 0" }}>
                        {walletDetails.txCount}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: "#64748B" }}>Sent Volume</span>
                      <span style={{ fontWeight: "700" }}>{walletDetails.sent} BTC</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: "#64748B" }}>Received Volume</span>
                      <span style={{ fontWeight: "700" }}>{walletDetails.recv} BTC</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Recent Local Ledger Flows</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {walletDetails.recent.map((tx, idx) => {
                        const isSender = tx.sender === selectedWallet;
                        const isSim = tx.transactionId === simulatedId || tx.transactionId.startsWith("SIM-");
                        return (
                          <div 
                            key={idx}
                            style={{
                              background: isSim ? "#FFFBEB" : "#F8FAFC",
                              border: "1px solid #E2E8F0",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <span style={{ color: isSender ? "#DC2626" : "#059669", fontWeight: "700" }}>
                              {isSender ? "OUT" : "IN"}{isSim ? " [SIM]" : ""}
                            </span>
                            <span style={{ color: "#475569", fontFamily: "monospace" }}>
                              {isSender ? `${tx.receiver.substring(0, 6)}...` : `${tx.sender.substring(0, 6)}...`}
                            </span>
                            <span style={{ fontWeight: "700" }}>
                              {tx.amount} BTC
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SPIN ANIMATION STYLES */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </Layout>
  );
}
