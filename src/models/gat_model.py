import torch
import torch.nn.functional as F
from torch_geometric.nn import GATConv


class GAT(torch.nn.Module):

    def __init__(self, num_features, hidden_channels, heads=4, num_classes=2):
        super(GAT, self).__init__()

        # First GAT layer with multi-head attention
        self.gat1 = GATConv(num_features, hidden_channels, heads=heads)

        # Second layer (output layer)
        self.gat2 = GATConv(hidden_channels * heads, num_classes, heads=1)

    def forward(self, x, edge_index):

        x = self.gat1(x, edge_index)
        x = F.elu(x)

        x = self.gat2(x, edge_index)

        return x


# -------------------------
# Training Function
# -------------------------

def train_gat(model, graph_data, train_mask, epochs=50):

    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    for epoch in range(epochs):

        model.train()
        optimizer.zero_grad()

        out = model(graph_data.x, graph_data.edge_index)

        loss = F.cross_entropy(out[train_mask], graph_data.y[train_mask])

        loss.backward()
        optimizer.step()

        if epoch % 10 == 0:
            print(f"GAT Epoch {epoch}, Loss: {loss.item()}")

    return model


# -------------------------
# Prediction Function
# -------------------------

def predict_gat(model, graph_data):

    model.eval()

    with torch.no_grad():
        out = model(graph_data.x, graph_data.edge_index)

    pred = out.argmax(dim=1)

    return pred, out