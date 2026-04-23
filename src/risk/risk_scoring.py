# src/risk/risk_scoring.py

import numpy as np


class RiskScoringEngine:

    def __init__(self, w1=0.5, w2=0.3, w3=0.2):
        """
        Initialize weights for risk scoring.
        
        w1 → weight for GNN score
        w2 → weight for anomaly score
        w3 → weight for cluster risk
        
        Constraint: w1 + w2 + w3 = 1
        """
        if not np.isclose(w1 + w2 + w3, 1.0):
            raise ValueError("Weights must sum to 1")

        self.w1 = w1
        self.w2 = w2
        self.w3 = w3

    def compute_risk_score(self, gnn_score, anomaly_score, cluster_risk):
        """
        Compute final fraud risk score.
        """

        risk_score = (
            self.w1 * gnn_score +
            self.w2 * anomaly_score +
            self.w3 * cluster_risk
        )

        return risk_score

    def classify_risk(self, risk_score):
        """
        Convert risk score into risk category.
        """

        if risk_score < 0.3:
            return "Low Risk"

        elif risk_score < 0.7:
            return "Medium Risk"

        else:
            return "High Risk"