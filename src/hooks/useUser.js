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
  
  export const usersKeys = {
    all: ['users'],
    detail: (id) => ['users', id],
  };
 
  export function useUsersQuery() {
    return useQuery({
      queryKey: usersKeys.all,
      queryFn: getUsers,
      staleTime: 60_000, // 1 min; ajusta a tu gusto
    });
  }
  
  export function useUserQuery(id, enabled = true) {
    return useQuery({
      queryKey: usersKeys.detail(id),
      queryFn: () => getUserById(id),
      enabled: !!id && enabled, // evita la llamada con id falsy
    });
  }
  
 
  export function useCreateUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: createUser,
      onSuccess: () => {
       
        qc.invalidateQueries({ queryKey: usersKeys.all });
      },
    });
  }
  

  export function useUpdateUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, data }) => {
        console.log('id', id, data);
        return updateUser(id, data);
      },
      // recibe un objeto con id y dat
      onSuccess: (_res, { id }) => {
        // Revalida tanto el usuario concreto como la lista
        qc.invalidateQueries({ queryKey: usersKeys.detail(id) });
        qc.invalidateQueries({ queryKey: usersKeys.all });
      },
    });
  }
  

  export function useDeleteUserMutation() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: deleteUser, // recibe directamente el id
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: usersKeys.all });
      },
    });
  }
  