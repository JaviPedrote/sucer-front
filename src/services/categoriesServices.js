import { api } from "./axios";

export async function getCategories() {
  try {
    console.log('Fetching categories...');
    const { data } = await api.get('/categories');
    console.log('Categories fetched successfully:');
    console.log('Categories:', data);
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

// export async function createPost(postData) {
//   try {
//     const { data } = await api.post('/announcements', postData);
//     return data;          
//   } catch (error) {
//     console.error('Error creating post:', error);
//     throw error;
//   }
// }

// export async function updatePost(id, postData) {
//   try {
//     const { data } = await api.put(`/announcements/${id}`, postData);
//     return data;          
//   } catch (error) {
//     console.error('Error updating post:', error);
//     throw error;
//   }
// }

// export async function deletePost(id) {
//   try {
//     const { data } = await api.delete(`/announcements/${id}`);
//     return data;         
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     throw error;
//   }
// }
