import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck } from "react-icons/fa";

const API = "/api/auth";

const DEPARTMENTS = [
  "AML Investigation",
  "Compliance & Risk",
  "Financial Intelligence Unit",
  "Fraud Analytics",
  "Cybersecurity",
  "Executive Management",
];

const ROLES = [
  { value: "analyst", label: "AML Analyst" },
  { value: "investigator", label: "Senior Investigator" },
  { value: "admin", label: "Compliance Admin" },
];

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
    role: "analyst",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required";
      else if (form.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
      if (!form.department) e.department = "Please select your department";
    }
    if (step === 2) {
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
      if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    return e;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          department: form.department,
          role: form.role,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

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

  const pwStrength = () => {
    const p = form.password;
    if (!p) return { score: 0, label: "", color: "#E2E8F0" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { score, label: "Weak", color: "#EF4444" };
    if (score <= 2) return { score, label: "Fair", color: "#F59E0B" };
    if (score <= 3) return { score, label: "Good", color: "#3B82F6" };
    return { score, label: "Strong", color: "#10B981" };
  };

  const strength = pwStrength();

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1.1fr", fontFamily: "Inter, sans-serif" }}>

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
          <div style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.25)", color: "#6EE7B7", width: "fit-content", padding: "8px 16px", borderRadius: "999px", fontSize: "12px", letterSpacing: "1px", marginBottom: "30px" }}>
            ENTERPRISE INVESTIGATOR ACCESS
          </div>
          <h1 style={{ color: "white", fontSize: "44px", fontWeight: "800", lineHeight: "50px", letterSpacing: "-2px", marginBottom: "20px" }}>
            Join AML Shield<br />Intelligence Network
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "16px", lineHeight: "28px", marginBottom: "44px", maxWidth: "400px" }}>
            Register your investigator account to access GNN fraud detection, suspicious chain tracing, and explainable AI tools.
          </p>

          {/* Features list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "Real-time transaction monitoring & alerts",
              "Graph Neural Network fraud path detection",
              "SAR/STR auto-generated compliance reports",
              "Role-based investigator access controls",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(5,150,105,0.2)", border: "1px solid #059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <FaCheck color="#10B981" size={10} />
                </div>
                <span style={{ color: "#CBD5E1", fontSize: "14px", lineHeight: "22px" }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p style={{ color: "#334155", fontSize: "13px" }}>© 2026 AML Shield. Enterprise Financial Intelligence.</p>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div style={{ background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ width: "100%", maxWidth: "480px" }}
        >
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ color: "#0F172A", fontSize: "30px", fontWeight: "800", letterSpacing: "-1px", marginBottom: "8px" }}>
              Create your account
            </h2>
            <p style={{ color: "#64748B", fontSize: "15px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#4F46E5", fontWeight: "700", textDecoration: "none" }}>Sign in</Link>
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: step >= s ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : "#E2E8F0",
                  color: step >= s ? "white" : "#94A3B8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: "700", transition: "all 0.3s"
                }}>
                  {step > s ? <FaCheck size={11} /> : s}
                </div>
                <span style={{ fontSize: "13px", color: step >= s ? "#0F172A" : "#94A3B8", fontWeight: step >= s ? "600" : "400" }}>
                  {s === 1 ? "Personal Info" : "Security Setup"}
                </span>
                {s < 2 && <div style={{ width: "40px", height: "2px", background: step > s ? "#4F46E5" : "#E2E8F0", transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>

          {/* API Error */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", color: "#DC2626", fontSize: "14px", fontWeight: "500" }}
              >
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── STEP 1 ─── */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNext}
                noValidate
              >
                {/* Full Name */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" placeholder="Jane Smith" {...field("fullName")} style={{ ...inputStyle, borderColor: errors.fullName ? "#DC2626" : "#E2E8F0" }}
                    onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = errors.fullName ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }} />
                  {errors.fullName && <p style={errorStyle}>{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Work Email</label>
                  <input type="email" placeholder="jane@yourbank.com" {...field("email")} style={{ ...inputStyle, borderColor: errors.email ? "#DC2626" : "#E2E8F0" }}
                    onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = errors.email ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }} />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>

                {/* Department */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Department</label>
                  <select {...field("department")} style={{ ...inputStyle, borderColor: errors.department ? "#DC2626" : "#E2E8F0", appearance: "none", cursor: "pointer" }}>
                    <option value="">Select department...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p style={errorStyle}>{errors.department}</p>}
                </div>

                {/* Role */}
                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Investigator Role</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    {ROLES.map(r => (
                      <div
                        key={r.value}
                        onClick={() => setForm({ ...form, role: r.value })}
                        style={{
                          padding: "12px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
                          border: form.role === r.value ? "2px solid #4F46E5" : "1.5px solid #E2E8F0",
                          background: form.role === r.value ? "rgba(79,70,229,0.06)" : "white",
                          transition: "all 0.2s"
                        }}
                      >
                        <p style={{ color: form.role === r.value ? "#4F46E5" : "#0F172A", fontWeight: "700", fontSize: "12px", margin: 0 }}>{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer" }}>
                  Continue to Security Setup →
                </button>
              </motion.form>
            )}

            {/* ─── STEP 2 ─── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Password */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} placeholder="Min. 6 characters" {...field("password")} style={{ ...inputStyle, borderColor: errors.password ? "#DC2626" : "#E2E8F0", paddingRight: "50px" }}
                      onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.password ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password && (
                    <div style={{ marginTop: "10px" }}>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "999px", background: i <= strength.score ? strength.color : "#E2E8F0", transition: "background 0.3s" }} />
                        ))}
                      </div>
                      <p style={{ color: strength.color, fontSize: "12px", fontWeight: "600" }}>{strength.label} password</p>
                    </div>
                  )}
                  {errors.password && <p style={errorStyle}>{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showConfirm ? "text" : "password"} placeholder="Repeat your password" {...field("confirmPassword")} style={{ ...inputStyle, borderColor: errors.confirmPassword ? "#DC2626" : form.confirmPassword && form.password === form.confirmPassword ? "#059669" : "#E2E8F0", paddingRight: "50px" }}
                      onFocus={e => { e.target.style.borderColor = "#4F46E5"; e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? "#DC2626" : "#E2E8F0"; e.target.style.boxShadow = "none"; }} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={errorStyle}>{errors.confirmPassword}</p>}
                  {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                    <p style={{ color: "#059669", fontSize: "12px", fontWeight: "600", marginTop: "6px" }}>Passwords match</p>
                  )}
                </div>

                {/* Terms */}
                <div style={{ background: "rgba(79,70,229,0.04)", border: "1px solid rgba(79,70,229,0.15)", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px" }}>
                  <p style={{ color: "#475569", fontSize: "13px", lineHeight: "20px", margin: 0 }}>
                    By creating an account you agree to AML Shield's{" "}
                    <span style={{ color: "#4F46E5", fontWeight: "600", cursor: "pointer" }}>Terms of Service</span>,{" "}
                    <span style={{ color: "#4F46E5", fontWeight: "600", cursor: "pointer" }}>Privacy Policy</span>, and enterprise data handling standards.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
                  <button type="button" onClick={() => setStep(1)} style={{ padding: "16px 24px", borderRadius: "14px", border: "1.5px solid #E2E8F0", background: "white", color: "#374151", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "16px", borderRadius: "14px", border: "none", background: loading ? "#C7D2FE" : "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "white", fontSize: "16px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                        Creating Account...
                      </>
                    ) : "Create Account"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
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