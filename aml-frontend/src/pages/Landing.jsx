// import { Link } from "react-router-dom";

// export default function Landing() {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at top right, #182848 0%, #050816 40%)",
//         color: "white",
//         padding: "30px 80px",
//       }}
//     >
//       {/* NAVBAR */}

//       <nav
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h2
//           style={{
//             fontSize: "32px",
//             fontWeight: "bold",
//           }}
//         >
//           🛡 AML Shield
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             gap: "30px",
//             alignItems: "center",
//           }}
//         >
//           <a href="#about">About</a>
//           <a href="#features">Features</a>
//           <a href="#contact">Contact</a>

//           <Link to="/login">
//             <button
//               style={{
//                 background: "transparent",
//                 border: "1px solid #6c63ff",
//                 color: "white",
//                 padding: "10px 25px",
//                 borderRadius: "10px",
//               }}
//             >
//               Login
//             </button>
//           </Link>

//           <Link to="/register">
//             <button
//               style={{
//                 background: "#6c63ff",
//                 color: "white",
//                 padding: "10px 25px",
//                 borderRadius: "10px",
//               }}
//             >
//               Register
//             </button>
//           </Link>
//         </div>
//       </nav>

//       {/* HERO SECTION */}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginTop: "100px",
//           gap: "50px",
//         }}
//       >
//         {/* LEFT */}

//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               background: "#0f172a",
//               width: "fit-content",
//               padding: "10px 20px",
//               borderRadius: "20px",
//               color: "#00ff99",
//               marginBottom: "30px",
//             }}
//           >
//             AI Powered • Real-Time • Secure
//           </div>

//           <h1
//             style={{
//               fontSize: "85px",
//               lineHeight: "95px",
//               fontWeight: "bold",
//             }}
//           >
//             AI Powered <br />
//             Money Laundering <br />
//             <span style={{ color: "#6c63ff" }}>Detection</span>
//           </h1>

//           <p
//             style={{
//               color: "#9ca3af",
//               marginTop: "30px",
//               fontSize: "20px",
//               width: "80%",
//               lineHeight: "35px",
//             }}
//           >
//             Detect suspicious bitcoin transactions using GNN, GCN, GAT,
//             Isolation Forest and advanced graph analytics.
//           </p>

//           <div
//             style={{
//               display: "flex",
//               gap: "20px",
//               marginTop: "40px",
//             }}
//           >
//             <button
//               style={{
//                 background: "#6c63ff",
//                 color: "white",
//                 padding: "15px 35px",
//                 borderRadius: "12px",
//                 fontSize: "18px",
//               }}
//             >
//               Get Started
//             </button>

//             <button
//               style={{
//                 background: "transparent",
//                 border: "1px solid #6c63ff",
//                 color: "white",
//                 padding: "15px 35px",
//                 borderRadius: "12px",
//                 fontSize: "18px",
//               }}
//             >
//               View Demo
//             </button>
//           </div>
//         </div>

//         {/* RIGHT */}

//         <div
//           style={{
//             flex: 1,
//             background: "rgba(255,255,255,0.05)",
//             border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: "30px",
//             padding: "30px",
//             backdropFilter: "blur(20px)",
//           }}
//         >
//           <div
//             style={{
//               background: "#0f172a",
//               borderRadius: "20px",
//               padding: "30px",
//               marginBottom: "20px",
//             }}
//           >
//             <h3>Risk Score</h3>

//             <h1
//               style={{
//                 color: "#ff4d6d",
//                 marginTop: "10px",
//                 fontSize: "60px",
//               }}
//             >
//               87
//             </h1>

//             <p style={{ color: "#ff4d6d" }}>High Risk</p>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//             }}
//           >
//             <div
//               style={{
//                 background: "#0f172a",
//                 borderRadius: "20px",
//                 padding: "20px",
//               }}
//             >
//               <h3>Transactions</h3>
//               <h1 style={{ marginTop: "10px" }}>24,521</h1>
//             </div>

//             <div
//               style={{
//                 background: "#0f172a",
//                 borderRadius: "20px",
//                 padding: "20px",
//               }}
//             >
//               <h3>Frauds</h3>
//               <h1
//                 style={{
//                   marginTop: "10px",
//                   color: "#ff4d6d",
//                 }}
//               >
//                 312
//               </h1>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









