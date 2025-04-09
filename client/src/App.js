import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage"; // ✅ New homepage component
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import MyGroups from "./pages/MyGroups";
import StudyGroupsPage from "./components/StudyGroupsPage";
import GroupDetails from "./pages/GroupDetails";
import GroupsList from "./pages/GroupsList"; // ✅ New: Import GroupsList component
import ProfilePage from "./pages/ProfilePage"; // ✅ New: Import ProfilePage component
import CreateGroup from "./pages/CreateGroup"; // ✅ New: Import CreateGroup component

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import GroupManagement from "./pages/GroupManagement"; // ✅ New: Import GroupManagement component

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: "1rem" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} /> {/* Updated route to HomePage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<DashboardPage />} />}
          />
          <Route
            path="/my-groups"
            element={<ProtectedRoute element={<MyGroups />} />}
          />
          <Route
            path="/study-groups"
            element={<ProtectedRoute element={<StudyGroupsPage />} />}
          />
          <Route
            path="/groups"
            element={<ProtectedRoute element={<GroupsList />} />} // ✅ Added Groups List route
          />
          <Route
            path="/group/:groupId"
            element={<ProtectedRoute element={<GroupDetails />} />}
          />
          {/* Group Management Route */}
          <Route
            path="/group/:groupId/manage"
            element={<ProtectedRoute element={<GroupManagement />} />}
          />
          {/* Profile Page Route */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />} // ✅ Added Profile Page route
          />
          {/* Create Group Route */}
          <Route
            path="/create-group"
            element={<ProtectedRoute element={<CreateGroup />} />} // ✅ Added Create Group route
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
