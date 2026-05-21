import { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { LandingFooter } from "./Solutions";

const faqs = [
  { q: "How long does enterprise onboarding take?", a: "Standard onboarding for financial institutions takes 3–5 business days including API integration, user provisioning, and dataset ingestion testing." },
  { q: "Can AML Shield integrate with our existing SIEM?", a: "Yes. AML Shield exposes a full REST API and supports webhook-based alert forwarding to any SIEM or SOAR platform including Splunk, IBM QRadar, and Microsoft Sentinel." },
  { q: "Is the platform available for on-premise deployment?", a: "AML Shield supports both cloud-hosted (AWS, Azure, GCP) and on-premise Docker/Kubernetes deployments for institutions with data residency requirements." },
  { q: "How are GNN models updated with new fraud patterns?", a: "Our threat intelligence team releases monthly model updates incorporating new laundering techniques and blockchain patterns. Enterprise clients can also submit custom training datasets." },
  { q: "What reporting formats does AML Shield support?", a: "We support SAR (FinCEN XML), STR (FATF format), PDF executive summaries, and CSV data exports compatible with Actimize, Temenos, and Oracle FCCM." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", message: "", type: "Enterprise Demo" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top right,#172554 0%,#071028 45%,#071028 100%)", fontFamily: "Inter, sans-serif" }}>
      <Navbar active="Contact" />

      {/* HERO */}
      <div style={{ padding: "100px 80px 70px", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.25)", color: "#6EE7B7", width: "fit-content", padding: "10px 20px", borderRadius: "999px", margin: "0 auto 28px", fontSize: "13px", letterSpacing: "1px" }}>
            ENTERPRISE SALES & SUPPORT
          </div>
          <h1 style={{ color: "white", fontSize: "66px", fontWeight: "800", letterSpacing: "-3px", lineHeight: "70px", marginBottom: "22px" }}>
            Get In Touch
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "18px", lineHeight: "32px", maxWidth: "600px", margin: "0 auto" }}>
            Talk to our enterprise team about licensing, deployment, compliance requirements, or a live platform demo.
          </p>
        </motion.div>
      </div>

      {/* MAIN GRID */}
      <div style={{ padding: "0 80px 100px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "50px", alignItems: "start" }}>

        {/* LEFT: CONTACT INFO */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "36px", backdropFilter: "blur(12px)", marginBottom: "28px" }}>
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: "800", marginBottom: "28px" }}>Contact Information</h2>
            {[
              { label: "Enterprise Sales", value: "sales@amlshield.ai" },
              { label: "Technical Support", value: "support@amlshield.ai" },
              { label: "Security & Compliance", value: "security@amlshield.ai" },
              { label: "Headquarters", value: "Pune, Maharashtra, India" },
              { label: "Response Time", value: "Within 4 business hours" },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: "22px" }}>
                <p style={{ color: "#64748B", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>{item.label}</p>
                <p style={{ color: "#E2E8F0", fontSize: "15px", fontWeight: "600" }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg,rgba(79,70,229,0.2),rgba(15,23,42,0.95))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "24px", padding: "28px" }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Enterprise SLA</h3>
            <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "24px", marginBottom: "20px" }}>
              Dedicated account managers, 99.9% uptime SLA, 24/7 incident response, and guaranteed FIU compliance readiness.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["99.9% Uptime", "24/7 Support", "Dedicated AM", "Priority Onboarding"].map(tag => (
                <span key={tag} style={{ background: "rgba(99,102,241,0.15)", color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.3)", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: FORM */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "40px", backdropFilter: "blur(12px)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(5,150,105,0.15)", border: "2px solid #059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#059669" }}>
                  <FaCheck size={28} />
                </div>
                <h3 style={{ color: "white", fontSize: "24px", fontWeight: "800", marginBottom: "12px" }}>Message Sent</h3>
                <p style={{ color: "#94A3B8" }}>Our enterprise team will respond within 4 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", marginBottom: "28px" }}>Request a Demo</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <Field label="Full Name" placeholder="Jane Smith" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                  <Field label="Organisation" placeholder="Acme Bank Ltd" value={form.org} onChange={v => setForm({ ...form, org: v })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                  <Field label="Work Email" placeholder="jane@acmebank.com" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                  <Field label="Phone Number" placeholder="+91 98765 43210" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>Enquiry Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", fontSize: "14px", outline: "none" }}
                  >
                    <option value="Enterprise Demo" style={{ background: "#0F172A" }}>Enterprise Demo</option>
                    <option value="Pricing & Licensing" style={{ background: "#0F172A" }}>Pricing & Licensing</option>
                    <option value="API Integration" style={{ background: "#0F172A" }}>API Integration</option>
                    <option value="Compliance Advisory" style={{ background: "#0F172A" }}>Compliance Advisory</option>
                    <option value="Technical Support" style={{ background: "#0F172A" }}>Technical Support</option>
                  </select>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <label style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>Message</label>
                  <textarea
                    placeholder="Describe your institution's AML investigation requirements..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>

                <button type="submit" style={{ width: "100%", background: "linear-gradient(90deg,#4F46E5,#7C3AED)", color: "white", border: "none", padding: "17px", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                  Send Enterprise Inquiry
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "0 80px 120px" }}>
        <h2 style={{ color: "white", fontSize: "40px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-2px" }}>Frequently Asked Questions</h2>
        <p style={{ color: "#64748B", fontSize: "16px", marginBottom: "40px" }}>Common questions from compliance officers and AML analysts.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", cursor: "pointer" }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#E2E8F0", fontSize: "15px", fontWeight: "600" }}>{faq.q}</span>
                <span style={{ color: "#6366F1", fontSize: "20px", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: "0 28px 22px" }}>
                  <p style={{ color: "#94A3B8", fontSize: "14px", lineHeight: "26px" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}

function Field({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={{ color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}
