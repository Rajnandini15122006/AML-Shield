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
import History from "./pages/History";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Playground from "./pages/Playground";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Landing section pages
import Solutions from "./pages/Solutions";
import LandingAnalyticsPage from "./pages/LandingAnalytics";
import SecurityPage from "./pages/SecurityPage";
import ContactPage from "./pages/ContactPage";

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
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/network-graph"
          element={
            <ProtectedRoute>
              <NetworkGraph />
            </ProtectedRoute>
          }
        />

        <Route
          path="/explainable-ai"
          element={
            <ProtectedRoute>
              <ExplainableAI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chains"
          element={
            <ProtectedRoute>
              <SuspiciousChains />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playground"
          element={
            <ProtectedRoute>
              <Playground />
            </ProtectedRoute>
          }
        />

        {/* LANDING NAVBAR PAGES */}
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/analytics-platform" element={<LandingAnalyticsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/contact" element={<ContactPage />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;