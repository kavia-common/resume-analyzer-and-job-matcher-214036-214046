import ENV from '../config/env';

const base = () => ENV.getApiBaseUrl();

// A mock user ID until authentication is implemented.
const MOCK_USER_ID = 1;

async function http(method, path, { headers = {}, body, isForm = false, params } = {}) {
  const usp = new URLSearchParams(params);
  const queryString = usp.toString();
  const url = `${base()}${path}${queryString ? `?${queryString}`: ''}`;

  const config = {
    method,
    headers: isForm ? headers : { 'Content-Type': 'application/json', ...headers },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: `HTTP error ${res.status}` }));
      throw new Error(errorBody.detail?.[0]?.msg || errorBody.message || `HTTP ${res.status}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    // For 204 No Content
    if (res.status === 204) return;
    return res.text();
  } catch (error) {
    console.error(`API call failed: ${method} ${path}`, error);
    throw error;
  }
}

/**
 * PUBLIC_INTERFACE
 * API client for Resume Analyzer backend.
 */
export const api = {
  // PUBLIC_INTERFACE
  async uploadResume(file, targetRole, location) {
    const form = new FormData();
    form.append('file', file);
    form.append('user_id', MOCK_USER_ID);
    if (targetRole) form.append('targetRole', targetRole);
    if (location) form.append('location', location);
    return http('POST', '/api/v1/resumes/upload', { body: form, isForm: true });
  },

  // PUBLIC_INTERFACE
  async submitProfileURL(url, targetRole) {
    return http('POST', '/api/v1/profiles/submit-url', {
      body: { url, user_id: MOCK_USER_ID, targetRole },
    });
  },

  // PUBLIC_INTERFACE
  async getAnalysisStatus(analysisId) {
    return http('GET', `/api/v1/analysis/${encodeURIComponent(analysisId)}/status`);
  },

  // PUBLIC_INTERFACE
  async getAnalysisResults(analysisId) {
    return http('GET', `/api/v1/analysis/${encodeURIComponent(analysisId)}/results`);
  },
  
  // PUBLIC_INTERFACE
  async acknowledgeSuggestions(analysisId, suggestionIds) {
    return http('POST', `/api/v1/analysis/${encodeURIComponent(analysisId)}/suggestions/ack`, { 
      body: { ids: suggestionIds }
    });
  },

  // PUBLIC_INTERFACE
  async cancelAnalysis(analysisId) {
    return http('POST', `/api/v1/analysis/${encodeURIComponent(analysisId)}/cancel`);
  },

  // PUBLIC_INTERFACE
  async getJobRecommendations(analysisId, page = 1) {
    const limit = 20;
    const offset = (page - 1) * limit;
    return http('GET', '/api/v1/recommendations', { params: { analysisId, limit, offset } });
  },
  
  // PUBLIC_INTERFACE
  async updateRecommendationStatus(recommendationId, status) {
     return http('PATCH', `/api/v1/recommendations/${encodeURIComponent(recommendationId)}`, {
      params: { status },
    });
  },

  // PUBLIC_INTERFACE
  async getUserAnalyses() {
    return http('GET', `/api/v1/users/${MOCK_USER_ID}/analyses`);
  },
};
