import {
  useState,
  useContext
} from "react";

import {
  FaSearch,
  FaDownload
} from "react-icons/fa";

import {
  DataContext
} from "../context/DataContext";

import Layout from "../components/Layout";

export default function Transactions() {

  const {
  datasetUploaded,
  transactions
} = useContext(DataContext);

  
const allData = transactions;

  const [search, setSearch] = useState("");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedTx, setSelectedTx] =
    useState(null);

  const filteredData = allData.filter((item) => {

    const matchesSearch =
      item.id.toLowerCase().includes(
        search.toLowerCase()
      );

    const matchesRisk =
      riskFilter === "All" ||
      item.risk === riskFilter;

    const matchesStatus =
      statusFilter === "All" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesRisk &&
      matchesStatus
    );
  });

  return (

    <Layout active="Transactions">

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
            Transactions
          </h1>

          <p
            style={{
              color: "#64748B"
            }}
          >
            Monitor suspicious transaction activities
          </p>

        </div>

        {/* CONTROLS */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >

          {/* SEARCH */}

          <div
            style={{
              background: "white",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              borderRadius: "14px",
              border: "1px solid #CBD5E1"
            }}
          >

            <FaSearch color="#64748B" />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }

              style={{
                border: "none",
                outline: "none",
                background: "transparent"
              }}
            />

          </div>

          {/* RISK */}

          <select
            value={riskFilter}
            onChange={(e) =>
              setRiskFilter(e.target.value)
            }

            style={selectStyle}
          >

            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>

          </select>

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }

            style={selectStyle}
          >

            <option>All</option>
            <option>Flagged</option>
            <option>Monitor</option>
            <option>Safe</option>

          </select>

          {/* EXPORT */}

          <button
            style={{
              background:
                "linear-gradient(135deg,#4F46E5,#7C3AED)",

              color: "white",
              padding: "14px 22px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer"
            }}
          >

            <FaDownload />

            Export

          </button>

        </div>

      </div>

      {/* EMPTY STATE */}

      {
        !datasetUploaded && (

          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "70px",
              textAlign: "center"
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
              Upload a transaction dataset to view investigation records
            </p>

          </div>

        )
      }

      {/* TABLE */}

      {
        datasetUploaded && (

          <div
            style={{
              background: "white",
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.04)"
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >

              <thead
                style={{
                  background: "#EEF2FF"
                }}
              >

                <tr>

                  {[
                    "Transaction ID",
                    "Amount",
                    "Risk Level",
                    "Risk Score",
                    "Status"
                  ].map((head) => (

                    <th
                      key={head}
                      style={{
                        padding: "22px",
                        textAlign: "left",
                        color: "#111827",
                        fontWeight: "600"
                      }}
                    >
                      {head}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {filteredData.map((item, index) => (

                  <tr
                    key={index}
                    onClick={() =>
                      setSelectedTx(item)
                    }

                    style={{
                      borderBottom:
                        "1px solid #E2E8F0",

                      cursor: "pointer"
                    }}
                  >

                    <td style={cellStyle}>
                      {item.id}
                    </td>

                    <td style={cellStyle}>
                      {item.amount}
                    </td>

                    <td style={cellStyle}>

                      <span
                        style={{
                          background:
                            item.risk === "High"
                              ? "rgba(244,63,94,0.12)"
                              : item.risk === "Medium"
                              ? "rgba(234,179,8,0.12)"
                              : "rgba(34,197,94,0.12)",

                          color:
                            item.risk === "High"
                              ? "#F43F5E"
                              : item.risk === "Medium"
                              ? "#CA8A04"
                              : "#16A34A",

                          padding: "8px 14px",
                          borderRadius: "20px",
                          fontWeight: "600"
                        }}
                      >
                        {item.risk}
                      </span>

                    </td>

                    <td style={cellStyle}>
                      {item.score}
                    </td>

                    <td style={cellStyle}>

                      <span
                        style={{
                          background:
                            item.status === "Flagged"
                              ? "rgba(244,63,94,0.12)"
                              : item.status === "Monitor"
                              ? "rgba(234,179,8,0.12)"
                              : "rgba(34,197,94,0.12)",

                          color:
                            item.status === "Flagged"
                              ? "#F43F5E"
                              : item.status === "Monitor"
                              ? "#CA8A04"
                              : "#16A34A",

                          padding: "8px 14px",
                          borderRadius: "20px",
                          fontWeight: "600"
                        }}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* PAGINATION */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px",
                flexWrap: "wrap",
                gap: "20px"
              }}
            >

              <p
                style={{
                  color: "#64748B"
                }}
              >
                Showing {filteredData.length} transactions
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px"
                }}
              >

                <button style={pageButton}>
                  Previous
                </button>

                <button
                  style={{
                    ...pageButton,
                    background:
                      "linear-gradient(135deg,#4F46E5,#7C3AED)",
                    color: "white"
                  }}
                >
                  1
                </button>

                <button style={pageButton}>
                  Next
                </button>

              </div>

            </div>

          </div>

        )
      }

      {/* MODAL */}

      {selectedTx && (

        <div
          onClick={() =>
            setSelectedTx(null)
          }

          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.45)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }

            style={{
              width: "520px",
              background: "white",
              borderRadius: "28px",
              padding: "35px"
            }}
          >

            <h2
              style={{
                marginBottom: "30px",
                color: "#111827"
              }}
            >
              Transaction Details
            </h2>

            <Detail
              title="Transaction ID"
              value={selectedTx.id}
            />

            <Detail
              title="Sender Wallet"
              value={selectedTx.sender}
            />

            <Detail
              title="Receiver Wallet"
              value={selectedTx.receiver}
            />

            <Detail
              title="Fraud Reason"
              value={selectedTx.reason}
            />

            <Detail
              title="Suspicious Chain"
              value={selectedTx.chain}
            />

            <Detail
              title="Anomaly Score"
              value={selectedTx.anomaly}
            />

          </div>

        </div>

      )}

    </Layout>
  );
}

function Detail({
  title,
  value
}) {

  return (

    <div
      style={{
        marginBottom: "20px"
      }}
    >

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

const cellStyle = {
  padding: "22px",
  color: "#111827"
};

const selectStyle = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1px solid #CBD5E1",
  background: "white",
  fontSize: "15px"
};

const pageButton = {
  padding: "10px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#EEF2FF",
  cursor: "pointer"
};