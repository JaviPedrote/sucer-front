import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUsersQuery, useUserQuery } from '../useUser';
import { getUsers, getUserById } from '../../services/userServcice';
import { AuthContext } from '../../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock de los servicios
vi.mock('../../services/userServcice', () => ({
  getUsers: vi.fn(),
  getUserById: vi.fn()
}));

// Creamos un wrapper para el contexto de React Query y AuthContext
const createWrapper = (authContextValue) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Desactivamos los reintentos para los tests
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authContextValue}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe('useUser hooks', () => {
  // Antes de cada test, limpiamos los mocks
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useUsersQuery', () => {
    it('debería devolver los datos de usuarios correctamente', async () => {
      // Mock de datos de usuarios
      const mockUsers = [
        { id: 1, name: 'Usuario 1' },
        { id: 2, name: 'Usuario 2' }
      ];

      // Configuramos el mock para que devuelva los datos de usuarios
      getUsers.mockResolvedValue(mockUsers);

      // Creamos un mock para el contexto de autenticación
      const authContextValue = {
        user: { id: 123, name: 'Usuario Autenticado' }
      };

      // Renderizamos el hook con los wrappers necesarios
      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(authContextValue)
      });

      // Inicialmente, el hook debería estar en estado de carga
      expect(result.current.isLoading).toBe(true);

      // Esperamos a que se resuelva la consulta
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verificamos que se llamó a getUsers
      expect(getUsers).toHaveBeenCalledTimes(1);

      // Verificamos que los datos devueltos son los esperados
      expect(result.current.data).toEqual(mockUsers);
    });

    it('debería manejar errores correctamente', async () => {
      // Configuramos el mock para que lance un error
      const errorMessage = 'Error al obtener usuarios';
      getUsers.mockRejectedValue(new Error(errorMessage));

      // Creamos un mock para el contexto de autenticación
      const authContextValue = {
        user: { id: 123, name: 'Usuario Autenticado' }
      };

      // Renderizamos el hook con los wrappers necesarios
      const { result } = renderHook(() => useUsersQuery(), {
        wrapper: createWrapper(authContextValue)
      });

      // Esperamos a que se resuelva la consulta con error
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verificamos que se llamó a getUsers
      expect(getUsers).toHaveBeenCalledTimes(1);

      // Verificamos que el error es el esperado
      expect(result.current.error.message).toBe(errorMessage);
    });
  });

  describe('useUserQuery', () => {
    it('debería devolver los datos de un usuario específico', async () => {
      // Mock de datos de usuario
      const userId = 1;
      const mockUser = { id: userId, name: 'Usuario 1' };

      // Configuramos el mock para que devuelva los datos del usuario
      getUserById.mockResolvedValue(mockUser);

      // Creamos un mock para el contexto de autenticación
      const authContextValue = {
        user: { id: 123, name: 'Usuario Autenticado' }
      };

      // Renderizamos el hook con los wrappers necesarios
      const { result } = renderHook(() => useUserQuery(userId), {
        wrapper: createWrapper(authContextValue)
      });

      // Inicialmente, el hook debería estar en estado de carga
      expect(result.current.isLoading).toBe(true);

      // Esperamos a que se resuelva la consulta
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verificamos que se llamó a getUserById con el ID correcto
      expect(getUserById).toHaveBeenCalledTimes(1);
      expect(getUserById).toHaveBeenCalledWith(userId);

      // Verificamos que los datos devueltos son los esperados
      expect(result.current.data).toEqual(mockUser);
    });

    it('no debería ejecutar la consulta si no se proporciona un ID', async () => {
      // Creamos un mock para el contexto de autenticación
      const authContextValue = {
        user: { id: 123, name: 'Usuario Autenticado' }
      };

      // Renderizamos el hook sin ID
      const { result } = renderHook(() => useUserQuery(null), {
        wrapper: createWrapper(authContextValue)
      });

      // Verificamos que el hook no está en estado de carga
      expect(result.current.isLoading).toBe(false);

      // Verificamos que no se llamó a getUserById
      expect(getUserById).not.toHaveBeenCalled();
    });
  });
});
