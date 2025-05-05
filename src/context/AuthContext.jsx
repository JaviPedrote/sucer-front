import { createContext, useCallback, useState, useEffect } from "react";
import { api } from "../services/axios";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const logoutUser = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    delete api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Accept"];
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  // 2) Efecto para “escuchar” cambios en React (user) o en el storage de otras pestañas
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['Accept'] = 'application/json';
    }

    if (!user || !token) {
      logoutUser();
    }
    // Manejador para storage events (sólo salta en OTRAS pestañas de tu app)
    const onStorageChange = (e) => {
      if (e.key === 'user' && e.newValue === null) {
        // Alguien borró `user` manualmente (o con clear) en otra pestaña
        logoutUser();
      }
      if (e.key === 'token' && e.newValue === null) {
        // Igual para el token
        logoutUser();
      }
    };

    // Escucha el evento de storage
    window.addEventListener('storage', onStorageChange);
    // Limpia el listener al desmontar el componente
    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, [user, logoutUser]);

  const loginUser = (data) => {
    console.log("Login user", data);
    const user = data
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
