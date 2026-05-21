const mongoose = require("mongoose");

const conditionSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  },
  status: {
    type: Boolean,
    default: true
  },
  conditions: [conditionSchema],
  action: {
    type: String,
    enum: ["Immediate Block", "Manual Audit", "Flag for Review"],
    default: "Flag for Review"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Rule", ruleSchema);
