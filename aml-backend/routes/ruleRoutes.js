const express = require("express");
const { getRules, createRule, updateRule, deleteRule, evaluateRules } = require("../controllers/ruleController");
const protect = require("../middleware/auth");

const router = express.Router();

// GET USER RULES
router.get("/", protect, getRules);

// CREATE A NEW RULE
router.post("/", protect, createRule);

// UPDATE RULE STATUS/DETAILS
router.put("/:id", protect, updateRule);

// DELETE RULE
router.delete("/:id", protect, deleteRule);

// EVALUATE SANDBOX
router.post("/evaluate", protect, evaluateRules);

module.exports = router;
