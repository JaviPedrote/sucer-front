import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { IoClose } from 'react-icons/io5';
import { useCreatePost, useUpdatePost } from '../../hooks/usePosts';
import { getCategories } from '../../services/categoriesServices';

const SheetPost = memo(({ sheetNewPost, post }) => {
  const [formData, setFormData] = useState({ title: '', content: '', category_id: '' });
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    (async () => {
      const { data } = await getCategories();         // ← data ya es array
      setCategories(data);                  // anteponemos “Todas”
    })();
  }, []);

  // Hook para creación
  const createPost = useCreatePost()

  // Hook para actualización
  const updatePost = useUpdatePost()

  useEffect(() => {
    if (post) {
      setFormData({ title: post.title, content: post.content, category_id: post.category.id });
    }
    return () => setFormData({ title: '', content: '', category_id: '' });
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category_id) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }
    createPost.mutate(formData, {
      onSuccess: () => {
        toast.success('Anuncio creado correctamente');
        sheetNewPost(false);
      },
      onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al crear el anuncio'),
    });
    toast.info('Creando anuncio...');
  };


  const handleEdit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category_id) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    updatePost.mutate({ id: post.id, data: formData }, {
      onSuccess: () => {
        toast.success('Anuncio editado correctamente');
        sheetNewPost(false);
      },
      onError: (err) => toast.error(err?.response?.data?.message ?? 'Error al editar el anuncio'),
    });
    toast.info('Editando anuncio...');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={() => sheetNewPost(false)} />
      <motion.div className="relative ml-auto w-full max-w-sm md:max-w-xl bg-white dark:bg-slate-800 p-6 shadow-xl flex flex-col" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">{post ? 'Editar anuncio' : 'Agregar anuncio'}</h3>
          <button onClick={() => sheetNewPost(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400"><IoClose className="h-6 w-6" /></button>
        </div>
        <form className="space-y-4 flex-1">
          <div>
            <label htmlFor="title" className="block text-sm font-medium dark:text-white">Titulo</label>
            <input id="title" name="title" type="text" placeholder="Titutlo" value={formData.title} onChange={handleChange} className="mt-1 w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white" />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium dark:text-white">Contenido</label>
            <textarea id="content" name="content" type="text" placeholder="Escriba aqui el contenido del anuncio" value={formData.content} onChange={handleChange} className="mt-1 w-full  min-h-30 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50 dark:border p-1 pl-2 dark:text-white" />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium dark:text-white">Categoria</label>
            <div className="relative mt-1">
              <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} className="w-full appearance-none rounded-md border border-gray-300 pl-2 pr-10 py-2 shadow-sm focus:ring focus:ring-opacity-50 dark:text-white">
                <option value="" disabled>Selecciona una categoria</option>
                {categories.map(cat => (
                  <option className='text-black' key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button onClick={post ? handleEdit : handleCreate} className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {post ? 'Editar anuncio' : 'Crear anuncio'}
          </button>
        </form>
      </motion.div>
    </div>
  );
});

export default SheetPost;
