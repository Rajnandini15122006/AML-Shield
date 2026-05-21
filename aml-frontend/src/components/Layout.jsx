import { Link, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaCloudUploadAlt,
  FaSearchDollar,
  FaProjectDiagram,
  FaBrain,
  FaLink,
  FaChartLine,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
  FaFlask,
  FaWrench
} from "react-icons/fa";

export default function Layout({ children, active }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <FaChartBar /> },
    { name: "Upload Dataset", path: "/upload", icon: <FaCloudUploadAlt /> },
    { name: "Transaction Explorer", path: "/transactions", icon: <FaSearchDollar /> },
    { name: "Network Visualization", path: "/network-graph", icon: <FaProjectDiagram /> },
    { name: "Scenario Playground", path: "/playground", icon: <FaFlask /> },
    { name: "Rules Engine", path: "/rules", icon: <FaWrench /> },
    { name: "Explainable AI", path: "/explainable-ai", icon: <FaBrain /> },
    { name: "Fraud Chains", path: "/chains", icon: <FaLink /> },
    { name: "Temporal Analysis", path: "/analytics", icon: <FaChartLine /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "History", path: "/history", icon: <FaClock /> },
    { name: "Profile & Settings", path: "/settings", icon: <FaUser /> }
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#0F172A"
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "280px",
          background: "#0F172A",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          color: "#94A3B8"
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "0 10px" }}>
          <div style={{ background: "#1E3A8A", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaShieldAlt size={20} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#FFFFFF", margin: 0, letterSpacing: "0.5px" }}>
              AML SHIELD
            </h2>
            <span style={{ fontSize: "10px", color: "#64748B", letterSpacing: "1px", fontWeight: "700" }}>COMPLIANCE SYSTEM</span>
          </div>
        </div>

        {/* MENU */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = active === item.name || 
              (item.name === "Overview" && active === "Dashboard") || 
              (item.name === "Upload Dataset" && active === "Upload CSV") || 
              (item.name === "Transaction Explorer" && active === "Transactions") || 
              (item.name === "Network Visualization" && active === "Network Graph") || 
              (item.name === "Scenario Playground" && active === "Playground") ||
              (item.name === "Rules Engine" && active === "Rules") ||
              (item.name === "Fraud Chains" && active === "Suspicious Chains") ||
              (item.name === "Profile & Settings" && active === "Settings");

            return (
              <Link key={item.name} to={item.path}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    transition: "all 0.2s ease-in-out",
                    background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    color: isActive ? "#FFFFFF" : "#94A3B8",
                    fontWeight: isActive ? "600" : "500",
                    borderLeft: isActive ? "3px solid #3B82F6" : "3px solid transparent",
                    cursor: "pointer",
                    paddingLeft: isActive ? "15px" : "18px"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94A3B8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "16px", display: "flex", alignItems: "center" }}>{item.icon}</span>
                  <span style={{ fontSize: "14px" }}>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "20px" }}>
          <div
            onClick={() => {
              localStorage.removeItem("aml_token");
              localStorage.removeItem("aml_user");
              window.location.href = "/landing";
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 18px",
              borderRadius: "10px",
              color: "#F87171",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <FaSignOutAlt size={16} />
            <span style={{ fontSize: "14px" }}>Logout</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto", maxHeight: "100vh", background: "#F8FAFC" }}>
        {children}
      </div>
    </div>
  );
}