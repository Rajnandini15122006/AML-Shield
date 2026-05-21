const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/aml_db";
const API_URL = "http://localhost:5000/api";

async function run() {
  console.log("Starting transaction simulator verification test...");
  
  // 1. Connect to MongoDB to make sure a test user exists
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for test user setup");
  
  const User = mongoose.model("User", new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    department: String,
    role: String
  }));

  const Transaction = mongoose.model("Transaction", new mongoose.Schema({
    transactionId: String,
    amount: String,
    risk: String,
    score: String,
    status: String,
    sender: String,
    receiver: String,
    anomalyScore: Number,
    gnnScore: Number,
    clusterRisk: Number,
    userId: mongoose.Schema.Types.ObjectId
  }));

  const testEmail = `tester_${Date.now()}@example.com`;
  const testPassword = "password123";

  // Register the test user via API
  console.log(`Registering test user: ${testEmail}`);
  let registerRes;
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Investigator",
        email: testEmail,
        password: testPassword,
        department: "Sandbox testing",
        role: "investigator"
      })
    });
    registerRes = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(registerRes));
    }
  } catch (err) {
    console.error("Registration failed:", err.message);
    process.exit(1);
  }

  const token = registerRes.token;
  const userId = registerRes.user.id;
  console.log(`Successfully registered test user. UserID: ${userId}`);

  // Create a couple of baseline transactions in the database first to simulate an existing graph
  console.log("Creating seed baseline transactions for test user...");
  const baseTxs = [
    {
      transactionId: "TX-BASE-1",
      amount: "1.5000",
      sender: "WALLET-A",
      receiver: "WALLET-B",
      risk: "Low Risk",
      score: "0.1500",
      status: "Safe",
      userId: new mongoose.Types.ObjectId(userId)
    },
    {
      transactionId: "TX-BASE-2",
      amount: "2.8000",
      sender: "WALLET-B",
      receiver: "WALLET-C",
      risk: "Low Risk",
      score: "0.1800",
      status: "Safe",
      userId: new mongoose.Types.ObjectId(userId)
    }
  ];
  await Transaction.insertMany(baseTxs);
  console.log("Inserted base transactions");

  // 2. Perform temporary simulation run (commit: false)
  console.log("Running temporary GNN simulation request (commit: false)...");
  try {
    const response = await fetch(`${API_URL}/transactions/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        sender: "WALLET-C",
        receiver: "WALLET-D",
        amount: "5.5000",
        commit: false
      })
    });
    const simRes = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(simRes));
    }

    console.log("Simulation Result Message:", simRes.message);
    console.log("Simulated ID generated:", simRes.simulatedId);
    console.log(`Total transactions returned in simulation: ${simRes.transactions?.length}`);

    // Verify that the database was NOT updated (should still have only 2 baseline transactions)
    const dbCountAfterTemp = await Transaction.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });
    console.log(`Database count after temporary simulation: ${dbCountAfterTemp} (Expected: 2)`);
    if (dbCountAfterTemp !== 2) {
      throw new Error("Validation failed: Temporary run persisted results into the database!");
    }
    console.log("✅ Temporary simulation test passed.");

  } catch (err) {
    console.error("Simulation run (commit: false) failed:", err.message);
    process.exit(1);
  }

  // 3. Perform persistent simulation run (commit: true)
  console.log("Running persistent GNN simulation request (commit: true)...");
  try {
    const response = await fetch(`${API_URL}/transactions/simulate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        sender: "WALLET-C",
        receiver: "WALLET-D",
        amount: "5.5000",
        commit: true
      })
    });
    const commitRes = await response.json();
    if (!response.ok) {
      throw new Error(JSON.stringify(commitRes));
    }

    console.log("Commit Result Message:", commitRes.message);
    console.log("Simulated ID generated:", commitRes.simulatedId);
    console.log(`Total transactions returned: ${commitRes.transactions?.length}`);

    // Verify that the database WAS updated (should now contain 3 transactions with ML scores)
    const dbTxsAfterCommit = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) });
    console.log(`Database count after commit simulation: ${dbTxsAfterCommit.length} (Expected: 3)`);
    if (dbTxsAfterCommit.length !== 3) {
      throw new Error("Validation failed: Commit run did not persist the expected transactions!");
    }

    // Verify GNN and anomaly scores are numbers
    const committedSim = dbTxsAfterCommit.find(tx => tx.transactionId === commitRes.simulatedId);
    console.log("Committed transaction details:", {
      transactionId: committedSim.transactionId,
      amount: committedSim.amount,
      risk: committedSim.risk,
      score: committedSim.score,
      anomalyScore: committedSim.anomalyScore,
      gnnScore: committedSim.gnnScore,
      clusterRisk: committedSim.clusterRisk
    });

    if (committedSim.anomalyScore === undefined || committedSim.gnnScore === undefined) {
      throw new Error("Validation failed: GNN score fields are missing or not populated!");
    }
    console.log("✅ Persistent simulation test passed.");

  } catch (err) {
    console.error("Simulation run (commit: true) failed:", err.message);
    process.exit(1);
  }

  // Clean up
  console.log("Cleaning up test data...");
  await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
  await Transaction.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. All tests completed successfully! 🎉");
}

run();
