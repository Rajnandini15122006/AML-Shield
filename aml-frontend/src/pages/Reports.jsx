import {
  useContext,
  useState
} from "react";

import {
  FaFileAlt,
  FaDownload,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";

import Layout from "../components/Layout";

import {
  DataContext
} from "../context/DataContext";

export default function Reports() {

  const {
    datasetUploaded
  } = useContext(DataContext);

  const [generated,
    setGenerated] =
    useState(false);

  return (

    <Layout active="Reports">

      {/* TOPBAR */}

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
              color: "#111827",
              fontSize: "38px",
              marginBottom: "10px"
            }}
          >
            Investigation Reports
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Generate AML investigation reports and fraud summaries
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
            placeholder="Search reports"
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
              Upload a dataset to generate AML investigation reports
            </p>

          </div>

        )
      }

      {/* MAIN */}

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
                icon={<FaFileAlt />}
                title="Generated Reports"
                value="184"
              />

              <StatCard
                icon={<FaDownload />}
                title="Exported Reports"
                value="92"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                title="Critical Investigations"
                value="28"
                danger
              />

            </div>

            {/* REPORT PANEL */}

            <div
              style={{
                background: "white",
                borderRadius: "30px",
                padding: "35px",
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
                    AML Investigation Report Engine
                  </h2>

                  <p
                    style={{
                      color: "#64748B"
                    }}
                  >
                    Generate downloadable fraud investigation reports
                  </p>

                </div>

                <button
                  onClick={() =>
                    setGenerated(true)
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
                  Generate Report
                </button>

              </div>

              {/* EMPTY */}

              {
                !generated && (

                  <div
                    style={{
                      height: "420px",
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
                        No Report Generated
                      </h2>

                      <p
                        style={{
                          color: "#64748B"
                        }}
                      >
                        Generate investigation reports from analyzed transactions
                      </p>

                    </div>

                  </div>

                )
              }

              {/* GENERATED */}

              {
                generated && (

                  <div
                    style={{
                      display: "grid",
                      gap: "24px"
                    }}
                  >

                    <ReportCard
                      title="Fraud Investigation Summary"
                      status="High Risk"
                    />

                    <ReportCard
                      title="Suspicious Wallet Analysis"
                      status="Critical"
                    />

                    <ReportCard
                      title="Transaction Chain Investigation"
                      status="Moderate Risk"
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

function ReportCard({
  title,
  status
}) {

  return (

    <div
      style={{
        background: "#F8FAFC",
        borderRadius: "24px",
        padding: "28px",
        border: "1px solid #E2E8F0"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            {title}
          </h2>

          <p
            style={{
              color: "#64748B"
            }}
          >
            AI-generated AML investigation report
          </p>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}
        >

          <span
            style={{
              background:
                "rgba(244,63,94,0.12)",

              color: "#F43F5E",

              padding: "10px 16px",
              borderRadius: "18px",
              fontWeight: "600"
            }}
          >
            {status}
          </span>

          <button
            style={{
              background:
                "linear-gradient(135deg,#4F46E5,#7C3AED)",

              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Download PDF
          </button>

        </div>

      </div>

    </div>

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