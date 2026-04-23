# import torch
# import torch.nn.functional as F
# from torch_geometric.nn import GCNConv


# class GCN(torch.nn.Module):

#     def __init__(self, num_features, hidden_channels):

#         super(GCN, self).__init__()

#         self.conv1 = GCNConv(num_features, hidden_channels)
#         self.conv2 = GCNConv(hidden_channels, 2)

#     def forward(self, x, edge_index):

#         # First graph convolution
#         x = self.conv1(x, edge_index)

#         # Activation
#         x = F.relu(x)

#         # Second graph convolution
#         x = self.conv2(x, edge_index)

#         return x

import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv


class GCN(torch.nn.Module):

    def __init__(self, num_features, hidden_channels, num_classes=2):
        super(GCN, self).__init__()

        self.conv1 = GCNConv(num_features, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, num_classes)

    def forward(self, x, edge_index):

        x = self.conv1(x, edge_index)
        x = F.relu(x)

        x = self.conv2(x, edge_index)

        return x


# -------------------------
# Training Function
# -------------------------

def train_gcn(model, graph_data, train_mask, epochs=50):

    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    for epoch in range(epochs):

        model.train()
        optimizer.zero_grad()

        out = model(graph_data.x, graph_data.edge_index)

        loss = F.cross_entropy(out[train_mask], graph_data.y[train_mask])

        loss.backward()
        optimizer.step()

        if epoch % 10 == 0:
            print(f"Epoch {epoch}, Loss: {loss.item()}")

    return model


# -------------------------
# Prediction Function
# -------------------------

def predict_gcn(model, graph_data):

    model.eval()

    with torch.no_grad():
        out = model(graph_data.x, graph_data.edge_index)

    pred = out.argmax(dim=1)

    return pred, out