import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/landing" },
  { label: "Solutions", to: "/solutions" },
  { label: "Analytics", to: "/analytics-platform" },
  { label: "Security", to: "/security" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({ active }) {
  const location = useLocation();

  return (
    <div
      style={{
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 80px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        background: "linear-gradient(90deg,#4F46E5,#7C3AED)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      {/* LOGO */}
      <Link to="/landing" style={{ textDecoration: "none" }}>
        <h2 style={{ color: "white", fontSize: "28px", fontWeight: "800", letterSpacing: "-1px", cursor: "pointer" }}>
          AML Shield
        </h2>
      </Link>

      {/* NAV LINKS */}
      <div style={{ display: "flex", gap: "36px", alignItems: "center", fontSize: "15px" }}>
        {navLinks.map(link => {
          const isActive = active === link.label || location.pathname === link.to;
          return (
            <Link
              key={link.label}
              to={link.to}
              style={{
                textDecoration: "none",
                color: isActive ? "#FFFFFF" : "#CBD5E1",
                fontWeight: isActive ? "700" : "500",
                borderBottom: isActive ? "2px solid rgba(255,255,255,0.8)" : "2px solid transparent",
                paddingBottom: "3px",
                transition: "all 0.2s",
                fontSize: "15px"
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "#FFFFFF"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#CBD5E1"; } }}
            >
              {link.label}
            </Link>
          );
        })}

        {localStorage.getItem("aml_token") ? (
          <Link to="/dashboard">
            <button
              style={{
                background: "white",
                border: "2px solid white",
                color: "#4F46E5",
                padding: "10px 26px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "700",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
            >
              Dashboard
            </button>
          </Link>
        ) : (
          <Link to="/login">
            <button
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.6)",
                color: "white",
                padding: "10px 26px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}