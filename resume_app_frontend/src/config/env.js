const ENV = {
  // PUBLIC_INTERFACE
  /**
   * Returns the API base URL read from create-react-app environment variable.
   * Use REACT_APP_BACKEND_URL to configure; defaults to proxying same origin.
   */
  getApiBaseUrl() {
    // Correctly read the backend URL from the environment variable, with a fallback.
    return process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_BASE_URL || '';
  },
};

export default ENV;
