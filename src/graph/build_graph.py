import networkx as nx

def build_transaction_graph(edges):

    G = nx.from_pandas_edgelist(
        edges,
        source="txId1",
        target="txId2"
    )

    return G