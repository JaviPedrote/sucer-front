import React, { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const categories = [
  { id: null, name: 'Todas', color: 'bg-gray-50' },
  { id: 1, name: 'Exámenes', color: 'bg-blue-50' },
  { id: 2, name: 'Tareas Pendientes', color: 'bg-amber-50' },
  { id: 3, name: 'Padres', color: 'bg-emerald-50' },
  { id: 4, name: 'Administración', color: 'bg-purple-50' },
];

export function Anuncios() {
  const [selected, setSelected] = useState(categories[0]);
  const anuncios = [
    { id: 1, title: 'Examen Matemáticas', content: 'Examen de matemáticas el próximo viernes.', urgent: false, category_id: 1 },
    { id: 2, title: 'Entrega de Tareas', content: 'Fecha límite para entregar tareas de historia.', urgent: false, category_id: 2 },
    { id: 3, title: 'Reunión Padres', content: 'Reunión de padres se celebrará el lunes.', urgent: true, category_id: 3 },
    { id: 4, title: 'Actualización Reglamento', content: 'Nuevas normas de comportamiento escolar.', urgent: false, category_id: 4 },
    { id: 5, title: 'Examen Física', content: 'Examen de física el miércoles.', urgent: true, category_id: 1 },
    { id: 6, title: 'Tarea Matemáticas', content: 'Resolver ejercicios del 5 al 10.', urgent: false, category_id: 2 },
    { id: 7, title: 'Charla Padres', content: 'Invitación a charla sobre hábitos de estudio.', urgent: false, category_id: 3 },
    { id: 8, title: 'Administración Horarios', content: 'Cambio de horario de secretaría.', urgent: false, category_id: 4 },
    { id: 9, title: 'Examen Inglés', content: 'Practicar vocabulario para examen.', urgent: false, category_id: 1 },
    { id: 10, title: 'Entrega Proyecto', content: 'Fecha de entrega del proyecto final.', urgent: true, category_id: 2 },
  ];
  const filtered = anuncios.filter(a => selected.id === null || a.category_id === selected.id);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
          <h1 className="text-3xl font-bold text-primary-900">Anuncios</h1>
          {/* Filtro */}
          <Listbox value={selected} onChange={setSelected} className="w-60">
            <div className="relative">
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-secondary-700">
                <span className="block truncate">{selected.name}</span>
              </Listbox.Button>
              <Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none">
                  {categories.map(cat => (
                    <Listbox.Option
                      key={cat.id}
                      value={cat}
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                          active ? 'bg-secondary-100 text-secondary-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-medium' : ''}`}>{cat.name}</span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(anuncio => {
            const cat = categories.find(c => c.id === anuncio.category_id);
            return (
              <motion.div
                key={anuncio.id}
                className={`p-6 rounded-lg shadow-lg border-l-4 ${cat?.color || 'bg-white'} ${
                  anuncio.urgent ? 'border-red-500' : 'border-transparent'
                }`}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => anuncio.urgent && toast.warn('¡Este anuncio es urgente!')}
              >
                <h2 className="text-xl font-semibold text-primary-900">{anuncio.title}</h2>
                {anuncio.urgent && (
                  <span className="inline-block mt-2 px-2 py-1 text-sm bg-red-100 text-red-700 rounded">Urgente</span>
                )}
                <p className="mt-2 text-gray-700">{anuncio.content}</p>
                <p className="mt-2 text-gray-500 text-sm">Categoría: {cat?.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
