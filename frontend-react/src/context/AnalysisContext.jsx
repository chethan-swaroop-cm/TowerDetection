import React, { createContext, useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [error, setError] = useState(null);

  const requestStarted = useRef(false);

  const startAnalysis = async (file, url) => {
    // Reset state before starting
    requestStarted.current = true;
    setSelectedImage(file);
    setPreviewUrl(url);
    setAnalysisStarted(true);
    setAnalysisCompleted(false);
    setUploadProgress(0);
    setError(null);
    setAnalysisResponse(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });
      setAnalysisResponse(response.data);
      setAnalysisCompleted(true);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400 && err.response.data?.status === 'rejected') {
          setAnalysisResponse(err.response.data); // Let UI handle rejected quality
          setAnalysisCompleted(true);
        } else {
          setError(err.response.data?.message || 'Server returned an error');
        }
      } else if (err.request) {
        setError('Unable to complete AI analysis. Please check that the Flask backend and model are running.');
      } else {
        setError(err.message);
      }
      setAnalysisCompleted(true); // Complete even on error to let UI transition and show it
    }
  };

  const resetAnalysis = () => {
    requestStarted.current = false;
    setSelectedImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysisStarted(false);
    setAnalysisCompleted(false);
    setUploadProgress(0);
    setAnalysisResponse(null);
    setError(null);
  };

  return (
    <AnalysisContext.Provider value={{
      selectedImage,
      previewUrl,
      analysisStarted,
      analysisCompleted,
      uploadProgress,
      analysisResponse,
      error,
      startAnalysis,
      resetAnalysis
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};
