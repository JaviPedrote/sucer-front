import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

/* Iconos ilustrativos (Heroicons) */
import { ChartBarIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline';

export function Dashboard() {
  const [stats, setStats] = useState({ total: 42, destacados: 7, categorias: 4 });

  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez',   email: 'juan@demo.com',   role: 'admin' },
    { id: 2, name: 'María López',  email: 'maria@demo.com',  role: 'user'  },
    { id: 3, name: 'Pedro García', email: 'pedro@demo.com',  role: 'user'  },
    // …
  ]);

  const deleteUser = async id => {
    if (!confirm('¿Eliminar usuario definitivamente?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(u => u.filter(user => user.id !== id));
      toast.success('Usuario eliminado');
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const cards = [
    { title: 'Total anuncios',      value: stats.total,      icon: ChartBarIcon, color: 'text-blue-600' },
    { title: 'Anuncios destacados', value: stats.destacados, icon: StarIcon,     color: 'text-amber-500' },
    { title: 'Categorías',          value: stats.categorias, icon: TagIcon,      color: 'text-emerald-600' },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-12 px-4 py-10">
      {/* --- Estadísticas --- */}
      <div className="grid gap-8 sm:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, color }, i) => (
          <motion.div
            key={title}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="rounded-3xl bg-white p-6 shadow-lg bg-gradient-to-b
                         dark:from-slate-800 dark:to-slate-900 dark:bg-slate-800/50"
          >
            <Icon className={`h-8 w-8 ${color} mb-4`} />
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white">{title}</h3>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* --- Gestión de usuarios --- */}
      <div className="rounded-3xl bg-white p-6 shadow-lg bg-gradient-to-b
                         dark:from-slate-800 dark:to-slate-900 dark:bg-slate-800/50">
        <h2 className="mb-6 text-2xl font-bold text-primary-900 dark:text-white">
          Gestión de usuarios
        </h2>

        {/* ── Móvil: tarjetas ── */}
        <div className="space-y-4 md:hidden dark:text-slate-200">
          {users.map(u => (
            <UserCard key={u.id} user={u} onDelete={deleteUser} />
          ))}
        </div>

        {/* ── Desktop: tabla ── */}
        <div className="hidden overflow-x-auto md:block ">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-600 text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Nombre</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Rol</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-200">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="rounded-lg bg-red-600 px-3 py-1 text-white shadow hover:bg-red-700"
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
    </section>
  );
}

/* --- Tarjeta de usuario (móvil) --- */
const UserCard = memo(({ user, onDelete }) => (
  <div className="space-y-1 rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex justify-between">
      <span className="font-medium">ID: {user.id}</span>
      <button
        onClick={() => onDelete(user.id)}
        className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
      >
        Borrar
      </button>
    </div>
    <p><span className="font-medium">Nombre:</span> {user.name}</p>
    <p><span className="font-medium">Email:</span> {user.email}</p>
    <p><span className="font-medium">Rol:</span> <span className="capitalize">{user.role}</span></p>
  </div>
));
