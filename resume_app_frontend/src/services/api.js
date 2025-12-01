import ENV from '../config/env';

const base = () => ENV.getApiBaseUrl();

async function http(method, path, { headers = {}, body, isForm = false } = {}) {
  const url = `${base()}${path}`;
  const res = await fetch(url, {
    method,
    headers: isForm ? headers : { 'Content-Type': 'application/json', ...headers },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

/**
 * PUBLIC_INTERFACE
 * API client for Resume Analyzer backend.
 */
export const api = {
  // PUBLIC_INTERFACE
  async uploadResume(file, role) {
    const form = new FormData();
    form.append('file', file);
    if (role) form.append('role', role);
    return http('POST', '/upload', { body: form, isForm: true });
  },

  // PUBLIC_INTERFACE
  async submitProfileURL(url, role) {
    return http('POST', '/submit-url', { body: { url, role } });
  },

  // PUBLIC_INTERFACE
  async getStatus(taskId) {
    return http('GET', `/status/${encodeURIComponent(taskId)}`);
  },

  // PUBLIC_INTERFACE
  async getResults(taskId) {
    return http('GET', `/results/${encodeURIComponent(taskId)}`);
  },

  // PUBLIC_INTERFACE
  async getSuggestions(taskId) {
    return http('GET', `/suggestions/${encodeURIComponent(taskId)}`);
  },

  // PUBLIC_INTERFACE
  async getJobRecommendations(taskId) {
    return http('GET', `/jobs/${encodeURIComponent(taskId)}`);
  },

  // PUBLIC_INTERFACE
  async getHistory() {
    return http('GET', '/history');
  },
};
