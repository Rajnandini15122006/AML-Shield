import {
  useContext,
  useState
} from "react";

import {
  FaLink,
  FaExclamationTriangle,
  FaSearch,
  FaProjectDiagram
} from "react-icons/fa";

import Layout from "../components/Layout";

import {
  DataContext
} from "../context/DataContext";

export default function SuspiciousChains() {

  const {
    datasetUploaded
  } = useContext(DataContext);

  const [generated,
    setGenerated] =
    useState(false);

  return (

    <Layout active="Suspicious Chains">

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
            Suspicious Chains
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Detect layered transaction paths and laundering chains
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
            placeholder="Search chains"
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
              Upload a dataset to detect suspicious laundering chains
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
                icon={<FaLink />}
                title="Detected Chains"
                value="84"
              />

              <StatCard
                icon={<FaProjectDiagram />}
                title="Connected Wallets"
                value="1,248"
              />

              <StatCard
                icon={<FaExclamationTriangle />}
                title="High Risk Paths"
                value="28"
                danger
              />

            </div>

            {/* MAIN PANEL */}

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
                    Laundering Chain Detection Engine
                  </h2>

                  <p
                    style={{
                      color: "#64748B"
                    }}
                  >
                    Detect suspicious transaction movement patterns
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
                  Detect Chains
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
                        No Chains Detected Yet
                      </h2>

                      <p
                        style={{
                          color: "#64748B"
                        }}
                      >
                        Generate analysis to detect suspicious transaction chains
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

                    <ChainCard
                      chain="Wallet A → Wallet B → Wallet C → Wallet D"
                      risk="High Risk"
                    />

                    <ChainCard
                      chain="Wallet X → Wallet Y → Wallet Z"
                      risk="Moderate Risk"
                    />

                    <ChainCard
                      chain="Wallet P → Wallet Q → Wallet T"
                      risk="Critical"
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

function ChainCard({
  chain,
  risk
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
            {chain}
          </h2>

          <p
            style={{
              color: "#64748B"
            }}
          >
            AI-detected suspicious laundering path
          </p>

        </div>

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
          {risk}
        </span>

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