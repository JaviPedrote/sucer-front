import axios from 'axios';

export const api = axios.create({
 
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

export async function loginWithCredentials({ email, password }) {
  const { data } = await api.post('api/v1/login', { email, password });
  console.log('Login response:', data);
  localStorage.setItem('token', data.token);
  api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return data.user;
}