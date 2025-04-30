import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.webp';
import { loginWithCredentials } from '../services/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { user, loginUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate('/home', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await loginWithCredentials({ email, password });
      loginUser(user);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al iniciar sesión')
      setError(err?.response?.data?.message);
      console.error('Error al iniciar sesión:', err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700 p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="logo" className="mx-auto w-24 h-24 rounded-2xl mb-4" />
          <p className="text-primary-900 font-medium">Tablón de anuncios para tu centro educativo</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-900">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-800"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-900">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-800"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between text-sm">
            <a href="#" className="text-secondary-900 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r hover:bg-gradient-to-l from-primary-900 to-primary-700 text-secondary-900 rounded-lg font-semibold hover:cursor-pointer  transition"
          >Entrar</button>
        </form>
        <p className="mt-6 text-center text-gray-600 text-sm">
          ¿Eres nuevo en Sucer? <a href="#" className="text-primary-900 hover:underline">Regístrate aquí</a>
        </p>
      </motion.div>
    </div>
  );
}
