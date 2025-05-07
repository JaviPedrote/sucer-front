import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChartBarIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline';
import { useDeleteUserMutation, useUsersQuery } from '../hooks/useUser';
import { AuthContext } from '../context/AuthContext';
import ButtonAddUser from '../components/users/BottonAddUser';
import UserCard from '../components/users/UserCard';
import Sheet from '../components/users/SheetUser';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 42, destacados: 7, categorias: 4 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalSheetOpen, setModalSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: AuthUser } = useContext(AuthContext);

  // UseEffect to set the stats based on the user role
  useEffect(() => {
    document.body.style.overflow = (modalSheetOpen || confirmOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalSheetOpen, confirmOpen]);

  useEffect(() => {
    if (!modalSheetOpen) setSelectedUser(null);
  }, [modalSheetOpen]);

  const { data: users, isLoading } = useUsersQuery();
  const deleteUser = useDeleteUserMutation();

  const askDelete = (id) => { setUserToDelete(id); setConfirmOpen(true); };
  const askEdit = (id) => { setModalSheetOpen(true); setSelectedUser(id); };

  const handleDelete = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete, {
      onSuccess: () => {
        toast.success('Usuario borrado correctamente');
        setConfirmOpen(false);
        setUserToDelete(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? 'Error al borrar el usuario');
        setConfirmOpen(false);
      },
    });
    toast.info('Borrando usuario...');
  };

  const newUser = () => { setModalSheetOpen(true); };

  const cardsUsuarios = [
    { title: 'Tutores', value: stats.total, icon: ChartBarIcon, color: 'text-blue-500' },
    { title: 'Alumnos', value: users?.length, icon: ChartBarIcon, color: 'text-purple-500' },
    { title: 'Usuarios', value: stats.categorias, icon: TagIcon, color: 'text-red-500' }

  ];
  const cardsAnuncios = [
    { title: 'Anuncios', value: stats.total, icon: ChartBarIcon, color: 'text-blue-500' },
    { title: 'Categorias', value: stats.destacados, icon: StarIcon, color: 'text-amber-500' },
    { title: 'Destacados', value: stats.categorias, icon: TagIcon, color: 'text-red-500' }
  ]
  

  if (isLoading) return <p className="text-center text-lg font-semibold dark:text-white">Cargando...</p>;
  if (!users?.length) return <p className="text-center text-lg font-semibold dark:text-white">No hay usuarios</p>;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 mt-4 md:mt-0 space-y-6 md:space-y-10">

<header className="mb-10 flex flex-col md:flex-row items-center justify-between">
  <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-6 md:mb-0">
    Dashboard
  </h1>
  <div className="flex gap-4">
    <button
      className="cursor-pointer px-2 py-1 h-12 md:h-8 w-35 md:w-23 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-300 dark:to-blue-500 dark:text-black text-white font-medium rounded-lg hover:bg-gradient-to-t transition-colors"
    >
      Anuncios
    </button>
    <button
      className="cursor-pointer px-2 py-1 h-12 md:h-8 w-35 md:w-23 bg-gradient-to-b from-amber-500 to-amber-600  dark:from-amber-200 dark:to-amber-400  dark:text-black text-white font-medium  rounded-lg hover:bg-gradient-to-t transition-colors"
    >
      Usuarios
    </button>
  </div>
</header>
      {/* Estadísticas */}
      <div className="grid gap-3 md:gap-8 grid-cols-3">
        {cardsUsuarios.map(({ title, value, icon: Icon, color }, i) => (
          <motion.div
            key={title}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="relative rounded-xl md:rounded-3xl bg-white pl-5 py-3 md:px-6 md:py-6 bg-gradient-to-tl shadow-2xl from-white to-secondary-100 dark:from-slate-800  dark:to-slate-700 md:dark:to-slate-800 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700"
          >
            <p>
            <Icon className={`md:h-8 md:w-8 h-5 w-5 ${color} mb-4`} />
            </p>
            <h3 className="md:text-lg font-semibold text-primary-900 dark:text-white">{title}</h3>
            <p className={`absolute md:static top-1.5 right-6 mt-1 text-xl md:text-3xl font-bold ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Gestión de usuarios */}
      <div className="rounded-xl md:rounded-3xl p-6  bg-gradient-to-br shadow-2xl from-white via-white to-secondary-300 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700">
        <h2 className="flex justify-between mb-6 text-2xl font-bold text-primary-900 dark:text-white">
          Gestión de usuarios
          <ButtonAddUser newUser={newUser} />
        </h2>

        {/* Móvil: tarjetas */}
        <div className="space-y-4 md:hidden dark:text-slate-200">
          {users.map(u => (
            <UserCard key={u.id} user={u} askDelete={askDelete} askEdit={askEdit} />
          ))}
        </div>

        {/* Desktop: tabla */}
        <div className="hidden overflow-x-auto md:block">
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
                <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4 capitalize">{u.role.slug}</td>
                  <td className="py-2 px-4">
                    {u.role_id !== 1 && (
                      <>
                        <button onClick={() => askDelete(u.id)} className="rounded bg-red-600 px-1 py-1  font-semibold text-white hover:bg-red-700">
                          Borrar
                        </button>
                        <button onClick={() => askEdit(u)} className="ml-4 rounded bg-blue-600 px-1 py-1 font-semibold text-white hover:bg-blue-700">
                          Editar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirm delete modal */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:text-primary-50 p-6 shadow-lg dark:bg-slate-800">
              <h3 className="mb-4 text-lg font-semibold">¿Estás seguro de que quieres borrar este usuario?</h3>
              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirmOpen(false)} className="rounded-lg border px-4 py-2 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500">Cancelar</button>
                <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Borrar</button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-over form sheet */}
        <AnimatePresence>{modalSheetOpen && <Sheet handleUser={setModalSheetOpen} user={selectedUser} />}</AnimatePresence>
      </div>
    </section>
  );
}
