import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalies(embeddings, contamination=0.05, random_state=42):
    """
    Fits an Isolation Forest model on GNN embeddings to find statistical outliers.
    
    Parameters:
    - embeddings (np.ndarray): Latent representation vectors of transaction nodes.
    - contamination (float): Expected proportion of outliers in the data.
    - random_state (int): Seed for deterministic results.
    
    Returns:
    - anomaly_scores (np.ndarray): Normalized anomaly scores in range [0, 1] (higher = more anomalous).
    """
    if embeddings is None or len(embeddings) == 0:
        return np.array([])
        
    iso_forest = IsolationForest(contamination=contamination, random_state=random_state)
    iso_forest.fit(embeddings)
    
    # decision_function returns raw anomaly scores.
    # Outliers get negative scores; inliers get positive scores.
    raw_scores = iso_forest.decision_function(embeddings)
    
    # Normalize scores to [0, 1] range.
    # Since low raw_scores mean anomalous, we invert them (1 - normalized_raw_scores)
    # so that 1.0 indicates maximum anomaly and 0.0 indicates standard behavior.
    min_score = raw_scores.min()
    max_score = raw_scores.max()
    
    if np.isclose(max_score, min_score):
        # All nodes have identical scores (e.g. graph with single node or identical features)
        anomaly_scores = np.zeros_like(raw_scores)
    else:
        # Scale to [0, 1] and invert
        normalized = (raw_scores - min_score) / (max_score - min_score)
        anomaly_scores = 1.0 - normalized
        
    return anomaly_scores
