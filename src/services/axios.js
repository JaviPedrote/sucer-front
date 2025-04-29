import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const loginWithPasswordGrant = async ({ email, password }) => {

  console.log("email", email);
  console.log("password", password);
  
  const payload = {
    grant_type: "password",
    client_id: import.meta.env.VITE_CLIENT_ID,
    client_secret: import.meta.env.VITE_CLIENT_SECRET,
    username: email,
    password,
  };
  console.log("payload", payload);
  return api.post("/oauth/token", payload);
};