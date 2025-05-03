import { Fragment, useEffect, useState, memo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getPosts } from '../services/postServices';

const categories = {
  all: { id: null, name: 'Todas', badge: 'bg-slate-200 text-slate-700' },
  1: { id: 1, name: 'Exámenes', badge: 'bg-blue-100 text-blue-700' },
  2: { id: 2, name: 'Tareas', badge: 'bg-amber-100 text-amber-700' },
  3: { id: 3, name: 'Padres', badge: 'bg-emerald-100 text-emerald-700' },
  4: { id: 4, name: 'Administración', badge: 'bg-purple-100 text-purple-700' },
};


export function Anuncios() {
  const [selected, setSelected] = useState(categories.all);
  const [anuncios, setAnuncios] = useState([]);
  // const anuncios = [
  //   { id: 1, title: 'Examen Matemáticas', content: 'Examen de matemáticas el próximo viernes.', urgent: false, category_id: 1 },
  //   { id: 2, title: 'Entrega de Tareas', content: 'Fecha límite para entregar tareas de historia.', urgent: false, category_id: 2 },
  //   { id: 3, title: 'Reunión Padres', content: 'Reunión de padres se celebrará el lunes.', urgent: true, category_id: 3 },
  //   { id: 4, title: 'Actualización Reglamento', content: 'Nuevas normas de comportamiento escolar.', urgent: false, category_id: 4 },
  //   { id: 5, title: 'Examen Física', content: 'Examen de física el miércoles.', urgent: true, category_id: 1 },
  //   { id: 6, title: 'Tarea Matemáticas', content: 'Resolver ejercicios del 5 al 10.', urgent: false, category_id: 2 },
  //   { id: 7, title: 'Charla Padres', content: 'Invitación a charla sobre hábitos de estudio.', urgent: false, category_id: 3 },
  //   { id: 8, title: 'Administración Horarios', content: 'Cambio de horario de secretaría.', urgent: false, category_id: 4 },
  //   { id: 9, title: 'Examen Inglés', content: 'Practicar vocabulario para examen.', urgent: false, category_id: 1 },
  //   { id: 10, title: 'Entrega Proyecto', content: 'Fecha de entrega del proyecto final.', urgent: true, category_id: 2 },
  // ];





  /* Ejemplo de llamada a la API */
  useEffect(() => {
    (async () => {
      const res = await getPosts();
      console.log(res?.data);
      setAnuncios(res?.data);
    })();
  }, [anuncios]);

  const filtered = anuncios.filter(
    a => selected.id === null || a.category_id === selected.id
  );


  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {/* Header + filtro */}
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-primary-900 dark:text-white">
          Anuncios
        </h1>

        {/* Selector de categorías */}
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative w-56">
            <Listbox.Button className="w-full rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm
                                       focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-800">
              <span className="block truncate text-white">{selected.name}</span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg dark:bg-slate-800">
                {Object.values(categories).map(cat => (
                  <Listbox.Option
                    key={cat.id ?? 'all'}
                    value={cat}
                    className={({ active }) =>
                      `cursor-pointer hover:text-secondary-900 select-none py-2 pl-3 pr-9 ${active ? 'bg-brand-600/10 text-brand-700 dark:text-brand-300' : 'text-slate-700 dark:text-slate-200'
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
      </header>

      {/* Grid de anuncios */}
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(a => {
          const cat = categories[a.category_id];
          return (
            <motion.li
              key={a.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="cursor-pointer rounded-2xl border border-transparent bg-white p-6 shadow-sm bg-gradient-to-b
                         dark:from-slate-800 dark:to-slate-900 dark:bg-slate-800/50"
              onClick={() => a.urgent && toast.warn('¡Este anuncio es urgente!')}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white">{a.title}</h2>
                {a.urgent && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-600/20 dark:text-red-400">
                    Importante
                  </span>
                )}
              </div>

              <p className="mt-3 text-slate-700 dark:text-slate-300">{a.content}</p>

              <span className={`mt-4 inline-block rounded px-2 py-0.5 text-xs font-medium
                                ${cat?.badge ?? 'bg-slate-100 text-slate-600'} dark:bg-opacity-20`}>
                {cat?.name ?? 'Sin categoría'}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}