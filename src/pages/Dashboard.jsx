import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

export function Dashboard() {
  const [stats, setStats] = useState({ total: 0, destacados: 0, categorias: 0 });

  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'prueba@preueba.com', role: 'admin' },
    { id: 2, name: 'María López', email: 'prueba@preueba.com', role: 'user' },
    { id: 3, name: 'Pedro García', email: 'prueba@preueba.com', role: 'user' },
    { id: 4, name: 'Ana Martínez', email: 'prueba@preueba.com', role: 'user' },
    { id: 5, name: 'Luis Fernández', email: 'prueba@preueba.com', role: 'user' },
    { id: 6, name: 'Laura Sánchez', email: 'prueba@preueba.com', role: 'user' },
  ]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const [statsRes, usersRes] = await Promise.all([
  //         axios.get('/api/dashboard/stats'),
  //         axios.get('/api/admin/users'),
  //       ]);
  //       setStats(statsRes.data);
  //       setUsers(usersRes.data);
  //     } catch (err) {
  //       toast.error('Error cargando datos');
  //     }
  //   })();
  // }, []);

  const deleteUser = async (id) => {
    if (!confirm('¿Eliminar usuario definitivamente?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers((u) => u.filter((user) => user?.id !== id));
      toast.success('Usuario eliminado');
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const cards = [
    { title: 'Total de anuncios', value: stats.total, color: 'text-blue-600' },
    { title: 'Anuncios destacados', value: stats.destacados, color: 'text-yellow-500' },
    { title: 'Categorías', value: stats.categorias, color: 'text-green-600' },
  ];

  return (
    <div className="p-4 space-y-10">
      {/* Estadísticas */}
      <div className="grid gap-8 sm:grid-cols-3">
        {cards?.map((c, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white shadow-xl rounded-2xl "
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-primary-900">{c.title}</h3>
            <p className={`mt-2 text-3xl font-bold ${c.color}`}>{c.value}</p>

            
          </motion.div>
        ))}
      </div>

   
      <div className="rounded-2xl shadow-xl p-6 bg-gradient-to-tr from-white md:from-primary-600 to-secondary-500 md:to-primary-900 md:text-white">
        <h2 className="text-2xl font-bold text-black md:text-white mb-4">Gestión de Usuarios</h2>

        {/* movil */}
        <div className="space-y-4 md:hidden">
          {users.map((u) => (
            <div key={u.id} className="p-4 rounded-lg shadow outline-1 outline-primary-100 bg-gradient-to-tr from-white to-primary-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">ID: {u.id}</span>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Borrar
                </button>
              </div>
              <p><span className="font-medium">Nombre:</span> {u.name}</p>
              <p><span className="font-medium">Email:</span> {u.email}</p>
              <p><span className="font-medium">Rol:</span> <span className="capitalize">{u.role}</span></p>
            </div>
          ))}
        </div>

        {/* Vista desktop: tabla */}
        <div className="hidden md:block overflow-x-auto outline-1 outline-secondary-900 rounded">
          <table className="w-full text-left">
            <thead className="bg-primary-900 text-white rounded">
              <tr className="bg-secondary-900 text-black rounded">
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b last:border-none border-secondary-900 hover:bg-secondary-400 hover:text-black transition">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm "
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
