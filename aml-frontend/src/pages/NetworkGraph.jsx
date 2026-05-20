// import {
//   FaProjectDiagram,
//   FaSearch,
//   FaShieldAlt,
//   FaExclamationTriangle
// } from "react-icons/fa";

// export default function NetworkGraph() {

//   return (

//     <div
//       style={{
//         display: "flex",
//         minHeight: "100vh",
//         background: "#f5f7fb"
//       }}
//     >

//       {/* SIDEBAR */}

//       <div
//         style={{
//           width: "260px",
//           background: "white",
//           borderRight: "1px solid #E2E8F0",
//           padding: "30px"
//         }}
//       >

//         <h2
//           style={{
//             color: "#111827",
//             marginBottom: "45px",
//             fontSize: "34px"
//           }}
//         >
//           AML Shield
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "12px"
//           }}
//         >

//           {[
//             "Dashboard",
//             "Upload CSV",
//             "Transactions",
//             "Network Graph",
//             "Suspicious Chains",
//             "Explainable AI",
//             "Analytics",
//             "Reports",
//             "History",
//             "Settings"
//           ].map((item) => (

//             <div
//               key={item}
//               style={{
//                 padding: "14px 18px",
//                 borderRadius: "14px",

//                 background:
//                   item === "Network Graph"
//                     ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
//                     : "transparent",

//                 color:
//                   item === "Network Graph"
//                     ? "white"
//                     : "#475569",

//                 fontWeight:
//                   item === "Network Graph"
//                     ? "600"
//                     : "500",

//                 cursor: "pointer"
//               }}
//             >
//               {item}
//             </div>

//           ))}

//         </div>

//       </div>

//       {/* MAIN */}

//       <div
//         style={{
//           flex: 1,
//           padding: "35px"
//         }}
//       >

//         {/* TOP */}

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "30px",
//             flexWrap: "wrap",
//             gap: "20px"
//           }}
//         >

//           <div>

//             <h1
//               style={{
//                 fontSize: "38px",
//                 color: "#111827",
//                 marginBottom: "10px"
//               }}
//             >
//               Network Graph Analysis
//             </h1>

//             <p
//               style={{
//                 color: "#64748B"
//               }}
//             >
//               Visualize suspicious transaction chains and wallet connections
//             </p>

//           </div>

//           {/* SEARCH */}

//           <div
//             style={{
//               background: "white",
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               padding: "14px 18px",
//               borderRadius: "14px",
//               border: "1px solid #CBD5E1",
//               width: "320px"
//             }}
//           >

//             <FaSearch color="#64748B" />

//             <input
//               type="text"
//               placeholder="Search wallet / transaction"
//               style={{
//                 border: "none",
//                 outline: "none",
//                 width: "100%",
//                 background: "transparent"
//               }}
//             />

//           </div>

//         </div>

//         {/* STATS */}

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns:
//               "repeat(auto-fit,minmax(240px,1fr))",

//             gap: "22px",
//             marginBottom: "30px"
//           }}
//         >

//           <StatCard
//             icon={<FaProjectDiagram />}
//             title="Connected Wallets"
//             value="12,842"
//           />

//           <StatCard
//             icon={<FaShieldAlt />}
//             title="Safe Nodes"
//             value="10,421"
//           />

//           <StatCard
//             icon={<FaExclamationTriangle />}
//             title="Suspicious Nodes"
//             value="284"
//             danger
//           />

//         </div>

//         {/* GRAPH AREA */}

//         <div
//           style={{
//             background: "white",
//             borderRadius: "30px",
//             padding: "30px",
//             boxShadow:
//               "0 10px 30px rgba(0,0,0,0.04)"
//           }}
//         >

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "30px",
//               flexWrap: "wrap",
//               gap: "20px"
//             }}
//           >

//             <div>

//               <h2
//                 style={{
//                   color: "#111827",
//                   marginBottom: "8px"
//                 }}
//               >
//                 Transaction Relationship Graph
//               </h2>

//               <p
//                 style={{
//                   color: "#64748B"
//                 }}
//               >
//                 AI-generated visualization of suspicious transaction paths
//               </p>

//             </div>

//             <button
//               style={{
//                 background:
//                   "linear-gradient(135deg,#4F46E5,#7C3AED)",

//                 color: "white",
//                 border: "none",
//                 padding: "14px 22px",
//                 borderRadius: "14px",
//                 fontWeight: "600",
//                 cursor: "pointer"
//               }}
//             >
//               Generate Graph
//             </button>

//           </div>

//           {/* FAKE GRAPH */}

//           <div
//             style={{
//               height: "600px",
//               borderRadius: "24px",
//               background:
//                 "linear-gradient(to bottom right,#F8FAFC,#EEF2FF)",

//               position: "relative",
//               overflow: "hidden"
//             }}
//           >

//             {/* CENTER NODE */}

//             <Node
//               top="42%"
//               left="46%"
//               label="TXN78231"
//               color="#EF4444"
//               size="95px"
//             />

