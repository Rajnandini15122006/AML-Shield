import { Link } from "react-router-dom";

export default function Layout({
  children,
  active
}) {

  const menuItems = [

    "Dashboard",
    "Upload CSV",
    "Transactions",
    "Network Graph",
    "Suspicious Chains",
    "Explainable AI",
    "Analytics",
    "Reports",
    "History",
    "Settings"

  ];

const getPath = (item) => {

  switch (item) {

    case "Dashboard":
      return "/dashboard";

    case "Transactions":
      return "/transactions";

    case "Network Graph":
      return "/network-graph";

    case "Explainable AI":
      return "/explainable-ai";

    case "Analytics":
      return "/analytics";

    case "Reports":
      return "/reports";

    default:
      return "/dashboard";
  }
};

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f7fb"
      }}
    >

      {/* SIDEBAR */}

      <div
        style={{
          width: "260px",
          background: "white",
          borderRight: "1px solid #E2E8F0",
          padding: "30px"
        }}
      >

        <h2
          style={{
            color: "#111827",
            marginBottom: "45px",
            fontSize: "34px"
          }}
        >
          AML Shield
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >

          {menuItems.map((item) => (

            <Link
              key={item}
              to={getPath(item)}
            >

              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "14px",

                  background:
                    active === item
                      ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                      : "transparent",

                  color:
                    active === item
                      ? "white"
                      : "#475569",

                  fontWeight:
                    active === item
                      ? "600"
                      : "500",

                  cursor: "pointer"
                }}
              >
                {item}
              </div>

            </Link>

          ))}

        </div>

      </div>

      {/* MAIN */}

      <div
        style={{
          flex: 1,
          padding: "35px"
        }}
      >

        {children}

      </div>

    </div>

  );
}