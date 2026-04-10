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
import PlayerPlaytest from "./PlayerPlaytest";
import ProjectDetails from "./ProjectDetails";
import PlayerExplore from "./PlayerExplore";
import FollowingPage from "./FollowingPage";
import NotificationCenter from "./NotificationCenter";
import GameFeedback from "./GameFeedback";
import FeedbackForm from "./FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/devdash" element={<DeveloperDashboard />} />
        <Route path="/devproject/:id" element={<ProjectInfo />} />
        <Route path="/devlog/:id" element={<DevLog />} />
        <Route path="/explore" element={<PlayerExplore />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/game-feedback" element={<GameFeedback />} />
        <Route path="/feedback-form" element={<FeedbackForm />} />
        <Route path="/createProjectForm" element={<CreateProjectForm />} />
        <Route path="/editProjectInfo/:id" element={<EditProjectInfo />} />
        <Route path="/createNewFeedback/:id" element={<CreateNewFeedback />} />
        <Route path="/playtest/:id" element={<ProjectDetails />} />
        <Route path="/my-playtests" element={<PlayerPlaytest />} />


        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
