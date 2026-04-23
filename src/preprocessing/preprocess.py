import pandas as pd

def load_data(features_path, classes_path, edges_path):

    features = pd.read_csv(features_path, header=None)
    classes = pd.read_csv(classes_path)
    edges = pd.read_csv(edges_path)

    return features, classes, edges


def merge_features_classes(features, classes):

    features.columns = ["txId"] + [f"feature_{i}" for i in range(1, features.shape[1])]
    
    data = features.merge(classes, on="txId")

    return data