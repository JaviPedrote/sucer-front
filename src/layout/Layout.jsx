import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Layout() {
  const { logoutUser, user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/home" className="text-xl font-bold text-gray-800">Sucer</Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Obtener nombre usuario desde authCiontext</span>
            <button
              onClick={logoutUser}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}