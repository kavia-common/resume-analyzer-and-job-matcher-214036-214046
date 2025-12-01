import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import UploadResume from '../pages/UploadResume';
import SubmitProfileURL from '../pages/SubmitProfileURL';
import AnalysisStatus from '../pages/AnalysisStatus';
import Results from '../pages/Results';
import Suggestions from '../pages/Suggestions';
import JobRecommendations from '../pages/JobRecommendations';
import History from '../pages/History';

/**
 * PUBLIC_INTERFACE
 * Router: Declares SPA routes for the Resume Analyzer app.
 */
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/submit-url" element={<SubmitProfileURL />} />
        <Route path="/status/:taskId" element={<AnalysisStatus />} />
        <Route path="/results/:taskId" element={<Results />} />
        <Route path="/suggestions/:taskId" element={<Suggestions />} />
        <Route path="/jobs/:taskId" element={<JobRecommendations />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
