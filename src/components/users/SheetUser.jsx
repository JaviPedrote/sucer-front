import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { IoClose } from 'react-icons/io5';
import { useCreateUserMutation, useUpdateUserMutation } from '../../hooks/useUser';

const Sheet = memo(({ handleUser, user }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '' });
  const createUser = useCreateUserMutation();
  const updateUser = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '', role_id: user.role_id });
    }
    return () => setFormData({ name: '', email: '', password: '', role_id: '' });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'role_id' ? parseInt(value, 10) : value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password?.length >= 8 || !formData.role_id) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }
    createUser.mutate(formData, {
      onSuccess: () => {
        toast.success('Usuario creado correctamente');
        handleUser(false);
      },
      onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al crear el usuario'),
    });
    toast.info('Creando usuario...');
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role_id) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    updateUser.mutate({ id: user.id, data: formData }, {
      onSuccess: () => {
        toast.success('Usuario editado correctamente');
        handleUser(false);
      },
      onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al editar el usuario'),
    });
    toast.info('Editando usuario...');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={() => handleUser(false)} />
      <motion.div className="relative ml-auto w-full max-w-sm bg-white dark:bg-slate-800 p-6 shadow-xl flex flex-col" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">{user ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
          <button onClick={() => handleUser(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400"><IoClose className="h-6 w-6" /></button>
        </div>
        <form className="space-y-4 flex-1">
          <div>
            <label htmlFor="name" className="block text-sm font-medium dark:text-white">Nombre</label>
            <input id="name" name="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-white">Email</label>
            <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white" />
          </div>
          {!user && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium dark:text-white">Password</label>
              <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white" />
            </div>
          )}
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium dark:text-white">Rol</label>
            <div className="relative mt-1">
              <select id="role_id" name="role_id" value={formData.role_id} onChange={handleChange} className="w-full appearance-none rounded-md border border-gray-300 pl-2 pr-10 py-2 shadow-sm focus:ring focus:ring-opacity-50 dark:text-white">
                <option value="" disabled>Selecciona un rol</option>
                <option value="1">Admin</option>
                <option value="2">Tutor</option>
                <option value="3">User</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button onClick={user ? handleEdit : handleCreate} className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {user ? 'Editar usuario' : 'Crear Usuario'}
          </button>
        </form>
      </motion.div>
    </div>
  );
});

export default Sheet;