// import Navbar from "../components/Navbar";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// export default function Landing() {

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at top right,#172554 0%,#020617 45%,#020617 100%)",
//         color: "white",
//         overflow: "hidden",
//         fontFamily: "Inter, sans-serif"
//       }}
//     >
//       <Navbar />
//       {/* NAVBAR */}

//       <div
//         style={{
//           height: "90px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "0 80px",
//           borderBottom: "1px solid rgba(255,255,255,0.05)"
//         }}
//       >

//         <h2
//           style={{
//             fontSize: "34px",
//             fontWeight: "700",
//             letterSpacing: "-1px"
//           }}
//         >
//           AML Shield
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             gap: "45px",
//             alignItems: "center",
//             fontSize: "15px",
//             color: "#CBD5E1"
//           }}
//         >

//           <span>Platform</span>
//           <span>Solutions</span>
//           <span>Analytics</span>
//           <span>Security</span>

//           <Link to="/login">
//             <button
//               style={{
//                 background: "transparent",
//                 border: "1px solid #334155",
//                 color: "white",
//                 padding: "12px 28px",
//                 borderRadius: "12px",
//                 cursor: "pointer",
//                 fontSize: "14px"
//               }}
//             >
//               Login
//             </button>
//           </Link>

//         </div>

//       </div>

//       {/* HERO SECTION */}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1.1fr 1fr",
//           padding: "80px",
//           gap: "60px",
//           alignItems: "center"
//         }}
//       >

//         {/* LEFT */}

//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >

//           <div
//             style={{
//               background: "rgba(99,102,241,0.12)",
//               width: "fit-content",
//               padding: "10px 18px",
//               borderRadius: "999px",
//               color: "#818CF8",
//               marginBottom: "30px",
//               fontSize: "14px",
//               border: "1px solid rgba(99,102,241,0.2)"
//             }}
//           >
//             AI Powered Financial Crime Intelligence
//           </div>

//           <h1
//             style={{
//               fontSize: "76px",
//               lineHeight: "82px",
//               marginBottom: "28px",
//               letterSpacing: "-3px",
//               fontWeight: "700"
//             }}
//           >
//             Detect Financial Crime Before It Spreads
//           </h1>

//           <p
//             style={{
//               color: "#94A3B8",
//               fontSize: "19px",
//               lineHeight: "34px",
//               maxWidth: "700px",
//               marginBottom: "40px"
//             }}
//           >
//             Enterprise-grade AML intelligence platform using
//             Graph Neural Networks, anomaly detection,
//             temporal analysis, and explainable AI to identify
//             suspicious bitcoin transaction networks in real time.
//           </p>

//           <div
//             style={{
//               display: "flex",
//               gap: "20px"
//             }}
//           >

//             <button
//               style={{
//                 background:
//                   "linear-gradient(90deg,#4F46E5,#7C3AED)",
//                 border: "none",
//                 color: "white",
//                 padding: "16px 34px",
//                 borderRadius: "14px",
//                 fontSize: "15px",
//                 fontWeight: "600",
//                 cursor: "pointer"
//               }}
//             >
//               Start Investigation
//             </button>

//             <button
//               style={{
//                 background: "transparent",
//                 border: "1px solid #334155",
//                 color: "white",
//                 padding: "16px 34px",
//                 borderRadius: "14px",
//                 fontSize: "15px",
//                 cursor: "pointer"
//               }}
//             >
//               View Demo
//             </button>

//           </div>

//         </motion.div>

//         {/* RIGHT SIDE */}

//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.8 }}
//         >

//           <div
//             style={{
//               background: "rgba(15,23,42,0.85)",
//               border: "1px solid rgba(255,255,255,0.06)",
//               borderRadius: "30px",
//               padding: "28px",
//               backdropFilter: "blur(20px)",
//               boxShadow: "0 0 80px rgba(99,102,241,0.12)"
//             }}
//           >

//             {/* TOP CARD */}

//             <div
//               style={{
//                 background: "#0F172A",
//                 borderRadius: "22px",
//                 padding: "30px",
//                 marginBottom: "22px"
//               }}
//             >

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   marginBottom: "25px"
//                 }}
//               >

//                 <div>
//                   <p
//                     style={{
//                       color: "#94A3B8",
//                       fontSize: "14px"
//                     }}
//                   >
//                     Threat Score
//                   </p>

//                   <h1
//                     style={{
//                       fontSize: "70px",
//                       color: "#FB7185",
//                       margin: 0
//                     }}
//                   >
//                     87
//                   </h1>
//                 </div>

