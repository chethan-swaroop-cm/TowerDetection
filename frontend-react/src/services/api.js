import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400 && error.response.data?.status === 'rejected') {
        return error.response.data; // Quality rejected case
      }
      throw new Error(error.response.data?.message || 'Server returned an error');
    } else if (error.request) {
      throw new Error('BACKEND UNAVAILABLE: The inspection service could not be reached. Ensure the server is running.');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};
