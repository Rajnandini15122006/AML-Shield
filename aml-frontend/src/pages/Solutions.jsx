import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const solutions = [
  {
    id: "01",
    title: "Transaction Monitoring",
    subtitle: "Real-Time Ledger Surveillance",
    desc: "Continuously scan every incoming and outgoing transaction across multiple blockchain networks. Flag anomalous patterns, structuring attempts, and layering schemes the moment they occur — before funds leave the ecosystem.",
    tags: ["Live Feed", "Multi-Chain", "Instant Alerts"],
    color: "#4F46E5"
  },
  {
    id: "02",
    title: "Graph Neural Network Detection",
    subtitle: "GCN + GAT Deep Learning Engine",
    desc: "Leverage Graph Convolutional Networks and Graph Attention Networks to map complex wallet relationships. Identify hidden communities, clustering patterns, and coordinated fraud rings that rule-based systems miss entirely.",
    tags: ["GCN", "GAT", "Community Detection"],
    color: "#7C3AED"
  },
  {
    id: "03",
    title: "Suspicious Chain Tracing",
    subtitle: "Multi-Hop Path Intelligence",
    desc: "Trace laundering paths through coin mixers, intermediary wallets, and peeling chains. The engine automatically reconstructs the full money flow from origin to destination across unlimited hops.",
    tags: ["Mixer Detection", "Peeling Chains", "Path Reconstruction"],
    color: "#2563EB"
  },
  {
    id: "04",
    title: "Explainable AI (XAI)",
    subtitle: "Human-Readable Model Decisions",
    desc: "Every AI classification comes with a full attribution breakdown. Investigators can audit exactly which wallet features, transaction patterns, and graph signals caused the model to flag an entity — enabling defensible compliance decisions.",
    tags: ["SHAP Values", "Feature Attribution", "Audit Trail"],
    color: "#0891B2"
  },
  {
    id: "05",
    title: "SAR Report Generation",
    subtitle: "Automated Regulatory Submissions",
    desc: "Auto-generate Suspicious Activity Reports (SAR) and Suspicious Transaction Reports (STR) pre-formatted for FIU and FinCEN submission standards. Reduce compliance overhead from hours to seconds.",
    tags: ["SAR", "STR", "FinCEN Ready"],
    color: "#059669"
  },
  {
    id: "06",
    title: "Risk Scoring Engine",
    subtitle: "Entity-Level Threat Quantification",
    desc: "Every wallet and transaction receives a dynamic risk score calculated from behavioral anomaly scores, network centrality, velocity patterns, and historical blacklist proximity. Scores update in real-time as new data arrives.",
    tags: ["Anomaly Score", "Network Centrality", "Blacklist Match"],
    color: "#DC2626"
  }
];

export default function Solutions() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top right,#172554 0%,#071028 45%,#071028 100%)", fontFamily: "Inter, sans-serif" }}>
      <Navbar active="Solutions" />

      {/* HERO */}
      <div style={{ padding: "100px 80px 60px 80px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", width: "fit-content", padding: "10px 20px", borderRadius: "999px", margin: "0 auto 28px", fontSize: "13px", letterSpacing: "1px" }}>
            ENTERPRISE AML SOLUTIONS
          </div>
          <h1 style={{ color: "white", fontSize: "68px", fontWeight: "800", letterSpacing: "-3px", lineHeight: "72px", marginBottom: "24px" }}>
            Intelligence-Grade<br />
            <span style={{ background: "linear-gradient(90deg,#6366F1,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AML Solutions</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "19px", lineHeight: "34px", maxWidth: "680px", margin: "0 auto 50px" }}>
            Six purpose-built investigation modules designed for financial institutions, compliance teams, and regulatory bodies worldwide.
          </p>
        </motion.div>
      </div>

      {/* SOLUTIONS GRID */}
      <div style={{ padding: "0 80px 120px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px" }}>
        {solutions.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "24px",
              padding: "36px",
              backdropFilter: "blur(12px)",
              cursor: "default",
              transition: "border-color 0.25s"
            }}
            whileHover={{ borderColor: `${s.color}55` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <span style={{ fontSize: "44px", fontWeight: "900", color: "rgba(255,255,255,0.06)", lineHeight: 1 }}>{s.id}</span>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: s.color }} />
              </div>
            </div>

            <p style={{ color: "#64748B", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>{s.subtitle}</p>
            <h3 style={{ color: "white", fontSize: "22px", fontWeight: "700", marginBottom: "16px" }}>{s.title}</h3>
            <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "26px", marginBottom: "24px" }}>{s.desc}</p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {s.tags.map(tag => (
                <span key={tag} style={{ background: `${s.color}15`, color: "#CBD5E1", border: `1px solid ${s.color}30`, padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg,rgba(79,70,229,0.2),rgba(15,23,42,0.95))", border: "1px solid rgba(99,102,241,0.2)", margin: "0 80px 100px", borderRadius: "30px", padding: "70px", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: "48px", fontWeight: "800", marginBottom: "20px", letterSpacing: "-2px" }}>Ready to Investigate?</h2>
        <p style={{ color: "#94A3B8", fontSize: "18px", marginBottom: "40px" }}>Start protecting your institution with enterprise AML intelligence today.</p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link to="/login"><button style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)", color: "white", border: "none", padding: "16px 40px", borderRadius: "14px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}>Start Investigation</button></Link>
          <Link to="/contact"><button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "16px 40px", borderRadius: "14px", fontSize: "16px", cursor: "pointer" }}>Contact Sales</button></Link>
        </div>
      </div>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}

export function LandingFooter() {
  return (
    <div style={{ background: "white", padding: "60px 80px 30px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "50px", marginBottom: "40px" }}>
        <div>
          <h2 style={{ color: "#0F172A", fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>AML Shield</h2>
          <p style={{ color: "#64748B", lineHeight: "28px", fontSize: "15px", maxWidth: "400px" }}>Enterprise-grade anti-money laundering platform powered by graph intelligence and explainable AI.</p>
        </div>
        {[
          { title: "Platform", links: ["Dashboard", "Analytics", "Reports", "Monitoring"] },
          { title: "Solutions", links: ["Transaction Monitoring", "GNN Detection", "Chain Tracing", "XAI"] },
          { title: "Company", links: ["support@amlshield.ai", "Pune, Maharashtra", "Enterprise Security", "Privacy Policy"] }
        ].map(col => (
          <div key={col.title}>
            <h3 style={{ color: "#0F172A", marginBottom: "18px", fontWeight: "700" }}>{col.title}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#64748B", fontSize: "14px" }}>
              {col.links.map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <p style={{ color: "#64748B", fontSize: "14px" }}>© 2026 AML Shield. All rights reserved.</p>
        <div style={{ display: "flex", gap: "24px", color: "#64748B", fontSize: "14px" }}>
          <span>Privacy Policy</span><span>Terms</span><span>Security</span>
        </div>
      </div>
    </div>
  );
}
