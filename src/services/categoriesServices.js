import { api } from "./axios";

export async function getCategories() {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

// export async function getPostById(id) {
//   try {
//     const { data } = await api.get(`/announcements/${id}`);
//     return data;
//   } catch (error) {
//     console.error('Error fetching post by id:', error);
//     throw error;
//   }
// }

export async function createCategory(postData) {
  try {
    const { data } = await api.post('/categories', postData);
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function updateCategories(id, postData) {
  try {
    const { data } = await api.put(`/categories/${id}`, postData);
    return data;          
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

export async function deleteCategories(id) {
  try {
    const { data } = await api.delete(`/categories/${id}`);
    return data;         
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}
