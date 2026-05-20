// import { Routes, Route } from "react-router-dom";

// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Upload from "./pages/Upload";
// import Alerts from "./pages/Alerts";
// import Explorer from "./pages/Explorer";
// import Network from "./pages/Network";
// import Insights from "./pages/Insights";
// import History from "./pages/History";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/upload" element={<Upload />} />
//       <Route path="/alerts" element={<Alerts />} />
//       <Route path="/explorer" element={<Explorer />} />
//       <Route path="/network" element={<Network />} />
//       <Route path="/insights" element={<Insights />} />
//       <Route path="/history" element={<History />} />
//     </Routes>
//   );
// }

// export default App;

// import { Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

// export default function App() {

//   return (
 

//       <Routes>

//         <Route path="/" element={<Landing />} />

//         <Route path="/login" element={<Login />} />

//         <Route path="/register" element={<Register />} />

//         <Route path="/dashboard" element={<Dashboard />} />

//       </Routes>

  
//   );
// }





// import {
//   BrowserRouter,
//   Routes,
//   Route
// } from "react-router-dom";

// import Landing from "./pages/Landing";
// import NetworkGraph from "./pages/NetworkGraph";
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";

// export default function App() {

//   return (

//     <BrowserRouter>

//       <Routes>

//         <Route
//           path="/"
//           element={<Landing />}
//         />
    
//         <Route
//           path="/dashboard"
//           element={<Dashboard />}
//         />

//         <Route
//           path="/transactions"
//           element={<Transactions />}
//         />

//       </Routes>

//     </BrowserRouter>

//   );
// }

// import NetworkGraph from "./pages/NetworkGraph";

// function App() {
//   return <NetworkGraph />;
// }

// export default App;


// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate
// } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import NetworkGraph from "./pages/NetworkGraph";
// import ExplainableAI from "./pages/ExplainableAI";
// import Analytics from "./pages/Analytics";
// import Reports from "./pages/Reports";
// import SuspiciousChains from "./pages/SuspiciousChains";

// function App() {

//   return (

//     <BrowserRouter>

//       <Routes>

//         <Route
//           path="/"
//           element={
//             <Navigate to="/dashboard" />
//           }
//         />

//         <Route
//           path="/dashboard"
//           element={<Dashboard />}
//         />

//         <Route
//           path="/transactions"
//           element={<Transactions />}
//         />

//         <Route
//           path="/network-graph"
//           element={<NetworkGraph />}
//         />

//         <Route
//           path="/explainable-ai"
//           element={<ExplainableAI />}
//         />

//         <Route
//           path="/analytics"
//           element={<Analytics />}
//         />

//         <Route
//           path="/reports"
//           element={<Reports />}
//         />

//         <Route
//   path="/chains"
//   element={<SuspiciousChains />}
// />

//       </Routes>

//     </BrowserRouter>

//   );
// }

// export default App;







import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LandingPage from "./pages/Landing";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import Transactions from "./pages/Transactions";

import NetworkGraph from "./pages/NetworkGraph";

import ExplainableAI from "./pages/ExplainableAI";

import Analytics from "./pages/Analytics";

import Reports from "./pages/Reports";

import SuspiciousChains from "./pages/SuspiciousChains";
import Login from "./pages/Login";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LANDING */}

        <Route
          path="/"
          element={
            <Navigate to="/landing" />
          }
        />

        <Route
          path="/landing"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/transactions"
          element={<Transactions />}
        />

        <Route
          path="/network-graph"
          element={<NetworkGraph />}
        />

        <Route
          path="/explainable-ai"
          element={<ExplainableAI />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/chains"
          element={<SuspiciousChains />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;