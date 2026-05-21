import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaShieldAlt, FaKey, FaClipboardList, FaGlobe, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { LandingFooter } from "./Solutions";

const pillars = [
  {
    icon: <FaLock color="#4F46E5" size={22} />,
    title: "Zero-Knowledge Architecture",
    desc: "All investigation data is processed in isolated secure enclaves. No raw transaction data ever leaves your perimeter. AML Shield operates on encrypted graph embeddings only.",
    color: "#4F46E5"
  },
  {
    icon: <FaShieldAlt color="#7C3AED" size={22} />,
    title: "Role-Based Access Control",
    desc: "Define granular investigator roles, team permissions, and dataset access scopes. Every action is immutably logged in a tamper-proof audit trail for regulatory review.",
    color: "#7C3AED"
  },
  {
    icon: <FaKey color="#2563EB" size={22} />,
    title: "JWT Authentication & MFA",
    desc: "All sessions require short-lived JWT tokens with automatic expiry. Multi-factor authentication is enforced for all privileged investigator accounts by default.",
    color: "#2563EB"
  },
  {
    icon: <FaClipboardList color="#0891B2" size={22} />,
    title: "Compliance-Ready Audit Logs",
    desc: "Every query, classification decision, and exported report generates an immutable compliance record. Logs are structured for instant FinCEN, FATF, and Basel III review.",
    color: "#0891B2"
  },
  {
    icon: <FaGlobe color="#059669" size={22} />,
    title: "End-to-End Encryption",
    desc: "Data at rest uses AES-256 encryption. All API communication is protected by TLS 1.3. Graph model weights are stored in hardware security modules (HSMs).",
    color: "#059669"
  },
  {
    icon: <FaExclamationTriangle color="#DC2626" size={22} />,
    title: "Intrusion Detection Layer",
    desc: "Continuous behavioral anomaly monitoring of the platform itself. Unusual query patterns, export spikes, and access from unrecognized endpoints trigger instant alerts.",
    color: "#DC2626"
  }
];

const certBadges = ["SOC 2 Type II", "ISO 27001", "GDPR Compliant", "FinCEN Registered", "FATF Aligned", "Basel III Ready"];

export default function SecurityPage() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top right,#172554 0%,#071028 45%,#071028 100%)", fontFamily: "Inter, sans-serif" }}>
      <Navbar active="Security" />

      {/* HERO */}
      <div style={{ padding: "100px 80px 60px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)", color: "#FCA5A5", width: "fit-content", padding: "10px 20px", borderRadius: "999px", marginBottom: "28px", fontSize: "13px", letterSpacing: "1px" }}>
            ENTERPRISE SECURITY FRAMEWORK
          </div>
          <h1 style={{ color: "white", fontSize: "62px", fontWeight: "800", letterSpacing: "-3px", lineHeight: "66px", marginBottom: "24px" }}>
            Built For<br />
            <span style={{ background: "linear-gradient(90deg,#EF4444,#F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Regulated</span><br />
            Environments
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "17px", lineHeight: "32px", marginBottom: "40px" }}>
            AML Shield operates under the strictest financial security standards. Every component — from ingestion to report export — is secured with enterprise-grade controls that satisfy your compliance and legal obligations.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link to="/login"><button style={{ background: "linear-gradient(90deg,#EF4444,#DC2626)", color: "white", border: "none", padding: "16px 34px", borderRadius: "14px", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>Start Securely</button></Link>
            <Link to="/contact"><button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.15)", padding: "16px 34px", borderRadius: "14px", fontSize: "15px", cursor: "pointer" }}>Security Inquiry</button></Link>
          </div>
        </motion.div>

        {/* Security Panel */}
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "28px", padding: "32px", backdropFilter: "blur(20px)", boxShadow: "0 0 60px rgba(220,38,38,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
              <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: "700", letterSpacing: "1px" }}>ALL SYSTEMS SECURE</span>
            </div>

            {[
              { label: "Authentication Layer", status: "Active", ok: true },
              { label: "Encryption at Rest", status: "AES-256", ok: true },
              { label: "TLS Handshake", status: "v1.3 Enforced", ok: true },
              { label: "Intrusion Detection", status: "Monitoring", ok: true },
              { label: "Audit Log Integrity", status: "Verified", ok: true },
              { label: "MFA Enforcement", status: "All Users", ok: true },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#CBD5E1", fontSize: "14px" }}>{item.label}</span>
                <span style={{ color: "#22C55E", fontSize: "13px", fontWeight: "700", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: "999px" }}>{item.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CERTIFICATIONS */}
      <div style={{ padding: "0 80px 60px" }}>
        <p style={{ color: "#64748B", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>COMPLIANCE CERTIFICATIONS</p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {certBadges.map(b => (
            <div key={b} style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "14px 22px", borderRadius: "14px", color: "#E2E8F0", fontSize: "14px", fontWeight: "600", backdropFilter: "blur(8px)" }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* PILLARS GRID */}
      <div style={{ padding: "0 80px 120px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "22px", padding: "32px", backdropFilter: "blur(12px)" }}
          >
            <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: `${p.color}18`, border: `1px solid ${p.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", marginBottom: "20px" }}>
              {p.icon}
            </div>
            <h3 style={{ color: "white", fontSize: "20px", fontWeight: "700", marginBottom: "14px" }}>{p.title}</h3>
            <p style={{ color: "#94A3B8", fontSize: "15px", lineHeight: "26px" }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <LandingFooter />
    </div>
  );
}
