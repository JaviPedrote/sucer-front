import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, destacados: 0, categorias: 0 });

  

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold">Total de anuncios</h3>
        <p className="mt-2 text-3xl text-blue-600 font-bold">{stats.total}</p>
      </div>
      <div className="p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold">Anuncios destacados</h3>
        <p className="mt-2 text-3xl text-yellow-500 font-bold">{stats.destacados}</p>
      </div>
      <div className="p-6 bg-white shadow rounded-lg">
        <h3 className="text-xl font-semibold">Categorías</h3>
        <p className="mt-2 text-3xl text-green-600 font-bold">{stats.categorias}</p>
      </div>
    </div>
  );
}