//                 <div
//                   style={{
//                     width: "90px",
//                     height: "90px",
//                     borderRadius: "50%",
//                     border: "8px solid #FB7185",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#FB7185",
//                     fontWeight: "700"
//                   }}
//                 >
//                   HIGH
//                 </div>

//               </div>

//               <div
//                 style={{
//                   height: "10px",
//                   background: "#1E293B",
//                   borderRadius: "999px",
//                   overflow: "hidden"
//                 }}
//               >

//                 <div
//                   style={{
//                     width: "87%",
//                     height: "100%",
//                     background:
//                       "linear-gradient(90deg,#FB7185,#EF4444)"
//                   }}
//                 />

//               </div>

//             </div>

//             {/* SMALL CARDS */}

//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "20px"
//               }}
//             >

//               <div style={smallCard}>
//                 <p style={label}>Transactions</p>
//                 <h2 style={number}>24,521</h2>
//               </div>

//               <div style={smallCard}>
//                 <p style={label}>Fraud Alerts</p>
//                 <h2 style={{ ...number, color: "#FB7185" }}>
//                   312
//                 </h2>
//               </div>

//               <div style={smallCard}>
//                 <p style={label}>AML Chains</p>
//                 <h2 style={number}>84</h2>
//               </div>

//               <div style={smallCard}>
//                 <p style={label}>Risk Clusters</p>
//                 <h2 style={number}>19</h2>
//               </div>

//             </div>

//           </div>

//         </motion.div>

//       </div>

//     </div>
//   );
// }

// const smallCard = {
//   background: "#0F172A",
//   borderRadius: "22px",
//   padding: "24px"
// };

// const label = {
//   color: "#94A3B8",
//   fontSize: "14px",
//   marginBottom: "12px"
// };

// const number = {
//   fontSize: "38px",
//   margin: 0
// };



