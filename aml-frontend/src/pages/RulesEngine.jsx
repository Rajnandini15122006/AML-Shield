import { useState, useEffect, useContext } from "react";
import { 
  FaWrench, 
  FaFlask, 
  FaPlay, 
  FaPlus, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaToggleOn, 
  FaToggleOff,
  FaShieldAlt,
  FaInfoCircle
} from "react-icons/fa";
import axios from "axios";
import Layout from "../components/Layout";
import { DataContext } from "../context/DataContext";

export default function RulesEngine() {
  const { datasetUploaded } = useContext(DataContext);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Rule builder form state
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRulePriority, setNewRulePriority] = useState("Medium");
  const [newRuleAction, setNewRuleAction] = useState("Flag for Review");
  const [conditions, setConditions] = useState([
    { field: "amount", operator: ">", value: "1.0" }
  ]);
  const [formError, setFormError] = useState("");

  // Sandbox simulation states
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResults, setEvalResults] = useState(null);

  // Fetch all rules on load
  const fetchRules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("aml_token");
      const res = await axios.get("/api/rules", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(res.data);
    } catch (error) {
      console.error("Failed to fetch compliance rules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Handle condition builder row updates
  const handleConditionChange = (index, key, val) => {
    const updated = [...conditions];
    updated[index][key] = val;
    setConditions(updated);
  };

  const addConditionRow = () => {
    setConditions([...conditions, { field: "amount", operator: ">", value: "1.0" }]);
  };

  const removeConditionRow = (index) => {
    if (conditions.length === 1) return;
    setConditions(conditions.filter((_, idx) => idx !== index));
  };

  // Add rule submission
  const handleCreateRule = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!newRuleName.trim()) {
      setFormError("Rule name is required.");
      return;
    }

    // Validate conditions
    for (let c of conditions) {
      if (!c.value || isNaN(parseFloat(c.value))) {
        setFormError("Each condition must specify a valid numeric threshold.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("aml_token");
      const res = await axios.post("/api/rules", {
        name: newRuleName,
        description: newRuleDesc,
        priority: newRulePriority,
        action: newRuleAction,
        conditions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRules([...rules, res.data]);
      
      // Reset form
      setNewRuleName("");
      setNewRuleDesc("");
      setNewRulePriority("Medium");
      setNewRuleAction("Flag for Review");
      setConditions([{ field: "amount", operator: ">", value: "1.0" }]);
    } catch (error) {
      console.error(error);
      setFormError("Failed to save the custom compliance rule.");
    }
  };

  // Toggle rule status (Active / Inactive)
  const handleToggleStatus = async (ruleId, currentStatus) => {
    try {
      const token = localStorage.getItem("aml_token");
      const res = await axios.put(`/api/rules/${ruleId}`, {
        status: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRules(rules.map(r => r._id === ruleId ? res.data : r));
    } catch (error) {
      console.error("Failed to toggle rule status:", error);
    }
  };

  // Delete a rule
  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this compliance rule?")) return;
    try {
      const token = localStorage.getItem("aml_token");
      await axios.delete(`/api/rules/${ruleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRules(rules.filter(r => r._id !== ruleId));
    } catch (error) {
      console.error("Failed to delete compliance rule:", error);
    }
  };

  // Run Rules Sandbox Evaluation Engine
  const handleRunSandbox = async () => {
    setEvalLoading(true);
    setEvalResults(null);
    try {
      const token = localStorage.getItem("aml_token");
      const res = await axios.post("/api/rules/evaluate", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvalResults(res.data);
    } catch (error) {
      console.error("Sandbox execution error:", error);
      alert("Error evaluating compliance sandbox. Please check database transactions.");
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <Layout active="Rules Engine">
      {/* TOPBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-1px", color: "#1E3A8A", marginBottom: "8px" }}>
            Hybrid Compliance Rules Engine
          </h1>
          <p style={{ color: "#475569", fontSize: "15px" }}>
            Configure visual risk blocks matching static thresholds with ensembled Graph Neural Network scores
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
        
        {/* FIRST LAYER: RULE REGISTRY & VISUAL BUILDER */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px", alignItems: "start", flexWrap: "wrap" }}>
          
          {/* LEFT: RULES REGISTRY LIST */}
          <div className="corporate-card" style={{ padding: "30px", background: "#FFFFFF", minHeight: "500px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaWrench color="#1E3A8A" size={18} />
                <h2 style={{ color: "#0F172A", fontSize: "18px", fontWeight: "800", margin: 0 }}>Rules Registry</h2>
              </div>
              <span style={{ fontSize: "12px", background: "#EFF6FF", color: "#1E3A8A", fontWeight: "700", padding: "4px 10px", borderRadius: "10px", border: "1px solid #DBEAFE" }}>
                {rules.length} Rules Registered
              </span>
            </div>

            {loading ? (
              <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                <FaSpinner className="spin" size={30} color="#1E3A8A" style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: "13px", color: "#475569" }}>Retrieving registry rules...</span>
              </div>
            ) : rules.length === 0 ? (
              <div style={{ height: "300px", background: "#F8FAFC", border: "1px dashed #CBD5E1", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                <div>
                  <h3 style={{ color: "#0F172A", marginBottom: "8px", fontSize: "15px" }}>No Rules In Registry</h3>
                  <p style={{ color: "#475569", fontSize: "13px" }}>Create a rule using the Visual Rule Builder to start compliance filtering.</p>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {rules.map((rule) => {
                  const priorityColor = rule.priority === "High" ? "#DC2626" : rule.priority === "Medium" ? "#D97706" : "#059669";
                  return (
                    <div 
                      key={rule._id}
                      style={{
                        background: rule.status ? "#FFFFFF" : "#F8FAFC",
                        border: rule.status ? "1px solid #E2E8F0" : "1px solid #CBD5E1",
                        borderRadius: "14px",
                        padding: "18px 22px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                        transition: "all 0.2s",
                        opacity: rule.status ? 1 : 0.75
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "10px" }}>
                        <div>
                          <h3 style={{ color: "#0F172A", margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700" }}>{rule.name}</h3>
                          <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>{rule.description || "No description provided."}</p>
                        </div>
                        
                        {/* TOGGLE & ACTIONS */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <button
                            onClick={() => handleToggleStatus(rule._id, rule.status)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", color: rule.status ? "#1E3A8A" : "#94A3B8" }}
                          >
                            {rule.status ? <FaToggleOn size={26} /> : <FaToggleOff size={26} />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteRule(rule._id)}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#EF4444" }}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>

                      {/* CONDITIONS SUMMARY */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0", padding: "10px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748B", textTransform: "uppercase", display: "flex", alignItems: "center" }}>Conditions:</span>
                        {rule.conditions.map((c, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              fontSize: "11px", 
                              fontWeight: "600", 
                              color: "#1E3A8A", 
                              background: "#EFF6FF", 
                              padding: "2px 8px", 
                              borderRadius: "6px",
                              fontFamily: "monospace"
                            }}
                          >
                            {c.field} {c.operator} {c.value}
                          </span>
                        ))}
                      </div>

                      {/* FOOTER RISKS / METRICS */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <span style={{ color: priorityColor, fontWeight: "800", textTransform: "uppercase" }}>
                            {rule.priority} Priority
                          </span>
                          <span style={{ color: "#64748B" }}>•</span>
                          <span style={{ color: "#475569", fontWeight: "700" }}>
                            Action: {rule.action}
                          </span>
                        </div>

                        <span style={{ color: rule.status ? "#059669" : "#64748B", fontWeight: "700" }}>
                          {rule.status ? "ACTIVE" : "DISABLED"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: VISUAL RULE BUILDER */}
          <div className="corporate-card" style={{ padding: "30px", background: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <FaFlask color="#1E3A8A" size={18} />
              <h2 style={{ color: "#0F172A", fontSize: "18px", fontWeight: "800", margin: 0 }}>Visual Rule Builder</h2>
            </div>

            <form onSubmit={handleCreateRule} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div>
                <label style={{ fontSize: "11px", fontWeight: "800", color: "#475569", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Rule Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Isolation Outlier > 0.90" 
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", fontWeight: "800", color: "#475569", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Rule Description</label>
                <textarea 
                  placeholder="Summarize compliance parameters..." 
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px", resize: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: "800", color: "#475569", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Priority Level</label>
                  <select 
                    value={newRulePriority}
                    onChange={(e) => setNewRulePriority(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px", color: "#0F172A", background: "#FFFFFF" }}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: "800", color: "#475569", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>Compliance Action</label>
                  <select 
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "13px", color: "#0F172A", background: "#FFFFFF" }}
                  >
                    <option value="Flag for Review">Flag for Review</option>
                    <option value="Manual Audit">Manual Audit</option>
                    <option value="Immediate Block">Immediate Block</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC CONDITION BUILDER MATRIX */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase" }}>Logical Conditions (AND)</label>
                  <button
                    type="button"
                    onClick={addConditionRow}
                    style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#1E3A8A", fontWeight: "700" }}
                  >
                    <FaPlus size={8} /> Add Condition
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {conditions.map((cond, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      
                      <select 
                        value={cond.field}
                        onChange={(e) => handleConditionChange(index, "field", e.target.value)}
                        style={{ flex: 1.5, padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "12px", background: "#FFFFFF" }}
                      >
                        <option value="amount">Amount (BTC)</option>
                        <option value="gnnScore">GNN Score</option>
                        <option value="anomalyScore">Anomaly Score</option>
                        <option value="clusterRisk">Cluster Risk</option>
                      </select>

                      <select 
                        value={cond.operator}
                        onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
                        style={{ flex: 0.8, padding: "8px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "12px", background: "#FFFFFF", fontWeight: "700" }}
                      >
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&gt;=</option>
                        <option value="<=">&lt;=</option>
                        <option value="==">==</option>
                      </select>

                      <input 
                        type="text" 
                        placeholder="Value" 
                        value={cond.value}
                        onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                        style={{ flex: 1, padding: "8px 10px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "12px" }}
                      />

                      <button
                        type="button"
                        onClick={() => removeConditionRow(index)}
                        disabled={conditions.length === 1}
                        style={{ padding: "8px", background: "transparent", border: "none", cursor: conditions.length === 1 ? "not-allowed" : "pointer", color: conditions.length === 1 ? "#CBD5E1" : "#EF4444" }}
                      >
                        <FaTrash size={12} />
                      </button>

                    </div>
                  ))}
                </div>
              </div>

              {formError && (
                <div style={{ color: "#EF4444", fontSize: "12px", fontWeight: "700" }}>
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="neon-btn"
                style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: "#1E3A8A", color: "#FFFFFF", border: "none" }}
              >
                <FaCheck /> Save Compliance Rule
              </button>

            </form>
          </div>

        </div>

        {/* SECOND LAYER: SANDBOX EVALUATION CONSOLE */}
        <div className="corporate-card" style={{ padding: "35px", background: "#FFFFFF" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <FaShieldAlt color="#1E3A8A" size={18} />
                <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "800", margin: 0 }}>Sandbox Evaluation Console</h2>
              </div>
              <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
                Test compliance rule vectors against live uploaded transactions. Check triggers and action outcomes immediately.
              </p>
            </div>

            <button
              onClick={handleRunSandbox}
              disabled={evalLoading || !datasetUploaded}
              className="neon-btn"
              style={{ padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: "10px", background: "#10B981", color: "#FFFFFF" }}
            >
              {evalLoading ? <FaSpinner className="spin" size={14} style={{ animation: "spin 1s linear infinite" }} /> : <FaPlay size={12} />}
              Run Rules Engine Sandbox
            </button>
          </div>

          {!datasetUploaded && (
            <div style={{ height: "200px", borderRadius: "16px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px dashed #CBD5E1" }}>
              <div>
                <FaInfoCircle size={30} color="#64748B" style={{ marginBottom: "12px" }} />
                <h3 style={{ color: "#0F172A", marginBottom: "6px", fontSize: "15px" }}>Upload Dataset First</h3>
                <p style={{ color: "#475569", fontSize: "13px" }}>Please upload a transaction dataset on the Dashboard to execute rules evaluation.</p>
              </div>
            </div>
          )}

          {datasetUploaded && !evalLoading && !evalResults && (
            <div style={{ height: "200px", borderRadius: "16px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", border: "1px solid #E2E8F0" }}>
              <div>
                <h3 style={{ color: "#0F172A", marginBottom: "8px", fontSize: "15px" }}>Sandbox Off-line</h3>
                <p style={{ color: "#475569", fontSize: "13px" }}>Click "Run Rules Engine Sandbox" to evaluate active database rules.</p>
              </div>
            </div>
          )}

          {/* SANDBOX METRICS & DETAILS DETAILED OUTPUT GRID */}
          {evalResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              
              {/* METRICS ROW */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
                <div style={{ background: "#F8FAFC", padding: "20px", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
                  <span style={{ fontSize: "10px", color: "#64748B", fontWeight: "700", textTransform: "uppercase" }}>Transactions Audited</span>
                  <h2 style={{ fontSize: "28px", color: "#0F172A", margin: "5px 0 0 0", fontWeight: "800" }}>{evalResults.totalEvaluated}</h2>
                </div>
                
                <div style={{ background: "#FFFBEB", padding: "20px", borderRadius: "14px", border: "1px solid #FDE68A" }}>
                  <span style={{ fontSize: "10px", color: "#D97706", fontWeight: "700", textTransform: "uppercase" }}>Rule Violations Triggered</span>
                  <h2 style={{ fontSize: "28px", color: "#D97706", margin: "5px 0 0 0", fontWeight: "800" }}>{evalResults.totalViolations}</h2>
                </div>

                <div style={{ background: "#FEE2E2", padding: "20px", borderRadius: "14px", border: "1px solid #FCA5A5" }}>
                  <span style={{ fontSize: "10px", color: "#DC2626", fontWeight: "700", textTransform: "uppercase" }}>Flagged Threat Volume</span>
                  <h2 style={{ fontSize: "28px", color: "#DC2626", margin: "5px 0 0 0", fontWeight: "800" }}>{evalResults.totalFlaggedVolume} BTC</h2>
                </div>
              </div>

              {/* DETAILED STATS BY RULE */}
              <div>
                <h3 style={{ fontSize: "15px", color: "#0F172A", fontWeight: "800", marginBottom: "15px" }}>Rule Activation Distribution</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "15px" }}>
                  {evalResults.stats.map((st, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        background: "#FFFFFF", 
                        border: "1px solid #E2E8F0", 
                        padding: "16px", 
                        borderRadius: "12px", 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: "13px", color: "#0F172A", margin: "0 0 4px 0", fontWeight: "700" }}>{st.name}</h4>
                        <span style={{ fontSize: "10px", color: "#64748B" }}>Action: {st.action}</span>
                      </div>
                      <span style={{ fontSize: "20px", fontWeight: "800", color: st.triggerCount > 0 ? "#D97706" : "#94A3B8" }}>
                        {st.triggerCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIOLATIONS TABLE */}
              <div>
                <h3 style={{ fontSize: "15px", color: "#0F172A", fontWeight: "800", marginBottom: "15px" }}>Flagged Violations Audit Detail</h3>
                
                {evalResults.violations.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px", color: "#475569" }}>
                    No transactions violated any compliance rules. Safe state confirmed.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569", fontWeight: "700" }}>
                          <th style={{ padding: "14px 18px" }}>TXID</th>
                          <th style={{ padding: "14px 18px" }}>Sender / Receiver</th>
                          <th style={{ padding: "14px 18px" }}>Metrics Evaluated</th>
                          <th style={{ padding: "14px 18px" }}>Rules Violated</th>
                          <th style={{ padding: "14px 18px" }}>Compliance Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evalResults.violations.map((v, i) => {
                          const actionBadgeBg = v.action === "Immediate Block" ? "#FEE2E2" : v.action === "Manual Audit" ? "#FEF3C7" : "#EFF6FF";
                          const actionBadgeText = v.action === "Immediate Block" ? "#991B1B" : v.action === "Manual Audit" ? "#92400E" : "#1E3A8A";
                          const actionBadgeBorder = v.action === "Immediate Block" ? "#FCA5A5" : v.action === "Manual Audit" ? "#FDE68A" : "#DBEAFE";

                          return (
                            <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                              <td style={{ padding: "14px 18px", fontWeight: "700", color: "#1E3A8A" }}>
                                {v.transactionId}
                              </td>
                              <td style={{ padding: "14px 18px" }}>
                                <div style={{ fontSize: "11px", color: "#475569" }}>From: <span style={{ fontFamily: "monospace" }}>{v.sender.substring(0, 12)}...</span></div>
                                <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>To: <span style={{ fontFamily: "monospace" }}>{v.receiver.substring(0, 12)}...</span></div>
                              </td>
                              <td style={{ padding: "14px 18px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "x px", fontSize: "11px" }}>
                                  <span>Amount: <b>{v.scores.amount} BTC</b></span>
                                  <span>GNN: <b>{v.scores.gnnScore.toFixed(3)}</b></span>
                                  <span>Anomaly: <b>{v.scores.anomalyScore.toFixed(3)}</b></span>
                                  <span>Cluster: <b>{v.scores.clusterRisk.toFixed(3)}</b></span>
                                </div>
                              </td>
                              <td style={{ padding: "14px 18px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                  {v.triggeredRules.map((name, idx) => (
                                    <span key={idx} style={{ color: "#B45309", fontWeight: "600", fontSize: "11px" }}>
                                      • {name}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: "14px 18px" }}>
                                <span 
                                  style={{ 
                                    background: actionBadgeBg, 
                                    color: actionBadgeText, 
                                    border: `1px solid ${actionBadgeBorder}`, 
                                    padding: "4px 12px", 
                                    borderRadius: "8px", 
                                    fontWeight: "800",
                                    fontSize: "11px",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {v.action}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

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
