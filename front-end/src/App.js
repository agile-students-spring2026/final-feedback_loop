import logo from './logo.svg';
import './App.css';
import CreateProjectForm from './pages/CreateProjectForm';
import EditProjectInfo from './pages/EditProjectInfoForm';
import CreateNewFeedback from './pages/CreateNewFeedback';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/createProjectForm" element={<CreateProjectForm />} />
        <Route path="/editProjectInfo" element={<EditProjectInfo />} />
        <Route path="/createNewFeedback" element={<CreateNewFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
