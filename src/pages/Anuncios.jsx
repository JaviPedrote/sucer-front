import { Fragment, useEffect, useState, useMemo, memo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { usePosts } from '../hooks/usePosts';
import { getCategories } from '../services/categoriesServices';

const ALL = { id: null, name: 'Todas' };

export function Anuncios() {
  const [categories, setCategories] = useState([ALL]);
  const [selected, setSelected] = useState(ALL);
  const { data } = usePosts();
  const anuncios = data?.data ?? [];

  useEffect(() => {
    (async () => {
      const { data } = await getCategories();
      setCategories([ALL, ...data]);
    })();
  }, []);

  const categoriesById = useMemo(
    () => categories.reduce((acc, c) => ({ ...acc, [c.id]: c }), {}),
    [categories]
  );

  const filtered = useMemo(
    () =>
      anuncios.filter(
        a => selected.id === null || a.category?.id === selected.id
      ),
    [anuncios, selected]
  );

  return (
    <section
      aria-labelledby="anuncios-title"
      className="mx-auto max-w-7xl px-5 py-10 space-y-6"
    >
      <header className="flex flex-col md:flex-row items-center justify-between mb-10">
        <h1
          id="anuncios-title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-6 md:mb-0"
        >
          Anuncios
        </h1>
        <CategorySelector
          categories={categories}
          selected={selected}
          onChange={setSelected}
        />
      </header>

      <AnnouncementGrid
        filtered={filtered}
        categoriesById={categoriesById}
      />
    </section>
  );
}

function CategorySelector({ categories, selected, onChange }) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-56">
        <Listbox.Button className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800">
          <span className="block truncate dark:text-white">
            {selected.name}
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg focus:outline-none dark:bg-gray-800">
            {categories.map(cat => (
              <Listbox.Option
                key={cat.id ?? 'all'}
                value={cat}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 pl-3 pr-9 ${
                    active
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200'
                  }`
                }
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {cat.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

const AnnouncementGrid = memo(({ filtered, categoriesById }) => (
  <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 p-2">
    {filtered.map(item => (
      <AnnouncementCard
        key={item.id}
        announcement={item}
        category={categoriesById[item.category?.id]}
      />
    ))}
  </ul>
));

const AnnouncementCard = memo(({ announcement, category }) => {
  const { title, content, urgent } = announcement;
  const badgeClasses = category?.badge
    ? `${category.badge} dark:bg-opacity-20`
    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';

  const handleAction = () => {
    if (urgent) toast.warn('¡Este anuncio es urgente!');
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="cursor-pointer"
    >
      <article
        role="button"
        tabIndex={0}
        onClick={handleAction}
        onKeyDown={e =>
          (e.key === 'Enter' || e.key === ' ') && handleAction()
        }
        className="
          flex flex-col h-full rounded-xl border border-gray-200
          bg-white p-6 shadow-sm transition-shadow hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500
          dark:border-gray-700 dark:bg-gray-800
        "
      >
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          {urgent && (
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-600/20 dark:text-red-400">
              Importante
            </span>
          )}
        </header>
        <p className="flex-grow text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {content}
        </p>
        <footer className="mt-4">
          <span
            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${badgeClasses}`}
          >
            {category?.name ?? 'Sin categoría'}
          </span>
        </footer>
      </article>
    </motion.li>
  );
});

export default Anuncios;
