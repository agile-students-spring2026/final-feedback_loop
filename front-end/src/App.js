import logo from './logo.svg';
import CreateProjectForm from './pages/CreateProjectForm';
import EditProjectInfo from './pages/EditProjectInfoForm';
import CreateNewFeedback from './pages/CreateNewFeedback';
import PlayerExplore from './PlayerExplore';
import ProjectDetails from './ProjectDetails'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/createProjectForm" element={<CreateProjectForm />} />
        <Route path="/editProjectInfo" element={<EditProjectInfo />} />
        <Route path="/createNewFeedback" element={<CreateNewFeedback />} />
        <Route path="/playerExplore" element={<PlayerExplore />} />
        <Route path="/projectDetails" element={<ProjectDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