import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right,#172554 0%,#071028 45%,#071028 100%)",
        overflow: "hidden"
      }}
    >

      <Navbar />

      {/* HERO SECTION */}

      <div
        style={{
          padding: "80px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          alignItems: "center",
          gap: "60px"
        }}
      >

        {/* LEFT SIDE */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div
            style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
              color: "#A5B4FC",
              width: "fit-content",
              padding: "10px 18px",
              borderRadius: "999px",
              marginBottom: "30px",
              fontSize: "14px"
            }}
          >
            AI Powered Financial Crime Intelligence
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "78px",
              lineHeight: "82px",
              letterSpacing: "-3px",
              fontWeight: "700",
              marginBottom: "30px"
            }}
          >
            Detect Financial Crime Before It Spreads
          </h1>

          <p
            style={{
              color: "#94A3B8",
              fontSize: "19px",
              lineHeight: "34px",
              maxWidth: "700px",
              marginBottom: "45px"
            }}
          >
            Enterprise-grade AML intelligence platform using
            Graph Neural Networks, anomaly detection,
            suspicious chain tracing and explainable AI
            to detect illicit bitcoin transactions.
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px"
            }}
          >

            <Link to={localStorage.getItem("aml_token") ? "/dashboard" : "/login"} style={{ textDecoration: "none" }}>
              <button
                style={{
                  background:
                    "linear-gradient(90deg,#4F46E5,#7C3AED)",
                  color: "white",
                  padding: "16px 34px",
                  borderRadius: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Start Investigation
              </button>
            </Link>

            <Link to="/login" state={{ demo: true }} style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #334155",
                  color: "white",
                  padding: "16px 34px",
                  borderRadius: "14px",
                  fontSize: "15px",
                  cursor: "pointer"
                }}
              >
                View Demo
              </button>
            </Link>

          </div>

        </motion.div>

        {/* RIGHT SIDE */}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >

          <div
            style={{
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "30px",
              padding: "28px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 80px rgba(99,102,241,0.12)"
            }}
          >

            {/* TOP CARD */}

            <div
              style={{
                background: "#0F172A",
                borderRadius: "22px",
                padding: "30px",
                marginBottom: "22px"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "25px"
                }}
              >

                <div>

                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "14px"
                    }}
                  >
                    Threat Score
                  </p>

                  <h1
                    style={{
                      fontSize: "72px",
                      color: "#FB7185",
                      margin: 0
                    }}
                  >
                    87
                  </h1>

                </div>

                <div
                  style={{
                    width: "95px",
                    height: "95px",
                    borderRadius: "50%",
                    border: "8px solid #FB7185",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FB7185",
                    fontWeight: "700"
                  }}
                >
                  HIGH
                </div>

              </div>

              <div
                style={{
                  height: "10px",
                  background: "#1E293B",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >

                <div
                  style={{
                    width: "87%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg,#FB7185,#EF4444)"
                  }}
                />

              </div>

            </div>

            {/* GRID CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}
            >

              <div style={cardStyle}>
                <p style={labelStyle}>Transactions</p>
                <h2 style={numberStyle}>24,521</h2>
              </div>

              <div style={cardStyle}>
                <p style={labelStyle}>Fraud Alerts</p>
                <h2
                  style={{
                    ...numberStyle,
                    color: "#FB7185"
                  }}
                >
                  312
                </h2>
              </div>

              <div style={cardStyle}>
                <p style={labelStyle}>AML Chains</p>
                <h2 style={numberStyle}>84</h2>
              </div>

              <div style={cardStyle}>
                <p style={labelStyle}>Risk Clusters</p>
                <h2 style={numberStyle}>19</h2>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
                  {/* TRUSTED SECTION */}

<div
  style={{
    padding: "40px 80px 100px 80px"
  }}
>

  <p
    style={{
      color: "#64748B",
      marginBottom: "30px",
      letterSpacing: "2px",
      fontSize: "13px"
    }}
  >
    TRUSTED INVESTIGATION TECHNOLOGIES
  </p>

  <div
    style={{
      display: "flex",
      gap: "25px",
      flexWrap: "wrap"
    }}
  >

    {[
      "Real-Time Monitoring",
      "Graph Intelligence",
      "Explainable AI",
      "Suspicious Chain Detection",
      "Enterprise Security"
    ].map((item) => (

      <div
        key={item}
        style={{
          background: "rgba(15,23,42,0.7)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "18px 24px",
          borderRadius: "16px",
          color: "#CBD5E1",
          backdropFilter: "blur(10px)"
        }}
      >
        {item}
      </div>

    ))}

  </div>

</div>


{/* FEATURES SECTION */}

<div
  style={{
    padding: "20px 80px 120px 80px"
  }}
>

  <h2
    style={{
      color: "white",
      fontSize: "42px",
      marginBottom: "15px"
    }}
  >
    Advanced AML Intelligence
  </h2>

  <p
    style={{
      color: "#94A3B8",
      maxWidth: "700px",
      lineHeight: "32px",
      marginBottom: "50px",
      fontSize: "18px"
    }}
  >
    Enterprise-grade transaction monitoring powered by graph neural
    networks, explainable AI and real-time blockchain intelligence.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
      gap: "30px"
    }}
  >

    {[
      {
        title: "Graph Neural Networks",
        desc: "Detect hidden transaction relationships and suspicious communities using GCN and GAT models."
      },

      {
        title: "Explainable AI",
        desc: "Understand exactly why a transaction or wallet was flagged as suspicious."
      },

      {
        title: "Real-Time Monitoring",
        desc: "Monitor blockchain activity continuously with instant fraud intelligence alerts."
      },

      {
        title: "Suspicious Chain Detection",
        desc: "Trace laundering paths, mixers and multi-hop transaction chains automatically."
      }

    ].map((item) => (

      <div
        key={item.title}
        style={{
          background: "linear-gradient(135deg, #1E1B4B, #312E81, #4C1D95)",
          boxShadow: "0 0 25px rgba(139, 92, 246, 0.35)",
          borderRadius: "24px",
          padding: "35px",
          backdropFilter: "blur(10px)"
        }}
      >

        <h3
          style={{
            color: "white",
            marginBottom: "15px",
            fontSize: "24px"
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            color: "#D1D5DB",
            lineHeight: "30px",
            fontSize: "16px"
          }}
        >
          {item.desc}
        </p>

      </div>

    ))}

  </div>

</div>

{/* ANALYTICS SECTION */}

<div
  style={{
    padding: "40px 80px 120px 80px",
    display: "flex",
    gap: "60px",
    alignItems: "center",
    flexWrap: "wrap"
  }}
