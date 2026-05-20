import {
  useContext,
  useState
} from "react";

import {
  FaBrain,
  FaRobot,
  FaExclamationTriangle,
  FaSearch
} from "react-icons/fa";

import Layout from "../components/Layout";

import {
  DataContext
} from "../context/DataContext";

export default function ExplainableAI() {

  const {
    datasetUploaded
  } = useContext(DataContext);

  const [generated,
    setGenerated] =
    useState(false);

  return (

    <Layout active="Explainable AI">

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
            Explainable AI
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Understand why transactions were flagged by AI models
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
            placeholder="Search transaction"
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
              Upload a dataset to generate AI-based fraud explanations
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
                icon={<FaBrain />}
                title="AI Explanations"
                value="2,184"
              />

              <StatCard
                icon={<FaRobot />}
                title="Model Confidence"
                value="94%"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                title="High Risk Predictions"
                value="312"
                danger
              />

            </div>

            {/* GENERATE PANEL */}

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
                    AI Fraud Explanation Engine
                  </h2>

                  <p
                    style={{
                      color: "#64748B"
                    }}
                  >
                    Generate explainable insights for suspicious transactions
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
                  Generate AI Explanation
                </button>

              </div>

              {/* EMPTY */}

              {
                !generated && (

                  <div
                    style={{
                      height: "400px",
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
                        No AI Explanation Generated
                      </h2>

                      <p
                        style={{
                          color: "#64748B"
                        }}
                      >
                        Generate explanations to understand fraud predictions
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

                    <ExplanationCard
                      tx="TXN78231"
                      confidence="94%"
                      reason="Connected to suspicious transaction cluster"
                      anomaly="High transfer frequency detected"
                    />

                    <ExplanationCard
                      tx="TXN78234"
                      confidence="91%"
                      reason="Interaction with high-risk wallets"
                      anomaly="Unusual transaction routing pattern"
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

function ExplanationCard({
  tx,
  confidence,
  reason,
  anomaly
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
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >

        <h2
          style={{
            color: "#111827"
          }}
        >
          {tx}
        </h2>

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
          Confidence: {confidence}
        </span>

      </div>

      <div
        style={{
          display: "grid",
          gap: "18px"
        }}
      >

        <Detail
          title="Fraud Reason"
          value={reason}
        />

        <Detail
          title="Anomaly Analysis"
          value={anomaly}
        />

      </div>

    </div>

  );
}

function Detail({
  title,
  value
}) {

  return (

    <div>

      <p
        style={{
          color: "#64748B",
          marginBottom: "6px"
        }}
      >
        {title}
      </p>

      <h4
        style={{
          color: "#111827"
        }}
      >
        {value}
      </h4>

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