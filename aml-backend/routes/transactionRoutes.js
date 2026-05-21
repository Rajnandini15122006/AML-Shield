// const express = require("express");
// const router = express.Router();

// const Transaction = require("../models/Transaction");

// // Add Transaction
// router.post("/add", async (req, res) => {
//     try {
//         const transaction = new Transaction(req.body);
//         await transaction.save();

//         res.status(201).json({
//             success: true,
//             message: "Transaction Added",
//             transaction
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Get All Transactions
// router.get("/", async (req, res) => {
//     try {
//         const transactions = await Transaction.find();

//         res.status(200).json(transactions);
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// module.exports = router;




const express =
  require("express");

const {
  getTransactions
} = require(
  "../controllers/transactionController"
);
const protect = require("../middleware/auth");

const router =
  express.Router();


// GET TRANSACTIONS

router.get(
  "/",
  protect,
  getTransactions
);

module.exports =
  router;