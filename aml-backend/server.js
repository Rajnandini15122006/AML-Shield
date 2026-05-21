// const express = require("express");

// const cors = require("cors");

// require("dotenv").config();

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.get("/", (req, res) => {

//   res.json({
//     message:
//       "AML Backend Running Successfully"
//   });

// });

// const PORT =
//   process.env.PORT || 5000;

// app.listen(PORT, () => {

//   console.log(
//     `Server running on port ${PORT}`
//   );

// });


const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const uploadRoutes = require("./routes/uploadRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const ruleRoutes = require("./routes/ruleRoutes");

const app = express();


// CORS FIX

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));


// Middleware

app.use(express.json());


// Routes

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/rules", ruleRoutes);


// MongoDB Connection

mongoose.connect(process.env.MONGO_URI)

.then(() =>
  console.log(
    "MongoDB Connected"
  )
)

.catch((err) =>
  console.log(err)
);


// Test Route

app.get("/", (req, res) => {

  res.send(
    "AML Backend Running"
  );

});


// Server

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});