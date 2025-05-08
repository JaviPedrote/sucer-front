import {
    useQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query';
  
  import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  } from '../services/userServcice';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
  
 
  export function useUsersQuery() {

    const { user } = useContext(AuthContext);

    return useQuery({
      queryKey: [ 'users', user?.id],
      queryFn: getUsers,
      staleTime: 30*3000 , // 30 segundos
    });
  }
  
  export function useUserQuery(id, enabled = true) {

    const { user } = useContext(AuthContext);

    return useQuery({
      queryKey: ['users', user?.id, id],
      queryFn: () => getUserById(id),
      enabled: !!id && enabled, //  solo se ejecuta si id es verdadero
    });
  }
  
 
  export function useCreateUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['users'] });
      },
    });
  }
  

  export function useUpdateUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, data }) => {
       
        return updateUser(id, data);
      },
      // recibe un objeto con id y dat
      onSuccess: (_res, { id }) => {
        // Revalida tanto el usuario concreto como la lista
        qc.invalidateQueries({ queryKey: ['users', id] });
        qc.invalidateQueries({ queryKey: ['users'] });
      },
    });
  }
  

  export function useDeleteUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['users'] });
      },
    });
  }
  