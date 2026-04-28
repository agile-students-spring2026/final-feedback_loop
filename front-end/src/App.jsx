import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import SettingsPage from "./pages/Settings";
import ReportForm from "./pages/reportForm";
import CreateProjectForm from "./pages/CreateProjectForm";
import EditProjectInfo from "./pages/EditProjectInfoForm";
import CreateNewFeedback from "./pages/CreateNewFeedback";

import DeveloperDashboard from "./DeveloperDashboard";
import ProjectInfo from "./ProjectInfo";
import DevLog from "./DevLog";
import ProjectDetails from "./ProjectDetails";
import PlayerExplore from "./PlayerExplore";
import FollowingPage from "./FollowingPage";
import NotificationCenter from "./NotificationCenter";
import GameFeedback from "./GameFeedback";
import FeedbackForm from "./FeedbackForm";
import FeedbackResults from "./FeedbackResults";
import ProtectedRoute, { PublicOnlyRoute } from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/signin" element={<PublicOnlyRoute><SignIn /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportForm /></ProtectedRoute>} />
        <Route path="/devdash" element={<ProtectedRoute><DeveloperDashboard /></ProtectedRoute>} />
        <Route path="/devproject/:id" element={<ProtectedRoute><ProjectInfo /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><PlayerExplore /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/following" element={<ProtectedRoute><FollowingPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationCenter /></ProtectedRoute>} />
        <Route path="/game-feedback/:id" element={<ProtectedRoute><GameFeedback /></ProtectedRoute>} />
        <Route path="/feedback-form/:id" element={<ProtectedRoute><FeedbackForm /></ProtectedRoute>} />
        <Route path="/feedback-results/:id" element={<ProtectedRoute><FeedbackResults /></ProtectedRoute>} />
        <Route path="/createProjectForm" element={<ProtectedRoute><CreateProjectForm /></ProtectedRoute>} />
        <Route path="/editProjectInfo/:id" element={<ProtectedRoute><EditProjectInfo /></ProtectedRoute>} />
        <Route path="/createNewFeedback/:id" element={<ProtectedRoute><CreateNewFeedback /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
