import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPasswordGrant } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logo.webp"; // Importa tu logo aquí

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
    } catch (error) {
      console.log("clave incorrecta");
      console.error("Error al iniciar sesión:", error);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700 p-4">

      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-3">
            <img src={logo} alt='logo' className="rounded-2xl" />
          </div>
          <p className="text-primary-900">Tablón de anuncios para tu centro educativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-900">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-900">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="#" className="text-primary-900 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-900 to-primary-700 text-secondary-900 font-semibold hover:outline-2 hover:ring-secondary-900 transition cursor-pointer"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Eres nuevo en sucer?{' '}
          <a href="#" className="text-primary-900 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
