import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a Sucer</h1>
      <p className="text-gray-600 mb-6">Tu tablón digital educativo.</p>
      <div className="flex space-x-4">
        <Link
          to="/anuncios"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ver Anuncios
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}