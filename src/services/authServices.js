import { api } from "./axios";


export async function handlelogin({ email, password }) {
  try {
    const { data } = await api.post("/login", { email, password });
    const token = data.access_token;

  
    sessionStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    api.defaults.headers.common["Accept"]        = "application/json";

    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
