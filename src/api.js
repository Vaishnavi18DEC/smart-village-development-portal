const API_BASE_URL = 'http://localhost:5000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// 1. Auth APIs
export const loginApi = (email, password) =>
  fetchApi('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const registerApi = (userData) =>
  fetchApi('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

// 2. Project APIs
export const getProjects = () => fetchApi('/projects');

// 3. Complaint APIs
export const getComplaints = () => fetchApi('/complaints');

export const submitComplaint = (complaintData) =>
  fetchApi('/complaints', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  });