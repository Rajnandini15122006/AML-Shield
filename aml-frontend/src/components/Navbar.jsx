import { Link } from "react-router-dom";

export default function Navbar() {

  return (
    <div
      style={{
        height: "90px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 80px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        background: "linear-gradient(90deg,#4F46E5,#7C3AED)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}
    >

      {/* LOGO */}

      <h2
        style={{
          color: "white",
          fontSize: "32px",
          fontWeight: "700",
          letterSpacing: "-1px"
        }}
      >
        AML Shield
      </h2>

      {/* NAV LINKS */}

      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "center",
          color: "#CBD5E1",
          fontSize: "15px"
        }}
      >

        <span>Home</span>

        <span>Solutions</span>

        <span>Analytics</span>

        <span>Security</span>

        <span>Contact</span>

        <Link to="/login">

          <button
            style={{
              background: "transparent",
              border: "2px solid #e9edf2",
              color: "white",
              padding: "12px 26px",
              borderRadius: "12px"
            }}
          >
            Login
          </button>

        </Link>

      </div>

    </div>
  );
}