import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "./portfolio/Portfolio"; // Your existing site
import Login from "./dashboard/Login";
import Dashboard from "./dashboard/Dashboard";
import Projects from "./dashboard/Projects";
import ProtectedRoute from "./dashboard/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes for Skills, Awards, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
