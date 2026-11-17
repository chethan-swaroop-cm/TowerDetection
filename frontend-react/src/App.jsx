import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import UploadProgressPage from './pages/UploadProgressPage';
import Execute from './pages/Execute';
import QualityCheckPage from './pages/QualityCheckPage';
import ObjectDetectionPage from './pages/ObjectDetectionPage';
import CompletePage from './pages/CompletePage';
import OutputPage from './pages/OutputPage';
import { AnalysisProvider } from './context/AnalysisContext';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload-progress" element={<UploadProgressPage />} />
            <Route path="/execute" element={<Execute />} />
            <Route path="/quality-check" element={<QualityCheckPage />} />
            <Route path="/object-detection" element={<ObjectDetectionPage />} />
            <Route path="/complete" element={<CompletePage />} />
            <Route path="/output" element={<OutputPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AnalysisProvider>
  );
}

export default App;
