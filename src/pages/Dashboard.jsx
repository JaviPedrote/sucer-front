/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChartBarIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline';
import { useDeleteUserMutation, useUsersQuery } from '../hooks/useUser';
import ButtonAddUser from '../components/users/BottonAddUser';
import ButtonPost from '../components/post/BottonAddPost';
import UserCard from '../components/users/UserCard';
import Sheet from '../components/users/SheetUser';
import { useDeletePost, usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/post/PostCard';
import SheetPost from '../components/post/SheetPost';
import { createCategory, getCategories, deleteCategories, updateCategories } from '../services/categoriesServices';
import { MdPostAdd } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [stats] = useState({ total: 4, alumnos: 15, categorias: 4 });
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [confirmDeletePost, setConfirmDeletePost] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [modalSheetOpen, setModalSheetOpen] = useState(false);
  const [sheetNewPost, setSheetNewPost] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUsers, setViewUsers] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalCategories, setModalCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalAddCategories, setModalAddCategories] = useState(false);
  const [nameCategory, setNameCategory] = useState();
  const [categoryId, setCategoryId] = useState(null);



  const { user } = useContext(AuthContext);
  const isAdmin = user?.role_id === 1;
  const isUser = user?.role_id === 3;



  const navigate = useNavigate();

  // useEffect para proteger ruta si no hay user
  useEffect(() => {
    if (!user) {
      navigate('/home');
    }
  }, [user, navigate]);

  // UseEffect para manejar el scroll del body
  useEffect(() => {
    document.body.style.overflow = (modalSheetOpen || confirmDeleteUser) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalSheetOpen, confirmDeleteUser]);

  // UseEffect para que al cerrar el modal se limpie el usuario seleccionado
  useEffect(() => {
    if (!modalSheetOpen) setSelectedUser(null);
  }, [modalSheetOpen]);

  // UseEffect para que al cerrar el modal se limpie el anuncio seleccionado
  useEffect(() => {
    if (!sheetNewPost) setSelectedPost(null);
  }, [sheetNewPost]);

  useEffect(() => {
    if (isUser) {
      navigate('/');
    }
  }, [user, navigate]);


  {/* Fetching datos de usuario */ }
  const { data: users, isLoading } = useUsersQuery();
  const deleteUser = useDeleteUserMutation();
  const askDelete = (u) => { setUserToDelete(u); setConfirmDeleteUser(true); };
  const askEdit = (id) => { setModalSheetOpen(true); setSelectedUser(id); };

  const newUser = () => { setModalSheetOpen(true); };

  // Fetching datos anincios
  const { data, error, isLoading: cargandoAnuncios } = usePosts();
  const deletePost = useDeletePost();
  const anuncios = data?.data ?? []
  const askDeletePost = (p) => { setSelectedPost(p); setConfirmDeletePost(true); };
  const askEditPost = (p) => { setSheetNewPost(true); setSelectedPost(p); };



  const handleDelete = () => {
    if (!userToDelete) return;
    deleteUser.mutate(userToDelete.id, {
      onSuccess: () => {
        toast.success('Usuario borrado correctamente');
        setConfirmDeleteUser(false);
        setUserToDelete(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? 'Error al borrar el usuario');
        console.log(err);
        setConfirmDeleteUser(false);
      },
    });
    toast.info('Borrando usuario...');
  };

  const handleDeletePost = () => {

    deletePost.mutate(selectedPost.id, {
      onSuccess: () => {
        toast.success('Anuncio borrado correctamente');
        setConfirmDeletePost(false);
        setSelectedPost(null);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message ?? 'Error al borrar el anuncio');
        console.log(err);
        setConfirmDeletePost(false);
      },
    });
    toast.info('Borrando anuncio...');
  };


  const handleChange = e => {
    setNameCategory(e.target.value);
  };



  // Fetching data categporias
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, [modalAddCategories, modalCategories]);

  const addCategories = () => {
    const response = createCategory({ name: nameCategory });
    if (response.status !== 201) {
      toast.success('Categoría añadida correctamente');
      setModalAddCategories(false);
      setNameCategory('');
    } else {
      toast.error('Error al añadir la categoría');
    }
  }

  const deleteCategory = (cat) => {
    if (!cat) return;
    // alert preguntando si quiuere eliminar la categoria
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar la categoría: ${cat.name}?`);
    if (!confirm) return;
    deleteCategories(cat.id);
    toast.success('Categoría eliminada correctamente');
    setModalCategories(false);
    setNameCategory('');
  }

  const editing = (id) => {
    const category = categories.find(cat => cat.id === id);
    setCategoryId(id);
    if (!category) return;
    setNameCategory(category.name);
    setModalAddCategories(true);
  }

  const updateCategory = async (id) => {
    const response = await updateCategories(id, { name: nameCategory });
    if (response.success) {
      toast.success('Categoría editada correctamente');
      setModalAddCategories(false);
      setNameCategory('');
      setCategoryId(null);
    } else {
      toast.error('Error al editar la categoría');
    }
  }

  const tutores = users?.filter(user => user.role_id === 2);
  const alumnos = users?.filter(user => user.role_id === 3);
  const postAdmin = anuncios?.filter(post => post?.user?.id === 1);

  const cardsUsuarios = [
    { title: 'Tutores', value: tutores?.length, icon: ChartBarIcon, color: 'text-blue-500' },
    { title: 'Alumnos', value: alumnos?.length, icon: ChartBarIcon, color: 'text-purple-500' },
    { title: 'Usuarios', value: users?.length, icon: TagIcon, color: 'text-red-500' }
  ];


  const cardsAnuncios = [
    { title: 'Anuncios', value: data?.data?.length, icon: ChartBarIcon, color: 'text-blue-500' },
    { title: 'Categorias', value: categories?.length, icon: StarIcon, color: 'text-amber-500' },
    { title: 'De Admin.', value: postAdmin.length, icon: TagIcon, color: 'text-red-500' }
  ]




  if (isLoading) return <p className="text-center text-lg font-semibold dark:text-white">Cargando...</p>;
  if (!users?.length) return <p className="text-center text-lg font-semibold dark:text-white">No hay usuarios</p>;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 mt-4 md:mt-0 space-y-6 md:space-y-10">
      <header className={`flex flex-col md:flex-row items-center justify-between`}>
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2 md:mb-0">
          Dashboard
        </h1>
        {isAdmin && (
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              className="cursor-pointer px-2 py-1 h-12 md:h-8 w-35 md:w-23 bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-300 dark:to-blue-500 dark:text-black text-white font-medium rounded-lg hover:bg-gradient-to-t transition-colors"
              onClick={() => setViewUsers(false)}
            >
              Anuncios
            </button>
            <button
              className="cursor-pointer px-2 py-1 h-12 md:h-8 w-35 md:w-23 bg-gradient-to-b from-amber-500 to-amber-600  dark:from-amber-200 dark:to-amber-400  dark:text-black text-white font-medium  rounded-lg hover:bg-gradient-to-t transition-colors"
              onClick={() => setViewUsers(true)}
            >
              Usuarios
            </button>
          </div>
        )}
      </header>

      {/* Controlar vistas usuarios o anuncios */}
      {!viewUsers ? (
        // Anuncios
        <>
          <div className="grid gap-3 md:gap-8 grid-cols-3">
            {cardsAnuncios.map(({ title, value, icon: Icon, color }, i) => (
              <motion.div
                key={`${title}-${i}`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="relative rounded-xl md:rounded-3xl bg-white py-2 md:px-6 md:py-4 bg-gradient-to-tl shadow-2xl from-white to-secondary-100 dark:from-slate-800  dark:to-slate-700 md:dark:to-slate-800 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700"
              >
                <Icon className={`md:h-8 md:w-8 h-5 w-5 ${color} mb-4 ml-2`} />
                <div className="flex flex-row justify-between ">
                  <h3 className=" text-sm sm:text-lg font-semibold text-primary-900 dark:text-white mx-auto md:mx-0">{title}</h3>
                  <p className={`absolute md:static top-0.5 right-3 mt-1  md:-mt-1 text-xl md:text-3xl font-bold ${color}`}>{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Botones gestion categorias */}
          <div className="flex gap-4 mb-6">
            <button onClick={() => setModalCategories(true)} className="cursor-pointer px-1 py-1 h-12 md:h-8 w-full md:w-50 bg-gradient-to-b from-red-500 to-red-700 text-white font-medium rounded-lg hover:bg-gradient-to-t transition-colors">
              Gestionar Categorias
            </button>
          </div>

          {/* Gestion Anuncios*/}
          <div className="rounded-xl md:rounded-3xl p-6  bg-gradient-to-br shadow-2xl from-white via-white to-secondary-300 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700">
            <h2 className="flex justify-between mb-6 text-2xl font-bold text-primary-900 dark:text-white">
              Gestión de anuncios
              <ButtonPost newPost={() => setSheetNewPost(true)} />
            </h2>
            {/* Móvil: tarjetas */}
            <div className="space-y-4 md:hidden dark:text-slate-200">
              {anuncios?.map(p => (
                <PostCard key={p.id} post={p} askDeletePost={askDeletePost} askEditPost={askEditPost} />
              ))}
            </div>

            {/* Desktop: tabla Anuncios */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-600 text-white ">
                  <tr>
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Titulo</th>
                    <th className="py-2 px-4">Contenido</th>
                    <th className="py-2 px-4">Categoria</th>
                    <th className="py-2 px-4 w-3/12">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {anuncios.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200">
                      <td className="py-2 px-4">{a.id}</td>
                      <td className="py-2 px-4">{a.title}</td>
                      <td className="py-2 px-4">{a.content}</td>
                      <td className="py-2 px-4 capitalize">{a?.category?.name}</td>
                      <td className="py-2 px-4">
                        {(a?.user?.id !== 1 || user.id == 1) && (
                          <div className="flex gap-2">
                            <button onClick={() => askDeletePost(a)} className="rounded bg-red-600 px-4 py-1  font-semibold text-white hover:bg-red-700">
                              Borrar
                            </button>
                            <button onClick={() => askEditPost(a)} className="ml-4 rounded bg-blue-600 px-4 py-1 font-semibold text-white hover:bg-blue-700">
                              Editar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* modal confirmacion borrar anuncios */}

            {confirmDeletePost && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
                <div className="w-full max-w-sm rounded-xl bg-white dark:text-primary-50 p-6 shadow-lg dark:bg-slate-800 ">
                  <h3 className="mb-4 text-lg font-semibold">¿Estás seguro de que quieres borrar el anuncio ?</h3>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDeletePost(false)} className="rounded-lg border px-4 py-2 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500">Cancelar</button>
                    <button onClick={handleDeletePost} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Borrar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Ssheet create update anuncios */}
            <AnimatePresence>{sheetNewPost && <SheetPost sheetNewPost={setSheetNewPost} post={selectedPost} />}</AnimatePresence>

          </div>
        </>
      ) : (

        // Gestion de usuarios
        <>
          {/* Gestión de usuarios */}

          {/* Estadísticas */}
          <div className="grid gap-3 md:gap-8 grid-cols-3">
            {cardsUsuarios.map(({ title, value, icon: Icon, color }, i) => (
              <motion.div
                key={`${title}-${i}`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="relative rounded-xl md:rounded-3xl bg-white py-2 md:px-6 md:py-4 bg-gradient-to-tl shadow-2xl from-white to-secondary-100 dark:from-slate-800  dark:to-slate-700 md:dark:to-slate-800 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700"
              >
                <Icon className={`md:h-8 md:w-8 h-5 w-5 ${color} mb-4 ml-2`} />
                <div className="flex flex-row justify-between ">
                  <h3 className=" text-sm sm:text-lg font-semibold text-primary-900 dark:text-white mx-auto md:mx-0">{title}</h3>
                  <p className={`absolute md:static top-0.5 right-3 mt-1  md:-mt-1 text-xl md:text-3xl font-bold ${color}`}>{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <div className="hidden overflow-x-auto md:block ">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-600 dark:text-white">
                  <tr>
                    <th className="py-2 px-4">ID</th>
                    <th className="py-2 px-4">Nombre</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Rol</th>
                    <th className="py-2 px-4 w-3/12">Acciones</th>
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
                        {![1, 36,37].includes(u.id) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => askDelete(u)}
                              className="rounded bg-red-600 px-4 py-1 font-semibold text-white hover:bg-red-700"
                            >
                              Borrar
                            </button>
                            <button
                              onClick={() => askEdit(u)}
                              className="ml-4 rounded bg-blue-600 px-4 py-1 font-semibold text-white hover:bg-blue-700"
                            >
                              Editar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* modal confirmacion borrar */}
            {confirmDeleteUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
                <div className="w-full max-w-sm rounded-xl bg-white dark:text-primary-50 p-6 shadow-lg dark:bg-slate-800 ">
                  <h3 className="mb-4 text-lg font-semibold">¿Estás seguro de que quieres borrar el usuario {userToDelete?.name}?</h3>
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmDeleteUser(false)} className="rounded-lg border px-4 py-2 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500">Cancelar</button>
                    <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Borrar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Ssheet create update users */}
            <AnimatePresence>{modalSheetOpen && <Sheet openSheetUser={setModalSheetOpen} user={selectedUser} users={users} />}</AnimatePresence>
          </div>
        </>
      )}

      {/* Modal gestion categorias */}

      {modalCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
          <div className="w-full relative max-w-sm rounded-xl bg-white dark:text-primary-50 p-6 shadow-lg dark:bg-slate-800 ">
            <div className="absolute right-2 top-2">
              <button onClick={() => setModalCategories(false)} className="rounded-lg border px-1.5 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500 cursor-pointer">X</button>
            </div>
            <h3 className="mb-4 text-lg font-semibold">Gestionar categorias</h3>
            <div>
              <div className='flex justify-between items-center mb-4'>
                <p className="mb-4 text-sm font-semibold">Categorias existentes</p>
                <button onClick={() => setModalAddCategories(true)} className="rounded-lg border px-1.5 py-0.5 bg-slate-200 hover:bg-slate-50 dark:text-primary-900 dark:border-slate-400 dark:hover:bg-slate-500"><MdPostAdd /></button>
              </div>
              <ul className="space-y-2 overflow-y-auto max-h-80">
                {categories.map(cat => (
                  <li key={cat.id} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
                    <span>{cat.name}</span>
                    {user.role_id === 1 && (
                      <div className='flex gap-2'>
                        <button className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700" onClick={() => { deleteCategory(cat) }}>Eliminar</button>
                        <button className='roundeºd bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700' onClick={() => { editing(cat.id) }}>Editar</button>
                      </div>
                    )}

                  </li>
                ))}
              </ul>
            </div>
          </div>
          {modalAddCategories && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
              <div className="w-full max-w-sm rounded-xl bg-white dark:text-primary-50 p-6 shadow-lg dark:bg-slate-800 ">
                <h3 className="mb-4 text-lg font-semibold">Añadir categoria</h3>
                <input type="text" name='nameCategory' onChange={handleChange} value={nameCategory} placeholder="Nombre de la categoria" className="w-full border border-gray-300 rounded-md p-2 mb-4" />
                <div className='flex justify-end gap-3'>
                  {categoryId !== null ? (<button onClick={() => updateCategory(categoryId)} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" >Editar</button>) : (<button onClick={addCategories} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" >Añadir</button>)
                  }

                  <button onClick={() => setModalAddCategories(false)} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
