// src/hooks/usePosts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
} from '../services/postServices'

/**
 * Lista de posts
 */
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })
}

/**
 * Un único post por ID
 */
export function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPostById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
  })
}
/**
 * Crear un post
 */
export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation(
    async (newPost) => {
      const response = await createPost(newPost);
      return response;
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(['posts'])
      },
    }
  )
}

/**
 * Actualizar un post
 */
export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation(
    ({ id, data }) => updatePost(id, data),
    {
      onSuccess: (_data, variables) => {
        qc.invalidateQueries(['posts'])
        qc.invalidateQueries(['posts', variables.id])
      },
    }
  )
}

/**
 * Eliminar un post
 */
export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation(
    (id) => deletePost(id),
    {
      onSuccess: () => {
        qc.invalidateQueries(['posts'])
      },
    }
  )
}
