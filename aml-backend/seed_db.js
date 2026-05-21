const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Transaction = require("./models/Transaction");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/aml_db";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Read the results file
    const resultsPath = path.resolve(__dirname, "../sample_transactions.csv_results.json");
    if (!fs.existsSync(resultsPath)) {
      console.error("Results file not found at:", resultsPath);
      process.exit(1);
    }
    
    const rawResults = fs.readFileSync(resultsPath, "utf8");
    const results = JSON.parse(rawResults);
    
    // Clear and insert
    await Transaction.deleteMany({});
    console.log("Cleared existing transactions");
    
    await Transaction.insertMany(results);
    console.log(`Successfully seeded ${results.length} transactions with full GNN & Cluster metrics!`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error seeding DB:", err);
    process.exit(1);
  });
