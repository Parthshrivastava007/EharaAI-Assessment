const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = {
    'Content-Type': 'application/json',
  };
  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data } }; // Mocking axios error structure for compatibility
  }
  return { data }; // Mocking axios response structure
};

const api = {
  get: async (url) => {
    const response = await fetch(`${BASE_URL}/${url.replace(/^\//, '')}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  post: async (url, body) => {
    const response = await fetch(`${BASE_URL}/${url.replace(/^\//, '')}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (url, body) => {
    const response = await fetch(`${BASE_URL}/${url.replace(/^\//, '')}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (url) => {
    const response = await fetch(`${BASE_URL}/${url.replace(/^\//, '')}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
