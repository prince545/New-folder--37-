import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopNav from "./components/app/TopNav.jsx";
import Home from "./pages/Home.jsx";
import Workspace from "./pages/Workspace.jsx";
import LearningHub from "./pages/LearningHub.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <TopNav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hub" element={<LearningHub />} />
            <Route path="/workspace" element={<Workspace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
