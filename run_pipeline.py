import os
import sys
import json
import pandas as pd
import numpy as np
import torch
import networkx as nx
from torch_geometric.data import Data

# Ensure project root is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.models.gat_model import GAT
from src.anamoly.anomaly_detection import detect_anomalies
from src.patterns.community_detection import detect_communities, compute_cluster_risks
from src.risk.risk_scoring import RiskScoringEngine

def load_transaction_data(file_path):
    """
    Loads transaction sheet from Excel or CSV.
    """
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file_path.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format. Use CSV or Excel.")
    
    # Ensure necessary columns exist
    required_cols = ['transactionId', 'amount', 'sender', 'receiver']
    for col in required_cols:
        if col not in df.columns:
            # If columns are named slightly differently (e.g. transactionID)
            # Find a case-insensitive match
            matches = [c for c in df.columns if c.lower() == col.lower()]
            if matches:
                df.rename(columns={matches[0]: col}, inplace=True)
            else:
                raise ValueError(f"Missing required column: {col}")
                
    return df

def build_flow_graph_and_features(df):
    """
    Builds a transaction-centric network flow graph and extracts aligned GNN features.
    - Nodes are transaction IDs.
    - Directed edges flow from TX_A -> TX_B if receiver(TX_A) == sender(TX_B).
    - Features of size 166 are built per transaction (amount and network topology).
    """
    # 1. Map transactionId to index
    tx_ids = df['transactionId'].astype(str).tolist()
    tx_to_idx = {tx_id: idx for idx, tx_id in enumerate(tx_ids)}
    num_nodes = len(tx_ids)
    
    # 2. Build edges based on wallet matching: receiver -> sender
    # Group transactions by sender and receiver wallets
    sender_groups = df.groupby('sender')['transactionId'].apply(list).to_dict()
    
    edges = []
    for idx, row in df.iterrows():
        tx_id = str(row['transactionId'])
        receiver = row['receiver']
        
        # If this transaction's receiver wallet is the sender wallet in subsequent transactions,
        # we draw a directed flow edge between them.
        if receiver in sender_groups:
            for next_tx in sender_groups[receiver]:
                if next_tx != tx_id:  # Avoid self-loops
                    edges.append((tx_to_idx[tx_id], tx_to_idx[str(next_tx)]))
                    
    # 3. Create PyTorch Geometric edge_index
    if edges:
        edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
    else:
        edge_index = torch.empty((2, 0), dtype=torch.long)
        
    # 4. Create NetworkX graph representation for community detection
    G = nx.Graph()
    G.add_nodes_from(range(num_nodes))
    if edges:
        # Convert directed edges to undirected list for modularity communities
        G.add_edges_from([(u, v) for u, v in edges])
        
    # 5. Extract 166-dimensional features
    # Normalize transaction amounts
    amounts = df['amount'].astype(float).values
    max_amount = amounts.max() if len(amounts) > 0 and amounts.max() > 0 else 1.0
    norm_amounts = amounts / max_amount
    
    # Calculate degree features in NetworkX
    in_degrees = np.zeros(num_nodes)
    out_degrees = np.zeros(num_nodes)
    if edges:
        for u, v in edges:
            out_degrees[u] += 1
            in_degrees[v] += 1
            
    # Assemble feature matrix of size [num_nodes, 166]
    X = np.zeros((num_nodes, 166), dtype=np.float32)
    X[:, 0] = norm_amounts
    X[:, 1] = in_degrees
    X[:, 2] = out_degrees
    
    # Use sum of transaction volume as additional features
    for idx in range(num_nodes):
        tx_id = tx_ids[idx]
        row = df.iloc[idx]
        # Local transaction parameters
        # Features 3 and 4 are mock features based on local degree statistics to provide extra signal
        X[idx, 3] = float(row['amount']) / 10000.0
        X[idx, 4] = (in_degrees[idx] + out_degrees[idx]) / 5.0
        
    X_tensor = torch.tensor(X, dtype=torch.float)
    
    return G, edge_index, X_tensor, tx_to_idx

def run_ml_pipeline(file_path):
    print(f"Loading data from: {file_path}")
    df = load_transaction_data(file_path)
    num_txs = len(df)
    print(f"Ingested {num_txs} transactions.")
    
    if num_txs == 0:
        return []
        
    # 1. Graph Building and Feature Extraction
    G, edge_index, X_tensor, tx_to_idx = build_flow_graph_and_features(df)
    
    # 2. GNN Model Loading & Inference
    device = torch.device('cpu')
    model = GAT(num_features=166, hidden_channels=32)
    
    # Find weights file path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "models", "gat_model.pth")
    
    if os.path.exists(model_path):
        try:
            model.load_state_dict(torch.load(model_path, map_location=device))
            print("Loaded GAT model weights from gat_model.pth.")
        except Exception as e:
            print(f"Error loading model weights: {e}. Running with initialized weights.")
    else:
        print(f"Model checkpoint not found at {model_path}. Running with initialized weights.")
        
    model.eval()
    with torch.no_grad():
        # GAT forward pass
        logits = model(X_tensor, edge_index)
        # Compute GNN probabilities using softmax
        probs = torch.softmax(logits, dim=1)
        gnn_scores = probs[:, 1].numpy()  # Class 1 is illicit/high-risk
        embeddings = logits.numpy()       # Use logit space as embeddings for Isolation Forest
        
    # 3. Anomaly Detection (Isolation Forest)
    anomaly_scores = detect_anomalies(embeddings, contamination=0.05)
    
    # 4. Community Detection & Cluster Risk
    communities = detect_communities(G)
    gnn_scores_dict = {i: float(gnn_scores[i]) for i in range(num_txs)}
    cluster_risks_dict = compute_cluster_risks(G, communities, gnn_scores_dict)
    cluster_risks = np.array([cluster_risks_dict[i] for i in range(num_txs)])
    
    # 5. Combined Risk Scoring
    # Blend: 50% GNN score, 30% Isolation Forest anomaly, 20% Community cluster risk
    scoring_engine = RiskScoringEngine(w1=0.5, w2=0.3, w3=0.2)
    
    results = []
    for idx, row in df.iterrows():
        tx_id = str(row['transactionId'])
        node_idx = tx_to_idx[tx_id]
        
        g_score = float(gnn_scores[node_idx])
        a_score = float(anomaly_scores[node_idx])
        c_risk = float(cluster_risks[node_idx])
        
        combined_score = scoring_engine.compute_risk_score(g_score, a_score, c_risk)
        risk_category = scoring_engine.classify_risk(combined_score)
        
        # If combined risk is High Risk, status is Flagged, else keep original status or Safe
        status = "Flagged" if risk_category == "High Risk" else "Safe"
        
        results.append({
            "transactionId": tx_id,
            "amount": float(row['amount']),
            "sender": str(row['sender']),
            "receiver": str(row['receiver']),
            "score": float(np.round(combined_score, 4)),
            "risk": risk_category,
            "anomalyScore": float(np.round(a_score, 4)),
            "gnnScore": float(np.round(g_score, 4)),
            "clusterRisk": float(np.round(c_risk, 4)),
            "status": status
        })
        
    # Write results to output JSON file
    output_path = f"{file_path}_results.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
        
    print(f"__RESULTS_PATH__:{output_path}")
    return results

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <path_to_excel_or_csv>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        sys.exit(1)
        
    try:
        run_ml_pipeline(file_path)
    except Exception as e:
        print(f"Pipeline failed: {e}")
        sys.exit(1)
