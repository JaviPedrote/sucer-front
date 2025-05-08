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

  return useMutation({
    mutationFn:createPost,
      onSuccess: () => {
        qc.invalidateQueries(['posts'])
      },
      onError: (err) => {
        console.error(err)
      },
  })
}

/**
 * Actualizar un post
 */
export function useUpdatePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => {
      return updatePost(id, data)
    },
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries(['posts'])
      qc.invalidateQueries(['posts', id])
    },
    onError: (err) => {
      console.error(err)
    },
  }
  )
}

/**
 * Eliminar un post
 */
export function useDeletePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn:deletePost,
    onSuccess: () => {
      qc.invalidateQueries(['posts'])
    },
})
}
