export const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (codespaceName && codespaceName.trim() !== '') {
    return `https://${codespaceName.trim()}-8000.app.github.dev/api`;
  }

  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
};

export const buildApiUrl = (segment = '') => {
  const normalizedSegment = segment.startsWith('/') ? segment : `/${segment}`;
  return `${getApiBaseUrl().replace(/\/$/, '')}${normalizedSegment}`;
};

export const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.records)) return payload.records;

  return Object.values(payload).filter((value) => Array.isArray(value));
};
