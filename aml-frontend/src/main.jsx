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

import App from "./App";

import "./index.css";

import DataProvider
from "./context/DataContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <DataProvider>

      <App />

    </DataProvider>

  </React.StrictMode>

);