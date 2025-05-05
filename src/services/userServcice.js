import { api } from "./axios";

export async function getUsers() {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
}

export async function createUser(userData) {
  try {
    const { data } = await api.post("/register", userData);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id, userData) {
  try {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
export async function deleteUser(id) {
  try {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
