import networkx as nx
from networkx.algorithms import community
import numpy as np

def detect_communities(G):
    """
    Partition the network graph G into communities using modularity optimization.
    
    Parameters:
    - G (nx.Graph): The transaction network graph.
    
    Returns:
    - list of sets: Each set contains transaction node IDs belonging to a community.
    """
    if G.number_of_nodes() == 0:
        return []
    
    # greedy_modularity_communities returns a list of FrozenSets of node IDs.
    communities_generator = community.greedy_modularity_communities(G)
    return [set(comm) for comm in communities_generator]

def compute_cluster_risks(G, communities, base_risks):
    """
    Calculate community-level risk profiles and map them back to individual nodes.
    For each community, the cluster risk is the average base risk of the nodes inside it.
    
    Parameters:
    - G (nx.Graph): The transaction graph.
    - communities (list of sets): Communities identified in the graph.
    - base_risks (dict or np.ndarray): Mapping from node ID/index to base fraud risk (e.g. GNN score).
                                      If list/array, index corresponds to node IDs.
                                      If dict, maps node IDs to scores.
                                      
    Returns:
    - cluster_risks (dict): A dictionary mapping node IDs to their community cluster risk score in range [0, 1].
    """
    cluster_risks = {}
    
    # Populate default cluster risk (0.0) for all nodes
    for node in G.nodes():
        cluster_risks[node] = 0.0
        
    for comm in communities:
        if not comm:
            continue
            
        comm_nodes = list(comm)
        
        # Extract base risk scores for all nodes in the community
        comm_scores = []
        for node in comm_nodes:
            if isinstance(base_risks, dict):
                score = base_risks.get(node, 0.0)
            elif isinstance(base_risks, (list, np.ndarray)):
                # If indices are node names or node indices
                try:
                    score = base_risks[node]
                except (IndexError, KeyError, TypeError):
                    score = 0.0
            else:
                score = 0.0
            comm_scores.append(score)
            
        # Compute the average risk for the community
        avg_risk = float(np.mean(comm_scores)) if comm_scores else 0.0
        
        # Assign this community average risk to all members of the community
        for node in comm_nodes:
            cluster_risks[node] = avg_risk
            
    return cluster_risks