>

  {/* LEFT */}

  <div style={{ flex: 1, minWidth: "320px" }}>

    <p
      style={{
        color: "#6366F1",
        letterSpacing: "2px",
        marginBottom: "20px",
        fontSize: "14px"
      }}
    >
      ENTERPRISE ANALYTICS PLATFORM
    </p>

    <h2
      style={{
        color: "white",
        fontSize: "48px",
        lineHeight: "62px",
        marginBottom: "25px"
      }}
    >
      Advanced Fraud
      <br />
      Investigation System
    </h2>

    <p
      style={{
        color: "#94A3B8",
        lineHeight: "34px",
        fontSize: "18px",
        maxWidth: "650px"
      }}
    >
      Analyze large-scale financial datasets, detect suspicious
      activity patterns and investigate high-risk entities using
      intelligent graph-based analytics and explainable AI models.
    </p>

  </div>

  {/* RIGHT */}

  <div
    style={{
      flex: 1,
      minWidth: "340px",
      background:
        "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(15,23,42,0.96))",

      border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: "30px",
      padding: "35px",
      boxShadow: "0 0 40px rgba(99,102,241,0.15)"
    }}
  >

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px"
      }}
    >
      <h3 style={{ color: "white" }}>
        Investigation Analytics
      </h3>

      <span
        style={{
          color: "#22C55E",
          background: "rgba(34,197,94,0.1)",
          padding: "8px 14px",
          borderRadius: "20px",
          fontSize: "14px"
        }}
      >
        ACTIVE
      </span>

    </div>

    {[91, 76, 68, 82, 57].map((value, index) => (

      <div
        key={index}
        style={{ marginBottom: "25px" }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}
        >
          <span style={{ color: "#CBD5E1" }}>
            Case #{index + 2041}
          </span>

          <span style={{ color: "#F43F5E" }}>
            {value}%
          </span>

        </div>

        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#172036",
            borderRadius: "20px"
          }}
        >

          <div
            style={{
              width: `${value}%`,
              height: "100%",
              borderRadius: "20px",
              background:
                "linear-gradient(to right, #6366F1, #F43F5E)"
            }}
          />

        </div>

      </div>

    ))}

  </div>

</div>

{/* FOOTER */}

<div
  style={{
    background: "white",
    padding: "70px 80px 30px 80px",
    marginTop: "40px"
  }}
>

  {/* TOP */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap: "50px",
      marginBottom: "50px"
    }}
  >

    {/* BRAND */}

    <div>

      <h1
        style={{
          color: "#0F172A",
          marginBottom: "20px",
          fontSize: "38px"
        }}
      >
        AML Shield
      </h1>

      <p
        style={{
          color: "#64748B",
          lineHeight: "30px",
          fontSize: "16px",
          maxWidth: "450px"
        }}
      >
        Enterprise-grade anti-money laundering investigation
        platform powered by graph intelligence, anomaly detection
        and explainable AI for modern financial security systems.
      </p>

    </div>

    {/* PLATFORM */}

    <div>

      <h3
        style={{
          color: "#0F172A",
          marginBottom: "20px"
        }}
      >
        Platform
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          color: "#64748B"
        }}
      >

        <span>Dashboard</span>
        <span>Analytics</span>
        <span>Reports</span>
        <span>Monitoring</span>

      </div>

    </div>

    {/* FEATURES */}

    <div>

      <h3
        style={{
          color: "#0F172A",
          marginBottom: "20px"
        }}
      >
        Features
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          color: "#64748B"
        }}
      >

        <span>Explainable AI</span>
        <span>Fraud Detection</span>
        <span>Graph Analytics</span>
        <span>Risk Scoring</span>

      </div>

    </div>

    {/* CONTACT */}

    <div>

      <h3
        style={{
          color: "#0F172A",
          marginBottom: "20px"
        }}
      >
        Contact
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          color: "#64748B"
        }}
      >

        <span>support@amlshield.ai</span>
        <span>Pune, Maharashtra</span>
        <span>Enterprise Security</span>

      </div>

    </div>

  </div>

  {/* BOTTOM */}

  <div
    style={{
      borderTop: "1px solid #E2E8F0",
      paddingTop: "25px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "20px"
    }}
  >

    <p style={{ color: "#64748B" }}>
      © 2026 AML Shield. All rights reserved.
    </p>

    <div
      style={{
        display: "flex",
        gap: "25px",
        color: "#64748B"
      }}
    >

      <span>Privacy Policy</span>
      <span>Terms</span>
      <span>Security</span>

    </div>

  </div>

</div>
    </div>
  );
}

const cardStyle = {
  background: "#0F172A",
  borderRadius: "22px",
  padding: "24px"
};

const labelStyle = {
  color: "#94A3B8",
  fontSize: "14px",
  marginBottom: "12px"
};

const numberStyle = {
  color: "white",
  fontSize: "38px",
  margin: 0
};