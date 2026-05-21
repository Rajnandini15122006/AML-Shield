const mongoose =
  require("mongoose");

const transactionSchema =
  new mongoose.Schema({

    transactionId: {
      type: String
    },

    amount: {
      type: String
    },

    risk: {
      type: String
    },

    score: {
      type: String
    },

    status: {
      type: String
    },

    sender: {
      type: String,
      default: "Unknown"
    },

    receiver: {
      type: String,
      default: "Unknown"
    },

    anomalyScore: {
      type: Number,
      default: 0
    },

    gnnScore: {
      type: Number,
      default: 0
    },

    clusterRisk: {
      type: Number,
      default: 0
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    createdAt: {
      type: Date,
      default: Date.now
    }

  });

module.exports =
  mongoose.model(
    "Transaction",
    transactionSchema
  );