//             {/* SAFE */}

//             <Node
//               top="18%"
//               left="28%"
//               label="Wallet A"
//               color="#10B981"
//             />

//             <Node
//               top="22%"
//               left="68%"
//               label="Wallet B"
//               color="#6366F1"
//             />

//             <Node
//               top="70%"
//               left="30%"
//               label="Wallet C"
//               color="#F59E0B"
//             />

//             <Node
//               top="72%"
//               left="68%"
//               label="Wallet D"
//               color="#8B5CF6"
//             />

//             {/* CONNECTIONS */}

//             <Line
//               top="32%"
//               left="38%"
//               rotate="-30deg"
//             />

//             <Line
//               top="32%"
//               left="54%"
//               rotate="30deg"
//             />

//             <Line
//               top="58%"
//               left="38%"
//               rotate="30deg"
//             />

//             <Line
//               top="58%"
//               left="54%"
//               rotate="-30deg"
//             />

//           </div>

//         </div>

//       </div>

//     </div>

//   );
// }

// function StatCard({
//   icon,
//   title,
//   value,
//   danger
// }) {

//   return (

//     <div
//       style={{
//         background: "white",
//         borderRadius: "24px",
//         padding: "28px",
//         boxShadow:
//           "0 10px 30px rgba(0,0,0,0.04)"
//       }}
//     >

//       <div
//         style={{
//           width: "58px",
//           height: "58px",
//           borderRadius: "18px",

//           background: danger
//             ? "rgba(239,68,68,0.12)"
//             : "rgba(99,102,241,0.12)",

//           color: danger
//             ? "#EF4444"
//             : "#6366F1",

//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",

//           fontSize: "22px",
//           marginBottom: "20px"
//         }}
//       >
//         {icon}
//       </div>

//       <p
//         style={{
//           color: "#64748B",
//           marginBottom: "10px"
//         }}
//       >
//         {title}
//       </p>

//       <h2
//         style={{
//           color: "#111827",
//           fontSize: "34px"
//         }}
//       >
//         {value}
//       </h2>

//     </div>

//   );
// }

// function Node({
//   top,
//   left,
//   label,
//   color,
//   size = "75px"
// }) {

//   return (

//     <div
//       style={{
//         position: "absolute",
//         top,
//         left,

//         width: size,
//         height: size,

//         borderRadius: "50%",

//         background: color,

//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",

//         color: "white",
//         fontWeight: "600",

//         boxShadow:
//           "0 10px 30px rgba(0,0,0,0.15)"
//       }}
//     >

//       <span
//         style={{
//           fontSize: "12px",
//           textAlign: "center",
//           padding: "6px"
//         }}
//       >
//         {label}
//       </span>

//     </div>

//   );
// }

// function Line({
//   top,
//   left,
//   rotate
// }) {

//   return (

//     <div
//       style={{
//         position: "absolute",
//         top,
//         left,

//         width: "180px",
//         height: "3px",

//         background:
//           "linear-gradient(90deg,#6366F1,#8B5CF6)",

//         transform: `rotate(${rotate})`
//       }}
//     />

//   );
// }



import {
  useState,
  useContext
} from "react";

import {
  FaProjectDiagram,
  FaSearch,
  FaShieldAlt,
  FaExclamationTriangle
} from "react-icons/fa";

import {
  DataContext
} from "../context/DataContext";

import Layout from "../components/Layout";

