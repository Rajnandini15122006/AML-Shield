const Rule = require("../models/Rule");
const Transaction = require("../models/Transaction");

// GET ALL RULES (with auto preseeding if empty)
const getRules = async (req, res) => {
  try {
    let rules = await Rule.find({ userId: req.userId });
    
    // Seed default rules if none exist
    if (rules.length === 0) {
      const defaults = [
        {
          name: "High GNN Threat Immediate Block",
          description: "Automatically block if GNN node risk matches highly anomalous ransomware patterns.",
          priority: "High",
          status: true,
          conditions: [
            { field: "gnnScore", operator: ">", value: "0.85" }
          ],
          action: "Immediate Block",
          userId: req.userId
        },
        {
          name: "Louvain Mixer Clustering Flag",
          description: "Flag transactions associated with modular communities matching privacy mixer behavior.",
          priority: "Medium",
          status: true,
          conditions: [
            { field: "clusterRisk", operator: ">", value: "0.75" }
          ],
          action: "Manual Audit",
          userId: req.userId
        },
        {
          name: "Extreme Isolation Outlier Alert",
          description: "Identify extreme volume anomalies with significant Isolation Forest outlier score.",
          priority: "High",
          status: true,
          conditions: [
            { field: "anomalyScore", operator: ">", value: "0.80" },
            { field: "amount", operator: ">", value: "5.0" }
          ],
          action: "Manual Audit",
          userId: req.userId
        },
        {
          name: "High Velocity Standard Review",
          description: "Traditional volume threshold flag for large asset transfers.",
          priority: "Low",
          status: true,
          conditions: [
            { field: "amount", operator: ">", value: "10.0" }
          ],
          action: "Flag for Review",
          userId: req.userId
        }
      ];
      
      await Rule.insertMany(defaults);
      rules = await Rule.find({ userId: req.userId });
    }
    
    res.json(rules);
  } catch (error) {
    console.error("Error in getRules:", error);
    res.status(500).json({ message: "Failed to retrieve rules", error: error.message });
  }
};

// CREATE NEW RULE
const createRule = async (req, res) => {
  try {
    const { name, description, priority, conditions, action } = req.body;
    
    if (!name || !conditions || !conditions.length) {
      return res.status(400).json({ message: "Rule name and conditions are required." });
    }
    
    const rule = new Rule({
      name,
      description,
      priority,
      conditions,
      action,
      userId: req.userId
    });
    
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    console.error("Error in createRule:", error);
    res.status(500).json({ message: "Failed to create rule", error: error.message });
  }
};

// UPDATE RULE (status, priority, conditions, description, etc.)
const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rule = await Rule.findOne({ _id: id, userId: req.userId });
    if (!rule) {
      return res.status(404).json({ message: "Rule not found or unauthorized." });
    }
    
    const fieldsToUpdate = [
      "name",
      "description",
      "priority",
      "status",
      "conditions",
      "action"
    ];
    
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        rule[field] = req.body[field];
      }
    });
    
    await rule.save();
    res.json(rule);
  } catch (error) {
    console.error("Error in updateRule:", error);
    res.status(500).json({ message: "Failed to update rule", error: error.message });
  }
};

// DELETE RULE
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rule = await Rule.findOneAndDelete({ _id: id, userId: req.userId });
    if (!rule) {
      return res.status(404).json({ message: "Rule not found or unauthorized to delete." });
    }
    
    res.json({ success: true, message: "Rule deleted successfully." });
  } catch (error) {
    console.error("Error in deleteRule:", error);
    res.status(500).json({ message: "Failed to delete rule", error: error.message });
  }
};

// EVALUATE SANDBOX ENGINE
const evaluateRules = async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.userId });
    const activeRules = await Rule.find({ userId: req.userId, status: true });
    
    if (!txs.length) {
      return res.json({
        totalEvaluated: 0,
        totalViolations: 0,
        totalFlaggedVolume: 0,
        violations: [],
        stats: []
      });
    }
    
    const violations = [];
    const ruleTriggerCounts = {};
    activeRules.forEach(r => {
      ruleTriggerCounts[r._id.toString()] = 0;
    });
    
    let totalFlaggedVolume = 0;
    const flaggedTxnIds = new Set();
    
    txs.forEach(tx => {
      const matchedRulesForTx = [];
      let finalAction = null;
      let highestPriorityRank = -1; // 0=Low, 1=Medium, 2=High
      
      const priorityWeights = { "Low": 0, "Medium": 1, "High": 2 };
      
      activeRules.forEach(rule => {
        let isTriggered = true;
        
        rule.conditions.forEach(cond => {
          let txVal;
          if (cond.field === "amount") {
            txVal = parseFloat(tx.amount) || 0;
          } else if (cond.field === "anomalyScore") {
            txVal = tx.anomalyScore || 0;
          } else if (cond.field === "gnnScore") {
            txVal = tx.gnnScore || 0;
          } else if (cond.field === "clusterRisk") {
            txVal = tx.clusterRisk || 0;
          } else {
            isTriggered = false;
            return;
          }
          
          const condVal = parseFloat(cond.value) || 0;
          
          switch (cond.operator) {
            case ">":
              if (!(txVal > condVal)) isTriggered = false;
              break;
            case "<":
              if (!(txVal < condVal)) isTriggered = false;
              break;
            case ">=":
              if (!(txVal >= condVal)) isTriggered = false;
              break;
            case "<=":
              if (!(txVal <= condVal)) isTriggered = false;
              break;
            case "==":
              if (!(txVal === condVal)) isTriggered = false;
              break;
            default:
              isTriggered = false;
          }
        });
        
        if (isTriggered && rule.conditions.length > 0) {
          matchedRulesForTx.push(rule.name);
          ruleTriggerCounts[rule._id.toString()]++;
          
          // Resolve highest threat actions
          const ruleRank = priorityWeights[rule.priority] || 0;
          if (ruleRank > highestPriorityRank) {
            highestPriorityRank = ruleRank;
            finalAction = rule.action;
          }
        }
      });
      
      if (matchedRulesForTx.length > 0) {
        violations.push({
          transactionId: tx.transactionId,
          sender: tx.sender,
          receiver: tx.receiver,
          amount: tx.amount,
          risk: tx.risk,
          scores: {
            amount: parseFloat(tx.amount) || 0,
            gnnScore: tx.gnnScore || 0,
            anomalyScore: tx.anomalyScore || 0,
            clusterRisk: tx.clusterRisk || 0
          },
          triggeredRules: matchedRulesForTx,
          action: finalAction || "Manual Audit"
        });
        
        if (!flaggedTxnIds.has(tx.transactionId)) {
          flaggedTxnIds.add(tx.transactionId);
          totalFlaggedVolume += parseFloat(tx.amount) || 0;
        }
      }
    });
    
    // Compile rule trigger stats
    const stats = activeRules.map(rule => ({
      ruleId: rule._id,
      name: rule.name,
      priority: rule.priority,
      action: rule.action,
      triggerCount: ruleTriggerCounts[rule._id.toString()] || 0
    }));
    
    res.json({
      totalEvaluated: txs.length,
      totalViolations: violations.length,
      totalFlaggedVolume: parseFloat(totalFlaggedVolume.toFixed(4)),
      violations,
      stats
    });
  } catch (error) {
    console.error("Error in evaluateRules:", error);
    res.status(500).json({ message: "Failed to evaluate rules sandbox", error: error.message });
  }
};

module.exports = {
  getRules,
  createRule,
  updateRule,
  deleteRule,
  evaluateRules
};
