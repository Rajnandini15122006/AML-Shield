// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";

// import App from "./App";

// import "./index.css";

// ReactDOM.createRoot(
//   document.getElementById("root")
// ).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );






import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App";

import "./index.css";

import DataProvider
from "./context/DataContext";

// Set base URL for axios requests dynamically with production fallback
const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  return isLocal ? "" : "https://aml-shield-backend-jqc8.onrender.com";
};
axios.defaults.baseURL = getApiBase();

// Configure axios interceptor to attach JWT token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("aml_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <DataProvider>

      <App />

    </DataProvider>

  </React.StrictMode>

);