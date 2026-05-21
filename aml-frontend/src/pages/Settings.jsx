import { useState } from "react";
import { FaSlidersH, FaShieldAlt, FaUser, FaCheck } from "react-icons/fa";
import Layout from "../components/Layout";

export default function Settings() {
  const [threshold, setThreshold] = useState(80);
  const [saved, setSaved] = useState(false);

  const userStr = localStorage.getItem("aml_user");
  const user = userStr ? JSON.parse(userStr) : {
    fullName: "System Investigator",
    email: "investigator@amlshield.gov",
    department: "AML Investigation",
    role: "analyst"
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout active="Profile & Settings">
      {/* TOPBAR */}
      <div style={{ marginBottom: "30px" }}>
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
          <FaSlidersH color="#1E3A8A" size={28} /> System Settings
        </h1>
        <p style={{ color: "#475569", fontSize: "15px" }}>Manage AML Shield credentials, thresholds, and GNN model weights</p>
      </div>

      <div style={{ display: "grid", gap: "30px" }}>

        {/* USER PROFILE DETAILS */}
        <div className="corporate-card" style={{ padding: "35px", background: "#FFFFFF", borderRadius: "14px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "25px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaUser color="#1E3A8A" size={16} />
            </div>
            <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "700", margin: 0 }}>Investigator Profile</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px" }}>
            <div>
              <p style={{ fontWeight: "600", color: "#64748B", margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</p>
              <p style={{ color: "#0F172A", fontSize: "16px", fontWeight: "600", margin: 0 }}>{user.fullName}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", color: "#64748B", margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</p>
              <p style={{ color: "#0F172A", fontSize: "16px", fontWeight: "600", margin: 0 }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", color: "#64748B", margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Department</p>
              <p style={{ color: "#0F172A", fontSize: "16px", fontWeight: "600", margin: 0 }}>{user.department}</p>
            </div>
            <div>
              <p style={{ fontWeight: "600", color: "#64748B", margin: "0 0 6px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Designated Role</p>
              <span style={{ 
                display: "inline-block", 
                background: "rgba(30,58,138,0.08)", 
                color: "#1E3A8A", 
                fontSize: "12px", 
                fontWeight: "700", 
                padding: "4px 12px", 
                borderRadius: "999px",
                textTransform: "uppercase",
                marginTop: "2px"
              }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* ALGORITHM THRESHOLDS */}
        <div className="corporate-card" style={{ padding: "35px", background: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(30,58,138,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaShieldAlt color="#1E3A8A" size={16} />
            </div>
            <h2 style={{ color: "#0F172A", fontSize: "20px", fontWeight: "700", margin: 0 }}>Graph Anomaly Classification</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                <span style={{ fontWeight: "600", color: "#475569" }}>Multi-Hop Layer Detection Depth</span>
                <span style={{ fontWeight: "800", color: "#1E3A8A" }}>{threshold}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                style={{ width: "100%", accentColor: "#1E3A8A", cursor: "pointer" }}
              />
              <p style={{ color: "#64748B", fontSize: "13px", marginTop: "8px", lineHeight: "1.4" }}>
                Adjusting the node depth triggers recursive path discovery for smaller transaction values inside the coin mixing layers.
              </p>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={handleSave}
            className="neon-btn"
            style={{
              padding: "14px 28px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              background: "#1E3A8A",
              color: "#FFFFFF"
            }}
          >
            {saved ? <FaCheck /> : null} {saved ? "Changes Committed" : "Commit Changes"}
          </button>
          {saved && <span style={{ color: "#059669", fontWeight: "600", fontSize: "14px" }}>Configuration updated successfully.</span>}
        </div>

      </div>
    </Layout>
  );
}
