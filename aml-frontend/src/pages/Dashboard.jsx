// import axios from "axios";

// import {
//   useEffect,
//   useState
// } from "react";

// import { DataContext } from "../context/DataContext";
// import {
//   FaChartLine,
//   FaExclamationTriangle,
//   FaProjectDiagram,
//   FaShieldAlt,
//   FaUpload,
//   FaSearch
// } from "react-icons/fa";
// import { useContext } from "react";
// import Layout from "../components/Layout";

// export default function Dashboard() {

//   const [transactions,
//   setTransactions] =
//   useState([]);
//  const {
//   datasetUploaded,
//   setDatasetUploaded,
//   transactions,
//   setTransactions
// } = useContext(DataContext);

//     const totalTransactions =
//   transactions.length;

// const fraudAlerts =
//   transactions.filter(
//     (tx) =>
//       tx.risk === "High" ||
//       tx.status === "Flagged"
//   ).length;

// const suspiciousChains =
//   Math.floor(
//     fraudAlerts / 2
//   );

// const riskScore =
//   totalTransactions > 0
//     ? Math.floor(
//         (fraudAlerts /
//           totalTransactions) *
//           100
//       )
//     : 0;

//   return (

//     <Layout active="Dashboard">

//       {/* TOPBAR */}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "35px",
//           flexWrap: "wrap",
//           gap: "20px"
//         }}
//       >

//         <div>

//           <h1
//             style={{
//               color: "#111827",
//               fontSize: "38px",
//               marginBottom: "8px"
//             }}
//           >
//             Investigation Dashboard
//           </h1>

//           <p
//             style={{
//               color: "#64748B"
//             }}
//           >
//             Monitor suspicious financial activities
//           </p>

//         </div>

//         {/* SEARCH */}

//         <div
//           style={{
//             background: "white",
//             padding: "14px 20px",
//             borderRadius: "16px",
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             width: "320px",
//             boxShadow:
//               "0 10px 30px rgba(0,0,0,0.04)"
//           }}
//         >

//           <FaSearch color="#64748B" />

//           <input
//             placeholder="Search transaction..."
//             style={{
//               border: "none",
//               outline: "none",
//               width: "100%",
//               fontSize: "15px"
//             }}
//           />

//         </div>

//       </div>

//       {/* STATS */}

//       {
//         datasetUploaded ? (

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns:
//                 "repeat(auto-fit,minmax(240px,1fr))",

//               gap: "25px",
//               marginBottom: "35px"
//             }}
//           >

//             <StatCard
//               icon={<FaChartLine />}
//               title="Total Transactions"
//               value={totalTransactions}
//             />

//             <StatCard
//               icon={<FaExclamationTriangle />}
//               title="Fraud Alerts"
//               value={fraudAlerts}
//               danger
//             />

//             <StatCard
//               icon={<FaProjectDiagram />}
//               title="Suspicious Chains"
//               value={suspiciousChains}
//             />

//             <StatCard
//               icon={<FaShieldAlt />}
//               title="Risk Score"
//               value={`${riskScore}%`}
//             />

//           </div>

//         ) : (

//           <div
//             style={{
//               background: "white",
//               borderRadius: "28px",
//               padding: "70px",
//               textAlign: "center",
//               marginBottom: "35px",
//               boxShadow:
//                 "0 10px 30px rgba(0,0,0,0.04)"
//             }}
//           >

//             <h2
//               style={{
//                 color: "#111827",
//                 marginBottom: "15px"
//               }}
//             >
//               No Dataset Uploaded Yet
//             </h2>

//             <p
//               style={{
//                 color: "#64748B",
//                 fontSize: "17px"
//               }}
//             >
//               Upload a transaction dataset to begin AML investigation
//             </p>

//           </div>

//         )
//       }

//       {/* UPLOAD SECTION */}

//       <div
//         style={{
//           background: "white",
//           borderRadius: "28px",
//           padding: "35px",
//           boxShadow:
//             "0 10px 30px rgba(0,0,0,0.04)"
//         }}
//       >

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginBottom: "25px",
//             flexWrap: "wrap",
//             gap: "20px"
//           }}
//         >

//           <div>

//             <h2
//               style={{
//                 color: "#111827",
//                 marginBottom: "10px"
//               }}
//             >
//               Upload Transaction Dataset
//             </h2>

