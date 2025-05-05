/* eslint-disable no-unused-vars */
import { memo, use, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChartBarIcon, StarIcon, TagIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { IoClose } from "react-icons/io5";
import { useDeleteUserMutation, useUsersQuery, useCreateUserMutation, useUpdateUserMutation } from '../hooks/useUser';
import { MdDeleteForever } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { AuthContext} from '../context/AuthContext';



export function Dashboard() {
  const [stats, setStats] = useState({ total: 42, destacados: 7, categorias: 4 });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalSheetOpen, setModalSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
   const { user:AuthUser } = useContext(AuthContext);
  

 
  useEffect(() => {
    if (modalSheetOpen || confirmOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };

  }, [modalSheetOpen,confirmOpen])


  useEffect(() => {
    if (!modalSheetOpen) {
      setSelectedUser(null);
    }
  }, [modalSheetOpen])


  const { data: users, isLoading } = useUsersQuery();
  const deleteUser = useDeleteUserMutation();

  const askDelete = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const askEdit = (id) => {
    setModalSheetOpen(true);
    setSelectedUser(id);
  };

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

  const newUser = () => {
    setModalSheetOpen(true);
  };

  const cards = [
    { title: 'Total anuncios', value: stats.total, icon: ChartBarIcon, color: 'text-blue-600' },
    { title: 'Anuncios destacados', value: stats.destacados, icon: StarIcon, color: 'text-amber-500' },
    { title: 'Categorías', value: stats.categorias, icon: TagIcon, color: 'text-emerald-600' },
  ];

  if (isLoading) return <p className="text-center text-lg font-semibold dark:text-white">Cargando...</p>;
  if (!users?.length) return <p className="text-center text-lg font-semibold dark:text-white">No hay usuarios</p>;

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
            className="rounded-3xl bg-white p-6 shadow-lg bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 dark:bg-slate-800/50"
          >
            <Icon className={`h-8 w-8 ${color} mb-4`} />
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white">{title}</h3>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* --- Gestión de usuarios --- */}
      <div className="rounded-3xl bg-white p-6 shadow-lg bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 dark:bg-slate-800/50">
        <h2 className="flex justify-between mb-6 text-2xl font-bold text-primary-900 dark:text-white">
          Gestión de usuarios
          <ButtonAddUser newUser={newUser} />
        </h2>

        {/* ── Móvil: tarjetas ── */}
        <div className="space-y-4 md:hidden dark:text-slate-200">
          {users.map(u => (
            <UserCard key={u.id} user={u} askDelete={askDelete} askEdit={askEdit}/>
          ))}
        </div>

        {/* ── Desktop: tabla ── */}
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
                    {u.role_id === 1 ? ('') :
                      (<>
                        <button
                          onClick={() => askDelete(u.id)}
                          className="rounded cursor-pointer bg-red-600 px-1 py-1 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <MdDeleteForever className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => askEdit(u)}
                          className="ml-2 cursor-pointer rounded bg-blue-600 px-1 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          <FaUserEdit className="w-6 h-6" />
                        </button></>)}
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
                <button
                  onClick={() => { setConfirmOpen(false); setUserToDelete(null); }}
                  className="rounded-lg border px-4 py-2 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide-over form sheet */}
        <AnimatePresence>
          {modalSheetOpen && <Sheet handleUser={setModalSheetOpen} user={selectedUser} />}
        </AnimatePresence>

      </div>
    </section>
  );
}

/* --- Tarjeta de usuario (móvil) --- */
const UserCard = memo(({ user, askDelete, askEdit }) => (
  <div className="space-y-1 rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex justify-between">
      <span className="font-medium">ID: {user.id}</span>
      <button
        onClick={() => askEdit(user)}
        className="ml-2 cursor-pointer rounded bg-blue-600 px-2 py-1 w-12 text-xs font-semibold text-white hover:bg-blue-700 -mr-2 -mt-1"
      >
        Editar
      </button>

    </div>
    <p><span className="font-medium">Nombre:</span> {user.name}</p>
    <p><span className="font-medium">Email:</span> {user.email}</p>
    <div className='flex justify-between'>
    <p><span className="font-medium">Rol:</span> <span className="capitalize">{user.role.slug}</span></p>
    {user.role_id === 1 ? ('') : (<button
        onClick={() => askDelete(user.id)}
        className="rounded bg-red-600 px-2 py-1 w-12 text-xs font-semibold text-white hover:bg-red-700 -mr-2 -mb-1"
      >
        Borrar
      </button>)}
    </div>
  </div>
));

const ButtonAddUser = memo(({ newUser }) => (
  <button
    onClick={newUser}
    className="flex items-center justify-center rounded-full bg-blue-600 w-8 h-8 text-white shadow-lg hover:bg-blue-700"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v16m8-8H4" />
    </svg>
    <span className="sr-only">Agregar usuario</span>
  </button>
));

const Sheet = memo(({ handleUser, user }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '' });
  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password,
        role_id: user.role_id,
      });
    }

    return () => {
      setFormData({ name: '', email: '', password: '', role_id: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role_id' ? parseInt(value, 10) : value
    }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email ) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    if (!user && formData?.password?.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!formData.role_id) {
      toast.error('Por favor selecciona un rol');
      return;
    }
    createUser.mutate(formData, {
      onSuccess: () => {
        toast.success('Usuario creado correctamente');
        handleUser(false);
        setFormData({ name: '', email: '', password: '', role_id: '' });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? 'Error al crear el usuario');
      },
    });
    toast.info('Creando usuario...');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Por favor completa todos los campos');
      return;
    }
   
    if (!formData.role_id) {
      toast.error('Por favor selecciona un rol');
      return;
    }
    console.log(user.id, formData);
    updateUser.mutate( {id:user.id , data:formData}, {
      onSuccess: () => {
        toast.success('Usuario editado correctamente');
        handleUser(false);
        setFormData({ name: '', email: '', password: '', role_id: '' });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? 'Error al editar el usuario');
      },
    });
    toast.info('Editando usuario...');
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={() => handleUser(false)} />
      <motion.div
        className="relative ml-auto w-full max-w-sm bg-white dark:bg-slate-800 p-6 shadow-xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Agregar Usuario</h3>
          <button onClick={() => handleUser(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <IoClose className="h-6 w-6" />
          </button>
        </div>
        <form className="space-y-4 flex-1">
          <div>
            <label htmlFor="name" className="block text-sm font-medium dark:text-white">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-white">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white"
              required
            />
          </div>
          {(!user) && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium dark:text-white">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium dark:text-white">Rol</label>
            <div className="relative mt-1">
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-gray-300 pl-2 pr-10 py-2 shadow-sm focus:ring focus:ring-opacity-50 dark:text-white"
                required
              >
                <option className='dark:text-black' value="" disabled>Selecciona un rol</option>
                <option className='dark:text-black' value="1">Admin</option>
                <option className='dark:text-black' value="2">Tutor</option>
                <option className='dark:text-black' value="3">User</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button
            onClick={user ?  handleEdit : handleCreate}
            className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {user ? 'Editar usuario' : 'Crear Usuario'}
          </button>
        </form>
      </motion.div>
    </div>
  );
});
