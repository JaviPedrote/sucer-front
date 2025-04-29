import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = (email) => {
    const usr = { email };
    setUser(usr);
    sessionStorage.setItem("user", JSON.stringify(usr));
  };

  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
