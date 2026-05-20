import {
  useContext,
  useState
} from "react";

import {
  FaChartBar,
  FaExclamationTriangle,
  FaShieldAlt,
  FaSearch
} from "react-icons/fa";

import Layout from "../components/Layout";

import {
  DataContext
} from "../context/DataContext";

export default function Analytics() {

  const {
    datasetUploaded
  } = useContext(DataContext);

  const [generated,
    setGenerated] =
    useState(false);

  return (

    <Layout active="Analytics">

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
            Analytics
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Analyze fraud trends and suspicious transaction insights
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
            placeholder="Search analytics"
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
              Upload a dataset to generate analytics and fraud insights
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
                icon={<FaChartBar />}
                title="Transactions Analyzed"
                value="24,521"
              />

              <StatCard
                icon={<FaShieldAlt />}
                title="Safe Transactions"
                value="22,184"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                title="Suspicious Activities"
                value="312"
                danger
              />

            </div>

            {/* ANALYTICS PANEL */}

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
                    Fraud Analytics Engine
                  </h2>

                  <p
                    style={{
                      color: "#64748B"
                    }}
                  >
                    Generate analytics and fraud distribution insights
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
                  Generate Analytics
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
                        No Analytics Generated
                      </h2>

                      <p
                        style={{
                          color: "#64748B"
                        }}
                      >
                        Generate analytics to visualize fraud patterns
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
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(320px,1fr))",

                      gap: "24px"
                    }}
                  >

                    <ChartCard
                      title="Fraud Distribution"
                    />

                    <ChartCard
                      title="Risk Score Analysis"
                    />

                    <ChartCard
                      title="Transaction Volume"
                    />

                    <ChartCard
                      title="Suspicious Trends"
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

function ChartCard({
  title
}) {

  return (

    <div
      style={{
        background: "#F8FAFC",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid #E2E8F0"
      }}
    >

      <h3
        style={{
          color: "#111827",
          marginBottom: "20px"
        }}
      >
        {title}
      </h3>

      {/* FAKE CHART */}

      <div
        style={{
          height: "220px",
          display: "flex",
          alignItems: "flex-end",
          gap: "16px"
        }}
      >

        {[80, 140, 110, 170, 130, 190]
          .map((height, index) => (

            <div
              key={index}

              style={{
                flex: 1,
                height: `${height}px`,

                background:
                  "linear-gradient(180deg,#6366F1,#8B5CF6)",

                borderRadius: "14px 14px 0 0"
              }}
            />

          ))}

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