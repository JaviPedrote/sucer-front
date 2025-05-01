import { api } from "./axios";

export async function handlelogin({ email, password }) {

  try {
    const { data } = await api.post('api/v1/login', { email, password });
    sessionStorage.setItem('token', data.access_token);
    
    return data.user;
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
    
  }

