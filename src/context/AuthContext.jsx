import { createContext, useCallback, useState,useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const logoutUser = useCallback(() => {
    setUser(null);
    sessionStorage.clear();
  }, []);

  // 2) Efecto para “escuchar” cambios en React (user) o en el storage de otras pestañas
  useEffect(() => {
    const token = sessionStorage.getItem('token');

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
    sessionStorage.setItem("user", JSON.stringify(user.name));
  };
  

  return (
    <AuthContext.Provider value={{ user,setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
