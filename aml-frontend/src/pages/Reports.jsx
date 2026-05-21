import { useContext, useState, useEffect } from "react";
import { 
  FaFileAlt, 
  FaDownload, 
  FaExclamationTriangle, 
  FaSearch, 
  FaBrain, 
  FaSpinner, 
  FaCheck, 
  FaEdit, 
  FaSync, 
  FaTimes 
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import axios from "axios";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

export default function Reports() {
  const { datasetUploaded, transactions } = useContext(DataContext);
  const [generated, setGenerated] = useState(false);

  // AI Narrative states
  const [selectedReport, setSelectedReport] = useState(null);
  const [llmNarrative, setLlmNarrative] = useState("");
  const [llmLoading, setLlmLoading] = useState(false);
  const [promptInstruction, setPromptInstruction] = useState("");
  const [focusType, setFocusType] = useState("standard");
  const [isTyping, setIsTyping] = useState(false);

  // Trigger narrative generation
  const handleGenerateNarrative = async (reportId, type = "standard", instruction = "") => {
    setLlmLoading(true);
    setIsTyping(true);
    setLlmNarrative("");
    try {
      const token = localStorage.getItem("aml_token");
      const res = await axios.post("/api/transactions/generate-narrative", {
        reportId,
        focusType: type,
        promptInstruction: instruction
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data && res.data.narrative) {
        const fullText = res.data.narrative;
        let index = 0;
        setLlmNarrative("");
        
        // Simulating streaming typewriter effect
        const streamInterval = setInterval(() => {
          setLlmNarrative((prev) => prev + fullText.charAt(index));
          index++;
          if (index >= fullText.length) {
            clearInterval(streamInterval);
            setIsTyping(false);
          }
        }, 2); // Fast stream 2ms
      }
    } catch (err) {
      console.error(err);
      setLlmNarrative("Error generating compliance narrative. Please make sure your backend is running and you have transactions uploaded.");
      setIsTyping(false);
    } finally {
      setLlmLoading(false);
    }
  };

  const handleOpenWorkspace = (reportId) => {
    setSelectedReport(reportId);
    setPromptInstruction("");
    setFocusType(reportId === "SAR-2026-0041" ? "gnn" : reportId === "STR-2026-0012" ? "modularity" : "volume");
    handleGenerateNarrative(reportId, reportId === "SAR-2026-0041" ? "gnn" : reportId === "STR-2026-0012" ? "modularity" : "volume", "");
  };

  const handleDownloadPDF = (reportId) => {
    const doc = new jsPDF();
    const highRiskTxs = transactions.filter(t => t.risk === "High Risk");
    const mediumRiskTxs = transactions.filter(t => t.risk === "Medium Risk");
    const totalVolume = transactions.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
    const flaggedVolume = highRiskTxs.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);

    // Styling configuration
    const primaryColor = [30, 58, 138]; // #1E3A8A
    const darkSlate = [15, 23, 42]; // #0F172A
    const grayText = [71, 85, 105]; // #475569

    // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("AML SHIELD COMPLIANCE SUITE", 20, 25);

    doc.setFontSize(9);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFont("Helvetica", "normal");
    doc.text("AUTOMATED FINANCIAL COMPLIANCE AUDIT & THREAT INTELLIGENCE", 20, 31);
    doc.line(20, 35, 190, 35);

    // Meta details
    doc.setFontSize(10);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont("Helvetica", "bold");
    doc.text(`REPORT ID: ${reportId}`, 20, 43);
    doc.setFont("Helvetica", "normal");
    doc.text(`Generated On: ${new Date().toLocaleString("en-IN")}`, 20, 49);
    doc.text(`Regulatory Framework: FIU/FinCEN SAR Directive`, 20, 55);

    let reportTitle = "";
    let reportDesc = "";
    let focusAreaText = "";

    if (reportId === "SAR-2026-0041") {
      reportTitle = "GNN Fraud Network Investigation Summary";
      reportDesc = "This report focuses on Graph Neural Network (GNN) threat classification, analyzing wallet relationships, node degrees, and transaction-centric flow connections. The GAT model maps neighborhood vectors to identify clusters with high similarity to blacklisted laundering addresses.";
      focusAreaText = `Attribution focus: Graph Attention Network (GAT) classification probability >= 0.70. Identified ${highRiskTxs.length} high-threat nodes showing anomalous connectivity mapping.`;
    } else if (reportId === "STR-2026-0012") {
      reportTitle = "Suspicious Wallet Mixers Attribution Audit";
      reportDesc = "This STR (Suspicious Transaction Report) focuses on interaction pathways with privacy-enhancing mixers or washing services. It highlights modularity clusters containing high concentrations of suspicious wallet transfers.";
      focusAreaText = `Attribution focus: Community cluster analysis and anomaly scores. Identified modularity sub-graphs showing abnormal flow behavior.`;
    } else {
      reportTitle = "Multi-Hop Laundering Chain Loop Report";
      reportDesc = "This report details path routing loops and cascading multi-hop transfers. It flags high-velocity transactions designed to split, layer, and merge funds across distinct intermediary wallets.";
      focusAreaText = `Attribution focus: Multi-hop transaction sequences and flow looping. Found suspicious linear path structures with high entropy.`;
    }

    doc.setFontSize(13);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(reportTitle, 20, 67);

    // Split and output description (supporting multi-page LLM narratives)
    const narrativeText = (selectedReport === reportId && llmNarrative) ? llmNarrative : reportDesc;
    const splitDesc = doc.splitTextToSize(narrativeText, 170);
    
    let currentY = 74;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    
    splitDesc.forEach((line) => {
      if (currentY > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(line, 20, currentY);
      currentY += 5;
    });
    currentY += 8;

    // Section 1: Executive Summary
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. Threat Assessment & Focus", 20, currentY);
    currentY += 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    const splitFocus = doc.splitTextToSize(focusAreaText, 170);
    doc.text(splitFocus, 20, currentY);
    currentY += splitFocus.length * 5 + 8;

    // Section 2: Aggregated Indicators
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("2. Key Network Threat Metrics", 20, currentY);
    currentY += 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`• Total Audited Transactions: ${transactions.length}`, 22, currentY); currentY += 5;
    doc.text(`• High Risk Flagged: ${highRiskTxs.length} cases`, 22, currentY); currentY += 5;
    doc.text(`• Medium Risk Alerts: ${mediumRiskTxs.length} cases`, 22, currentY); currentY += 5;
    doc.text(`• Total Volume Ingested: ${totalVolume.toFixed(4)} BTC`, 22, currentY); currentY += 5;
    doc.text(`• Flagged Threat Volume: ${flaggedVolume.toFixed(4)} BTC (${((flaggedVolume / totalVolume) * 100 || 0).toFixed(2)}% of total)`, 22, currentY); currentY += 8;

    // Section 3: High-Risk Ledger Table
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("3. Flagged Ledger Activity Detail (Top High-Risk)", 20, currentY);
    currentY += 6;

    // Table Headers
    doc.setFontSize(8);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text("TXID", 20, currentY);
    doc.text("Sender Address", 42, currentY);
    doc.text("Receiver Address", 96, currentY);
    doc.text("Amount (BTC)", 150, currentY);
    doc.text("Threat Score", 174, currentY);
    doc.line(20, currentY + 2, 190, currentY + 2);
    currentY += 7;

    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFont("Helvetica", "normal");

    // Print top high-risk transactions
    const displayList = reportId === "SAR-2026-0038" ? [...highRiskTxs, ...mediumRiskTxs].slice(0, 15) : highRiskTxs.slice(0, 15);
    if (displayList.length === 0) {
      doc.text("No transactions flagged matching this criteria.", 20, currentY);
      currentY += 8;
    } else {
      doc.setFontSize(8);
      displayList.forEach(tx => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
          
          // Re-draw headers on new page
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(grayText[0], grayText[1], grayText[2]);
          doc.text("TXID", 20, currentY);
          doc.text("Sender Address", 42, currentY);
          doc.text("Receiver Address", 96, currentY);
          doc.text("Amount (BTC)", 150, currentY);
          doc.text("Threat Score", 174, currentY);
          doc.line(20, currentY + 2, 190, currentY + 2);
          currentY += 7;
          doc.setFont("Helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
        }
        doc.text(String(tx.transactionId || "—"), 20, currentY);
        doc.text(String(tx.sender || "—").substring(0, 24), 42, currentY);
        doc.text(String(tx.receiver || "—").substring(0, 24), 96, currentY);
        doc.text(parseFloat(tx.amount || 0).toFixed(4), 150, currentY);
        doc.text(parseFloat(tx.score || 0).toFixed(4), 174, currentY);
        currentY += 5;
      });
    }

    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // Section 4: Endorsement
    currentY += 10;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("4. Endorsement & Regulatory Sign-Off", 20, currentY);
    currentY += 6;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text("I hereby certify that the above network structures and transaction trails have been audited and verified", 20, currentY); currentY += 4;
    doc.text("for submittal to standard regulatory reporting registries under FinCEN / FIU protocol mandates.", 20, currentY); currentY += 8;
    doc.text("Compliance Officer Signature: ___________________________", 20, currentY); currentY += 5;
    doc.text(`Verification Timestamp: ${new Date().toISOString()}`, 20, currentY);

    // Save PDF
    doc.save(`Compliance_Report_${reportId}.pdf`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(llmNarrative);
    alert("Narrative copied to clipboard!");
  };

  return (
    <Layout active="Reports">
      {/* TOPBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", color: "#1E3A8A", marginBottom: "8px" }}>
            Compliance Reports
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Generate and export SAR/STR financial intelligence documents for law enforcement
          </p>
        </div>

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
            placeholder="Search reports..."
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
          <p style={{ color: "#475569", fontSize: "17px" }}>Upload a transaction dataset to generate AML reports.</p>
        </div>
      )}

      {/* MAIN */}
      {datasetUploaded && (
        <>
          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "25px", marginBottom: "35px" }}>
            <StatCard icon={<FaFileAlt size={20} />} title="Generated Reports" value={generated ? "3" : "0"} color="#1E3A8A" />
            <StatCard icon={<FaDownload size={20} />} title="Exported Reports" value={generated ? "3" : "0"} color="#059669" />
            <StatCard icon={<FaExclamationTriangle size={20} />} title="Critical Audits" value={transactions.filter(t => t.risk === "High Risk").length} color="#DC2626" danger />
          </div>

          {/* REPORT PANEL GRID */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            <div className="corporate-card" style={{ padding: "35px", background: "#FFFFFF" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                  <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>AML Investigation Report Engine</h2>
                  <p style={{ color: "#475569", fontSize: "14px" }}>
                    Compile and customize regulatory activity narratives mapped directly from ML pipeline outputs.
                  </p>
                </div>

                <button
                  onClick={() => setGenerated(true)}
                  className="neon-btn"
                  style={{ padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#1E3A8A", color: "#FFFFFF" }}
                >
                  <FaFileAlt />
                  Generate Reports
                </button>
              </div>

              {/* EMPTY */}
              {!generated && (
                <div style={{ height: "250px", borderRadius: "16px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid #E2E8F0" }}>
                  <div>
                    <h2 style={{ color: "#0F172A", marginBottom: "15px", fontSize: "18px" }}>No Reports Compiled</h2>
                    <p style={{ color: "#475569" }}>Click "Generate Reports" to initialize regulatory templates.</p>
                  </div>
                </div>
              )}

              {/* SPLIT LAYOUT FOR REPORTS & LLM WORKSPACE */}
              {generated && (
                <div style={{ display: "flex", gap: "30px", alignItems: "stretch", flexWrap: "wrap" }}>
                  
                  {/* Left Column: Report List */}
                  <div style={{ flex: 1, minWidth: "320px", display: "flex", flexDirection: "column", gap: "15px" }}>
                    <ReportCard 
                      title="GNN Fraud Network Investigation Summary" 
                      status="High Risk" 
                      label="SAR-2026-0041" 
                      statusColor="#DC2626" 
                      onDownload={() => handleDownloadPDF("SAR-2026-0041")} 
                      onOpenNarrative={() => handleOpenWorkspace("SAR-2026-0041")}
                      isActive={selectedReport === "SAR-2026-0041"}
                    />
                    <ReportCard 
                      title="Suspicious Wallet Mixers Attribution Audit" 
                      status="Critical Action" 
                      label="STR-2026-0012" 
                      statusColor="#DC2626" 
                      onDownload={() => handleDownloadPDF("STR-2026-0012")} 
                      onOpenNarrative={() => handleOpenWorkspace("STR-2026-0012")}
                      isActive={selectedReport === "STR-2026-0012"}
                    />
                    <ReportCard 
                      title="Multi-Hop Laundering Chain Loop Report" 
                      status="Moderate Audit" 
                      label="SAR-2026-0038" 
                      statusColor="#D97706" 
                      onDownload={() => handleDownloadPDF("SAR-2026-0038")} 
                      onOpenNarrative={() => handleOpenWorkspace("SAR-2026-0038")}
                      isActive={selectedReport === "SAR-2026-0038"}
                    />
                  </div>

                  {/* Right Column: AI Narrative Workspace Panel */}
                  <div style={{ flex: 1.2, minWidth: "400px" }}>
                    {!selectedReport ? (
                      <div style={{ height: "100%", minHeight: "350px", borderRadius: "16px", background: "#F8FAFC", border: "1px dashed #CBD5E1", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "30px" }}>
                        <div>
                          <FaBrain size={40} color="#64748B" style={{ marginBottom: "15px" }} />
                          <h3 style={{ color: "#0F172A", marginBottom: "8px", fontSize: "16px", fontWeight: "700" }}>AI Narrative Workspace</h3>
                          <p style={{ color: "#475569", fontSize: "13px", maxWidth: "300px" }}>
                            Click "AI Narrative" on any report to auto-write regulatory descriptions, refine metrics prompts, and export custom audits.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div 
                        style={{ 
                          background: "#FFFFFF", 
                          border: "2px solid #1E3A8A", 
                          borderRadius: "16px", 
                          padding: "25px", 
                          boxShadow: "0 10px 25px -5px rgba(30, 58, 138, 0.1)", 
                          position: "relative" 
                        }}
                      >
                        {/* Close button */}
                        <button 
                          onClick={() => setSelectedReport(null)} 
                          style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", color: "#64748B", cursor: "pointer" }}
                        >
                          <FaTimes size={16} />
                        </button>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                          <FaBrain color="#1E3A8A" size={18} />
                          <h3 style={{ color: "#1E3A8A", fontSize: "16px", fontWeight: "800", margin: 0 }}>
                            AI Narrative Workspace ({selectedReport})
                          </h3>
                        </div>

                        {/* Focus Selection & Settings Grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                          <div>
                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "5px" }}>NARRATIVE FOCUS</label>
                            <select 
                              value={focusType}
                              onChange={(e) => {
                                setFocusType(e.target.value);
                                handleGenerateNarrative(selectedReport, e.target.value, promptInstruction);
                              }}
                              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", color: "#0F172A", background: "#FFFFFF" }}
                            >
                              <option value="standard">Standard Compliance</option>
                              <option value="gnn">GNN Topology Threat</option>
                              <option value="modularity">Modularity Cluster Focus</option>
                              <option value="volume">Flow Volume Outliers</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "5px" }}>REPORT STATUS</label>
                            <div style={{ padding: "8px 12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "13px", fontWeight: "700", color: "#DC2626" }}>
                              Pending Endorsement
                            </div>
                          </div>
                        </div>

                        {/* Prompt Custom Instructions */}
                        <div style={{ marginBottom: "15px" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "5px" }}>
                            LLM PROMPT INSTRUCTIONS (REGENERATE THE NARRATIVE DYNAMICALLY)
                          </label>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <input 
                              type="text" 
                              placeholder="e.g. 'Keep it concise', 'Add ransomware caution flag'..."
                              value={promptInstruction}
                              onChange={(e) => setPromptInstruction(e.target.value)}
                              style={{ flex: 1, padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px" }}
                            />
                            <button
                              onClick={() => handleGenerateNarrative(selectedReport, focusType, promptInstruction)}
                              disabled={llmLoading || isTyping}
                              style={{ padding: "8px 15px", background: "#1E3A8A", color: "#FFFFFF", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600" }}
                            >
                              {llmLoading ? <FaSpinner className="spin" size={12} style={{ animation: "spin 1s linear infinite" }} /> : <FaSync size={12} />}
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* Narrative Content Textarea */}
                        <div style={{ marginBottom: "20px", position: "relative" }}>
                          <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "5px" }}>
                            REGULATORY SAR SUMMARY NARRATIVE (EDITABLE)
                          </label>
                          {llmLoading && llmNarrative === "" ? (
                            <div style={{ height: "200px", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                              <FaSpinner className="spin" size={30} color="#1E3A8A" style={{ animation: "spin 1s linear infinite" }} />
                              <span style={{ fontSize: "12px", color: "#475569", fontWeight: "600" }}>Synthesizing network paths...</span>
                            </div>
                          ) : (
                            <textarea
                              value={llmNarrative}
                              onChange={(e) => setLlmNarrative(e.target.value)}
                              rows={10}
                              style={{ 
                                width: "100%", 
                                padding: "15px", 
                                borderRadius: "10px", 
                                border: "1px solid #CBD5E1", 
                                fontSize: "13px", 
                                fontFamily: "monospace", 
                                lineHeight: "1.5", 
                                background: isTyping ? "#F8FAFC" : "#FFFFFF",
                                color: "#0F172A",
                                resize: "vertical"
                              }}
                            />
                          )}
                          {isTyping && (
                            <div style={{ position: "absolute", bottom: "10px", right: "15px", fontSize: "11px", color: "#1E3A8A", fontWeight: "700", background: "rgba(255,255,255,0.85)", padding: "2px 8px", borderRadius: "4px" }}>
                              Streaming AI narrative...
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                          <button
                            onClick={copyToClipboard}
                            disabled={llmNarrative === ""}
                            style={{ padding: "10px 18px", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#FFFFFF", color: "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            Copy text
                          </button>
                          
                          <button
                            onClick={() => handleDownloadPDF(selectedReport)}
                            disabled={llmNarrative === ""}
                            style={{ padding: "10px 20px", background: "#059669", color: "#FFFFFF", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <FaDownload size={12} />
                            Download Certified Report PDF
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}

function ReportCard({ title, status, label, statusColor, onDownload, onOpenNarrative, isActive }) {
  return (
    <div
      style={{
        background: isActive ? "#F0F4FF" : "#F8FAFC",
        borderRadius: "14px",
        padding: "24px 28px",
        border: isActive ? "2px solid #1E3A8A" : "1px solid #E2E8F0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "#1E3A8A";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      <div style={{ flex: 1, minWidth: "240px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#1E3A8A", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>
          {label}
        </span>
        <h3 style={{ color: "#0F172A", margin: "5px 0 6px 0", fontSize: "16px", fontWeight: "700" }}>{title}</h3>
        <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Automated regulatory submission prepared for FIU audit</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <span
          style={{
            background: statusColor === "#DC2626" ? "rgba(220,38,38,0.06)" : "rgba(217,119,6,0.06)",
            color: statusColor,
            border: statusColor === "#DC2626" ? "1px solid rgba(220,38,38,0.15)" : "1px solid rgba(217,119,6,0.15)",
            padding: "6px 14px",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "12px",
            whiteSpace: "nowrap"
          }}
        >
          {status}
        </span>

        {/* AI Workspace Button */}
        <button
          onClick={onOpenNarrative}
          style={{ 
            padding: "10px 18px", 
            fontSize: "13px", 
            background: isActive ? "#1E3A8A" : "#FFFFFF", 
            color: isActive ? "#FFFFFF" : "#1E3A8A", 
            border: `1px solid #1E3A8A`,
            borderRadius: "10px",
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          <FaBrain size={12} />
          AI Narrative
        </button>

        <button
          onClick={onDownload}
          className="neon-btn"
          style={{ padding: "10px 18px", fontSize: "13px", background: "#1E3A8A", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <FaDownload size={12} />
          Download PDF
        </button>
      </div>
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