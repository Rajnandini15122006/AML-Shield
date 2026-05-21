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


// CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  "http://localhost:3000"
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list or vercel subdomains
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") || 
                      /^https:\/\/.*\.vercel\.app$/.test(origin);
                      
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.warn(`Origin ${origin} blocked by CORS`);
      return callback(new Error("Not allowed by CORS"));
    }
  },
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