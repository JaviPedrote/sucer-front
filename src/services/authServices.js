import { api } from "./axios";

export async function login({ email, password }) {
    const { data } = await api.post('api/v1/login', { email, password });
    console.log('Login response:', data);
    sessionStorage.setItem('token', data.access_token);
    return data.user;
  }