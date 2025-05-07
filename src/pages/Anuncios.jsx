import { Fragment, useState, } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usePosts } from '../hooks/usePosts';

const categories = {
  all: { id: null, name: 'Todas', badge: 'bg-slate-200 text-slate-700' },
  1: { id: 1, name: 'amet', badge: 'bg-blue-100 text-blue-700' },
  2: { id: 2, name: 'voluptas', badge: 'bg-amber-100 text-amber-700' },
  3: { id: 3, name: 'qui', badge: 'bg-emerald-100 text-emerald-700' },
  4: { id: 4, name: 'ipsan', badge: 'bg-purple-100 text-purple-700' },
};


export function Anuncios() {
  const [selected, setSelected] = useState(categories.all);
  const { data, error, isLoading } = usePosts();



  // data viene directamente como array (no data.data)
  const anuncios = data?.data ?? []


  const filtered = anuncios?.filter(
    a => selected.id === null || a.category.id === selected.id
  );


  return (
    <section className="mx-auto max-w-7xl px-5 py-10 mt-4 md:mt-0 space-y-6 md:space-y-10">
     
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-6 md:mb-0">
          Anuncios
        </h1>

        {/* Selector de categorías */}
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative w-56">
            <Listbox.Button className="w-full rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm
                                       focus:outline-none focus:ring-brand-500 dark:bg-slate-800">
              <span className="block truncate  dark:text-white">{selected?.name}</span>
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
        {filtered?.map(a => {
          const cat = categories[a.category.id];
          return (
            <motion.li
              key={a.id}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="cursor-pointer rounded-xl md:rounded-3xl bg-white pl-5 py-3 md:px-6 md:py-6 bg-gradient-to-tl shadow-2xl from-white to-secondary-100 dark:from-slate-800  dark:to-slate-700 md:dark:to-slate-800 dark:bg-slate-800/50 outline outline-amber-600/40 dark:outline-primary-700"
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