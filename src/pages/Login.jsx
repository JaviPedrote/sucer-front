import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPasswordGrant } from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginWithPasswordGrant({ email, password });
      console.log("clave valida");
      localStorage.setItem("access_token", data.access_token);
      loginUser(email);
      // navigate will happen via useEffect when user state updates
    } catch (error) {
      console.log("clave incorrecta");
      console.error("Error al iniciar sesión:", error);

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Iniciar sesión</h1>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="border rounded w-full p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded w-full p-2 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}