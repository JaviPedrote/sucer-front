import { createContext, useCallback, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = (data) => {
    console.log("Login user", data);
    const user = data
    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const logoutUser = useCallback(() => {

    setUser(null);
    
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  }, []);
  

  return (
    <AuthContext.Provider value={{ user,setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