//             <p
//               style={{
//                 color: "#64748B"
//               }}
//             >
//               Supported format:
//               CSV with transaction records
//             </p>

//           </div>

          
//             <label
//   style={{
//     background:
//       "linear-gradient(90deg,#4F46E5,#7C3AED)",

//     color: "white",
//     padding: "14px 24px",
//     borderRadius: "14px",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     fontWeight: "600",
//     cursor: "pointer"
//   }}
// >

//   <FaUpload />

//   Upload CSV

//   <input
//     type="file"
//     accept=".csv"

//     onChange={async (e) => {

//   const file =
//     e.target.files[0];

//   if (!file) return;

//   try {

//     const formData =
//       new FormData();

//     formData.append(
//       "file",
//       file
//     );

//     const response =
//       await axios.post(

//         "http://localhost:5000/api/upload",

//         formData,

//         {
//           headers: {
//             "Content-Type":
//               "multipart/form-data"
//           }
//         }
//       );

//     console.log(
//       response.data
//     );

//     setDatasetUploaded(true);

//     alert(
//       "Dataset uploaded successfully"
//     );

//   } catch (error) {

//     console.error(error);

//     alert(
//       "Upload failed"
//     );

//   }

// }}

//     hidden
//   />

// </label>
          

//         </div>

//         {/* DROP AREA */}

//         <div
//           style={{
//             border:
//               "2px dashed #CBD5E1",

//             borderRadius: "24px",
//             padding: "70px",
//             textAlign: "center",
//             background: "#F8FAFC"
//           }}
//         >

//           <FaUpload
//             size={50}
//             color="#64748B"
//           />

//           <h3
//             style={{
//               marginTop: "20px",
//               color: "#111827"
//             }}
//           >
//             Drag & Drop CSV File
//           </h3>

//           <p
//             style={{
//               color: "#64748B",
//               marginTop: "10px"
//             }}
//           >
//             Upload transaction dataset for AML analysis
//           </p>

//         </div>

//       </div>

//     </Layout>
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
//           width: "55px",
//           height: "55px",
//           borderRadius: "16px",

//           background:
//             danger
//               ? "rgba(244,63,94,0.12)"
//               : "rgba(99,102,241,0.12)",

//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",

//           color:
//             danger
//               ? "#F43F5E"
//               : "#4F46E5",

//           fontSize: "22px",
//           marginBottom: "18px"
//         }}
//       >
//         {icon}
//       </div>

//       <p
//         style={{
//           color: "#64748B",
//           marginBottom: "12px"
//         }}
//       >
//         {title}
//       </p>

//       <h2
//         style={{
//           color:
//             danger
//               ? "#F43F5E"
//               : "#111827",

//           fontSize: "34px"
//         }}
//       >
//         {value}
//       </h2>

//     </div>

//   );
// }








import axios from "axios";

import {
  useEffect,
  useState
} from "react";

import {
  FaChartLine,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaShieldAlt,
  FaUpload,
  FaSearch
} from "react-icons/fa";

import Layout from "../components/Layout";

