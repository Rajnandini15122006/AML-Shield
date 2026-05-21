const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/aml_db";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const transactions = await db.collection("transactions").find().limit(5).toArray();
    console.log("Sample transactions from DB:", JSON.stringify(transactions, null, 2));
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error:", err);
  });
