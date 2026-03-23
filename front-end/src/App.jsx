import { useState } from "react";
import "./App.css";
import SettingsPage from "./pages/Settings";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ReportForm from "./pages/reportForm";
import DeveloperDashboard from "./DeveloperDashboard";
import ProjectInfo from "./ProjectInfo";
import DevLog from "./DevLog";
import PlayerPlaytest from "./PlayerPlaytest";
import ProjectDetails from "./ProjectDetails";
import PlayerExplore from "./PlayerExplore";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/** <Route path="/" element={<Navigate to="/signin" />} /> */}
        <Route path="/" element={<Navigate to="/devdash" />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/devdash" element={<DeveloperDashboard />} />
        <Route path="/project" element={<ProjectInfo />} /> 
        <Route path="/devlog" element={<DevLog />} /> 
        <Route path="/playtest" element={<PlayerPlaytest />} />
        <Route path="/explore" element={<PlayerExplore />} />
        <Route path="/project/:id" element={<ProjectDetails />} />

        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
