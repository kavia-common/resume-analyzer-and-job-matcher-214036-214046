const ENV = {
  // PUBLIC_INTERFACE
  /**
   * Returns the API base URL read from create-react-app environment variable.
   * Use REACT_APP_BACKEND_URL to configure; defaults to proxying same origin.
   */
  getApiBaseUrl() {
    return process.env.REACT_APP_BACKEND_URL || '';
  },
};

export default ENV;
