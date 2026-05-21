import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api/auth";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (location.state?.demo) {
      setForm({ email: "demo@amlshield.ai", password: "demo1234" });
    }
  }, [location.state]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Store token and user info
      localStorage.setItem("aml_token", data.token);
      localStorage.setItem("aml_user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      setApiError("Unable to connect to server. Please ensure the backend is running.");
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm({ ...form, [key]: e.target.value }); if (errors[key]) setErrors({ ...errors, [key]: "" }); },
  });

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "Inter, sans-serif" }}>

      {/* ─── LEFT PANEL ─── */}
      <div style={{ background: "linear-gradient(135deg,#172554 0%,#1e1b4b 50%,#071028 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px" }}>

        {/* Logo */}
        <Link to="/landing" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "800", fontSize: "16px" }}>A</span>
            </div>
            <span style={{ color: "white", fontWeight: "800", fontSize: "22px", letterSpacing: "-0.5px" }}>AML Shield</span>
          </div>
        </Link>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#A5B4FC", width: "fit-content", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", letterSpacing: "1px", marginBottom: "30px" }}>
            AI-POWERED AML INVESTIGATION
          </div>
          <h1 style={{ color: "white", fontSize: "48px", fontWeight: "800", lineHeight: "54px", letterSpacing: "-2px", marginBottom: "20px" }}>
            Detect Financial<br />Crime Instantly
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", lineHeight: "28px", marginBottom: "44px", maxWidth: "420px" }}>
            Sign in to access real-time transaction monitoring, GNN fraud detection, and explainable AI investigation tools.
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Transactions Analyzed", value: "24,521" },
              { label: "Fraud Chains Detected", value: "84" },
              { label: "Model Accuracy", value: "99.2%" },
              { label: "Avg Detection Time", value: "< 2s" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px" }}>
                <h3 style={{ color: "white", fontSize: "24px", fontWeight: "800", margin: "0 0 6px 0" }}>{stat.value}</h3>
                <p style={{ color: "#64748B", fontSize: "12px", margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p style={{ color: "#334155", fontSize: "13px" }}>© 2026 AML Shield. Enterprise Financial Intelligence.</p>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div style={{ background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ width: "100%", maxWidth: "440px" }}
        >
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ color: "#0F172A", fontSize: "32px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "8px" }}>
              Sign in to your account
            </h2>
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#4F46E5", fontWeight: "700", textDecoration: "none" }}>Create one</Link>
            </p>
          </div>

          {/* API Error Banner */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", color: "#DC2626", fontSize: "14px", fontWeight: "500" }}
              >
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* FORM */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Work Email</label>
              <input
                type="email"
                placeholder="jane@yourbank.com"
                {...field("email")}
                style={{ ...inputStyle, borderColor: errors.email ? "#DC2626" : "#E2E8F0" }}
                onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={labelStyle}>Password</label>
                <button type="button" style={{ background: "none", border: "none", color: "#4F46E5", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••"
                  {...field("password")}
                  style={{ ...inputStyle, borderColor: errors.password ? "#DC2626" : "#E2E8F0", paddingRight: "48px" }}
                  onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p style={errorStyle}>{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: loading ? "#C7D2FE" : "linear-gradient(135deg,#4F46E5,#7C3AED)",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  Authenticating...
                </>
              ) : "Sign In to AML Shield"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "28px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
              <span style={{ color: "#94A3B8", fontSize: "13px" }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
            </div>

            {/* Demo Access */}
            <button
              type="button"
              onClick={() => { setForm({ email: "demo@amlshield.ai", password: "demo1234" }); }}
              style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1.5px solid #E2E8F0", background: "white", color: "#0F172A", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.color = "#4F46E5"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#0F172A"; }}
            >
              Use Demo Credentials
            </button>
          </form>

          {/* Terms */}
          <p style={{ color: "#94A3B8", fontSize: "12px", textAlign: "center", marginTop: "28px", lineHeight: "20px" }}>
            By signing in, you agree to AML Shield's{" "}
            <span style={{ color: "#4F46E5", cursor: "pointer" }}>Terms of Service</span> and{" "}
            <span style={{ color: "#4F46E5", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#374151",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1.5px solid #E2E8F0",
  background: "white",
  color: "#0F172A",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  fontFamily: "Inter, sans-serif",
};

const errorStyle = {
  color: "#DC2626",
  fontSize: "12px",
  marginTop: "6px",
  fontWeight: "500",
};