export default function NetworkGraph() {

  const {
    datasetUploaded
  } = useContext(DataContext);

  const [graphGenerated,
    setGraphGenerated] =
    useState(false);

  return (

    <Layout active="Network Graph">

      {/* TOP */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >

        <div>

          <h1
            style={{
              fontSize: "38px",
              color: "#111827",
              marginBottom: "10px"
            }}
          >
            Network Graph Analysis
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Visualize suspicious transaction chains and wallet connections
          </p>

        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "white",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 18px",
            borderRadius: "14px",
            border: "1px solid #CBD5E1",
            width: "320px"
          }}
        >

          <FaSearch color="#64748B" />

          <input
            type="text"
            placeholder="Search wallet / transaction"
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent"
            }}
          />

        </div>

      </div>

      {/* EMPTY STATE */}

      {
        !datasetUploaded && (

          <div
            style={{
              background: "white",
              borderRadius: "28px",
              padding: "80px",
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.04)"
            }}
          >

            <h2
              style={{
                color: "#111827",
                marginBottom: "15px"
              }}
            >
              No Dataset Uploaded Yet
            </h2>

            <p
              style={{
                color: "#64748B",
                fontSize: "17px"
              }}
            >
              Upload a transaction dataset to generate investigation graphs
            </p>

          </div>

        )
      }

      {/* MAIN CONTENT */}

      {
        datasetUploaded && (

          <>

            {/* STATS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(240px,1fr))",

                gap: "22px",
                marginBottom: "30px"
              }}
            >

              <StatCard
                icon={<FaProjectDiagram />}
                title="Connected Wallets"
                value="12,842"
              />

              <StatCard
                icon={<FaShieldAlt />}
                title="Safe Nodes"
                value="10,421"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                title="Suspicious Nodes"
                value="284"
                danger
              />

            </div>

            {/* GRAPH AREA */}

            <div
              style={{
                background: "white",
                borderRadius: "30px",
                padding: "30px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.04)"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "30px",
                  flexWrap: "wrap",
                  gap: "20px"
                }}
              >

                <div>

                  <h2
                    style={{
                      color: "#111827",
                      marginBottom: "8px"
                    }}
                  >
                    Transaction Relationship Graph
                  </h2>

                  <p
                    style={{
                      color: "#64748B"
                    }}
                  >
                    AI-generated visualization of suspicious transaction paths
                  </p>

                </div>

                <button
                  onClick={() =>
                    setGraphGenerated(true)
                  }

                  style={{
                    background:
                      "linear-gradient(135deg,#4F46E5,#7C3AED)",

                    color: "white",
                    border: "none",
                    padding: "14px 22px",
                    borderRadius: "14px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Generate Graph
                </button>

              </div>

              {/* GRAPH EMPTY STATE */}

              {
                !graphGenerated && (

                  <div
                    style={{
                      height: "500px",
                      borderRadius: "24px",
                      background:
                        "linear-gradient(to bottom right,#F8FAFC,#EEF2FF)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  >

                    <div>

                      <h2
                        style={{
                          color: "#111827",
                          marginBottom: "15px"
                        }}
                      >
                        No Graph Generated Yet
                      </h2>

                      <p
                        style={{
                          color: "#64748B"
                        }}
                      >
                        Click "Generate Graph"
                        to visualize suspicious transaction flows
                      </p>

                    </div>

                  </div>

                )
              }

              {/* GRAPH */}

              {
                graphGenerated && (

                  <div
                    style={{
                      height: "600px",
                      borderRadius: "24px",
                      background:
                        "linear-gradient(to bottom right,#F8FAFC,#EEF2FF)",

                      position: "relative",
                      overflow: "hidden"
                    }}
                  >

                    {/* CENTER NODE */}

                    <Node
                      top="42%"
                      left="46%"
                      label="TXN78231"
                      color="#EF4444"
                      size="95px"
                    />

                    {/* SAFE */}

                    <Node
                      top="18%"
                      left="28%"
                      label="Wallet A"
                      color="#10B981"
                    />

                    <Node
                      top="22%"
                      left="68%"
                      label="Wallet B"
                      color="#6366F1"
                    />

                    <Node
                      top="70%"
                      left="30%"
                      label="Wallet C"
                      color="#F59E0B"
                    />

                    <Node
                      top="72%"
                      left="68%"
                      label="Wallet D"
                      color="#8B5CF6"
                    />

                    {/* CONNECTIONS */}

                    <Line
                      top="32%"
                      left="38%"
                      rotate="-30deg"
                    />

                    <Line
                      top="32%"
                      left="54%"
                      rotate="30deg"
                    />

                    <Line
                      top="58%"
                      left="38%"
                      rotate="30deg"
                    />

                    <Line
                      top="58%"
                      left="54%"
                      rotate="-30deg"
                    />

                  </div>

                )
              }

            </div>

          </>

        )
      }

    </Layout>

  );
}

function StatCard({
  icon,
  title,
  value,
  danger
}) {

  return (

    <div
      style={{
        background: "white",
        borderRadius: "24px",
        padding: "28px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.04)"
      }}
    >

      <div
        style={{
          width: "58px",
          height: "58px",
          borderRadius: "18px",

          background: danger
            ? "rgba(239,68,68,0.12)"
            : "rgba(99,102,241,0.12)",

          color: danger
            ? "#EF4444"
            : "#6366F1",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontSize: "22px",
          marginBottom: "20px"
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#64748B",
          marginBottom: "10px"
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: "#111827",
          fontSize: "34px"
        }}
      >
        {value}
      </h2>

    </div>

  );
}

function Node({
  top,
  left,
  label,
  color,
  size = "75px"
}) {

  return (

    <div
      style={{
        position: "absolute",
        top,
        left,

        width: size,
        height: size,

        borderRadius: "50%",

        background: color,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: "white",
        fontWeight: "600",

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.15)"
      }}
    >

      <span
        style={{
          fontSize: "12px",
          textAlign: "center",
          padding: "6px"
        }}
      >
        {label}
      </span>

    </div>

  );
}

function Line({
  top,
  left,
  rotate
}) {

  return (

    <div
      style={{
        position: "absolute",
        top,
        left,

        width: "180px",
        height: "3px",

        background:
          "linear-gradient(90deg,#6366F1,#8B5CF6)",

        transform: `rotate(${rotate}deg)`
      }}
    />

  );
}