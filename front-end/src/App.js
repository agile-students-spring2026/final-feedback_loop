
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeveloperDashboard from "./DeveloperDashboard";
import ProjectInfo from "./ProjectInfo";
import DevLog from "./DevLog";

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DeveloperDashboard />} />
          <Route path="/project" element={<ProjectInfo />} /> 
          <Route path="/devlog" element={<DevLog />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
