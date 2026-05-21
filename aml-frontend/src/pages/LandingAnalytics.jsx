import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { LandingFooter } from "./Solutions";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const volumeData = [
  { label: "Jan", Volume: 412000, Flagged: 32 },
  { label: "Feb", Volume: 538000, Flagged: 41 },
  { label: "Mar", Volume: 694000, Flagged: 68 },
  { label: "Apr", Volume: 481000, Flagged: 29 },
  { label: "May", Volume: 812000, Flagged: 95 },
  { label: "Jun", Volume: 743000, Flagged: 74 },
  { label: "Jul", Volume: 921000, Flagged: 112 },
  { label: "Aug", Volume: 867000, Flagged: 98 },
];

const riskData = [
  { name: "High Risk", value: 312, color: "#EF4444" },
  { name: "Medium Risk", value: 847, color: "#F59E0B" },
  { name: "Low Risk", value: 21362, color: "#10B981" },
];

const barData = [
  { name: "Mixers", count: 84 },
  { name: "Peeling", count: 47 },
  { name: "Layering", count: 131 },
  { name: "Structuring", count: 58 },
  { name: "Smurfing", count: 29 },
];

const kpis = [
  { label: "Transactions Analyzed", value: "24,521", delta: "+12.4%", up: true },
  { label: "Fraud Alerts Generated", value: "312", delta: "+8.7%", up: true },
  { label: "Laundering Chains", value: "84", delta: "-3.1%", up: false },
  { label: "Risk Clusters Identified", value: "19", delta: "+2", up: true },
];

const tooltipStyle = { background: "rgba(11,16,36,0.95)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "10px", color: "#E2E8F0" };

export default function LandingAnalyticsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top right,#172554 0%,#071028 45%,#071028 100%)", fontFamily: "Inter, sans-serif" }}>
      <Navbar active="Analytics" />

      {/* HERO */}
      <div style={{ padding: "100px 80px 60px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", width: "fit-content", padding: "10px 20px", borderRadius: "999px", marginBottom: "28px", fontSize: "13px", letterSpacing: "1px" }}>
            REAL-TIME INVESTIGATION ANALYTICS
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "30px" }}>
            <div>
              <h1 style={{ color: "white", fontSize: "64px", fontWeight: "800", letterSpacing: "-3px", lineHeight: "68px", marginBottom: "20px" }}>
                Platform<br />
                <span style={{ background: "linear-gradient(90deg,#6366F1,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analytics Hub</span>
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "18px", lineHeight: "32px", maxWidth: "600px" }}>
                A live intelligence view of every fraud signal, transaction wave, and risk cluster across your financial network.
              </p>
            </div>
            <Link to="/login">
              <button style={{ background: "linear-gradient(90deg,#4F46E5,#7C3AED)", color: "white", border: "none", padding: "16px 36px", borderRadius: "14px", fontSize: "15px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                Open Live Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* KPI CARDS */}
      <div style={{ padding: "0 80px 50px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px 24px", backdropFilter: "blur(12px)" }}
          >
            <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "12px", letterSpacing: "0.5px" }}>{k.label}</p>
            <h2 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "8px" }}>{k.value}</h2>
            <span style={{ color: k.up ? "#10B981" : "#EF4444", fontSize: "13px", fontWeight: "600" }}>
              {k.delta} vs last month
            </span>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ padding: "0 80px 60px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        {/* AREA CHART */}
        <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "30px", backdropFilter: "blur(12px)" }}>
          <h3 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "6px" }}>Transaction Volume Trend</h3>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "24px" }}>Monthly BTC volume vs fraud flag count</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="Volume" stroke="#6366F1" fill="url(#volGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "30px", backdropFilter: "blur(12px)" }}>
          <h3 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "6px" }}>Risk Distribution</h3>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "24px" }}>Breakdown by transaction threat level</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {riskData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend formatter={v => <span style={{ color: "#CBD5E1", fontSize: "13px" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "30px", backdropFilter: "blur(12px)" }}>
          <h3 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "6px" }}>Laundering Pattern Breakdown</h3>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "24px" }}>Detected schemes by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* INVESTIGATION CASES */}
        <div style={{ background: "rgba(15,23,42,0.75)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "30px", backdropFilter: "blur(12px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "4px" }}>Active Investigation Cases</h3>
              <p style={{ color: "#64748B", fontSize: "13px" }}>Sorted by model confidence score</p>
            </div>
            <span style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", padding: "6px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>LIVE</span>
          </div>
          {[{ case: "Case #2041", score: 91 }, { case: "Case #2042", score: 76 }, { case: "Case #2043", score: 68 }, { case: "Case #2044", score: 82 }, { case: "Case #2045", score: 57 }].map((item, i) => (
            <div key={i} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#CBD5E1", fontSize: "13px" }}>{item.case}</span>
                <span style={{ color: "#F43F5E", fontSize: "13px", fontWeight: "700" }}>{item.score}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#172036", borderRadius: "999px" }}>
                <div style={{ width: `${item.score}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg,#6366F1,#F43F5E)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