export default function Dashboard() {

  const [transactions,
    setTransactions] =
    useState([]);

  const [datasetUploaded,
    setDatasetUploaded] =
    useState(false);

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  useEffect(() => {

    fetchTransactions();

  }, []);

  const fetchTransactions =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/transactions"
          );

        setTransactions(
          response.data
        );

        if (
          response.data.length > 0
        ) {

          setDatasetUploaded(
            true
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  // =========================
  // STATS
  // =========================

  const totalTransactions =
    transactions.length;

  const fraudAlerts =
    transactions.filter(
      (tx) =>
        tx.risk === "High" ||
        tx.status === "Flagged"
    ).length;

  const suspiciousChains =
    Math.floor(
      fraudAlerts / 2
    );

  const riskScore =
    totalTransactions > 0
      ? Math.floor(
          (fraudAlerts /
            totalTransactions) *
            100
        )
      : 0;

  // =========================
  // UPLOAD FILE
  // =========================

  const handleUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      try {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await axios.post(

            "http://localhost:5000/api/upload",

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );

        console.log(
          response.data
        );

        alert(
          "Dataset uploaded successfully"
        );

        fetchTransactions();

      } catch (error) {

        console.error(error);

        alert(
          "Upload failed"
        );

      }

    };

  return (

    <Layout active="Dashboard">

      {/* TOPBAR */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "35px",

          flexWrap: "wrap",

          gap: "20px"
        }}
      >

        <div>

          <h1
            style={{
              color: "#111827",
              fontSize: "38px",
              marginBottom: "8px"
            }}
          >
            Investigation Dashboard
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Monitor suspicious financial activities
          </p>

        </div>

        {/* SEARCH */}

        <div
          style={{
            background: "white",

            padding:
              "14px 20px",

            borderRadius: "16px",

            display: "flex",

            alignItems: "center",

            gap: "12px",

            width: "320px",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)"
          }}
        >

          <FaSearch
            color="#64748B"
          />

          <input
            placeholder="Search transaction..."

            style={{
              border: "none",

              outline: "none",

              width: "100%",

              fontSize: "15px"
            }}
          />

        </div>

      </div>

      {/* STATS */}

      {
        datasetUploaded ? (

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(240px,1fr))",

              gap: "25px",

              marginBottom: "35px"
            }}
          >

            <StatCard
              icon={
                <FaChartLine />
              }

              title="Total Transactions"

              value={
                totalTransactions
              }
            />

            <StatCard
              icon={
                <FaExclamationTriangle />
              }

              title="Fraud Alerts"

              value={
                fraudAlerts
              }

              danger
            />

            <StatCard
              icon={
                <FaProjectDiagram />
              }

              title="Suspicious Chains"

              value={
                suspiciousChains
              }
            />

            <StatCard
              icon={
                <FaShieldAlt />
              }

              title="Risk Score"

              value={`${riskScore}%`}
            />

          </div>

        ) : (

          <div
            style={{
              background: "white",

              borderRadius: "28px",

              padding: "70px",

              textAlign: "center",

              marginBottom: "35px",

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
              Upload a transaction dataset to begin AML investigation
            </p>

          </div>

        )
      }

      {/* UPLOAD SECTION */}

      <div
        style={{
          background: "white",

          borderRadius: "28px",

          padding: "35px",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.04)"
        }}
      >

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "25px",

            flexWrap: "wrap",

            gap: "20px"
          }}
        >

          <div>

            <h2
              style={{
                color: "#111827",

                marginBottom: "10px"
              }}
            >
              Upload Transaction Dataset
            </h2>

            <p
              style={{
                color: "#64748B"
              }}
            >
              Supported formats:
              CSV, XLSX, XLS
            </p>

          </div>

          <label
            style={{
              background:
                "linear-gradient(90deg,#4F46E5,#7C3AED)",

              color: "white",

              padding:
                "14px 24px",

              borderRadius: "14px",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              fontWeight: "600",

              cursor: "pointer"
            }}
          >

            <FaUpload />

            Upload Dataset

            <input
              type="file"

              accept=".csv,.xlsx,.xls"

              onChange={
                handleUpload
              }

              hidden
            />

          </label>

        </div>

        {/* DROP AREA */}

        <div
          style={{
            border:
              "2px dashed #CBD5E1",

            borderRadius: "24px",

            padding: "70px",

            textAlign: "center",

            background: "#F8FAFC"
          }}
        >

          <FaUpload
            size={50}
            color="#64748B"
          />

          <h3
            style={{
              marginTop: "20px",

              color: "#111827"
            }}
          >
            Drag & Drop Dataset
          </h3>

          <p
            style={{
              color: "#64748B",

              marginTop: "10px"
            }}
          >
            Upload AML transaction dataset
          </p>

        </div>

      </div>

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
          width: "55px",

          height: "55px",

          borderRadius: "16px",

          background:
            danger
              ? "rgba(244,63,94,0.12)"
              : "rgba(99,102,241,0.12)",

          display: "flex",

          alignItems: "center",

          justifyContent:
            "center",

          color:
            danger
              ? "#F43F5E"
              : "#4F46E5",

          fontSize: "22px",

          marginBottom: "18px"
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#64748B",

          marginBottom: "12px"
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color:
            danger
              ? "#F43F5E"
              : "#111827",

          fontSize: "34px"
        }}
      >
        {value}
      </h2>

    </div>

  );
}