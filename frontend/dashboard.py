import streamlit as st

st.set_page_config(page_title="AML Fraud Detection", layout="wide")

st.title("💳 AI-Powered Fraud Detection System")

st.sidebar.title("Navigation")

page = st.sidebar.radio("Go to", [
    "Overview",
    "Fraud Alerts",
    "Transaction Explorer",
    "Network Graph",
    "Model Insights"
])

if page == "Overview":
    st.write("Overview Page")

elif page == "Fraud Alerts":
    st.write("Fraud Alerts Page")

elif page == "Transaction Explorer":
    st.write("Transaction Explorer Page")

elif page == "Network Graph":
    st.write("Network Graph Page")

elif page == "Model Insights":
    st.write("Model Insights Page")