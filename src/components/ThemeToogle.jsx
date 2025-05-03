// ThemeToggle.jsx
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

export function ThemeToggle({ className = '' }) {
  //  Comprobamos primero localStorage, si no existe miramos la preferencia del SO
  const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [theme, setTheme] = useState(
    () => sessionStorage.getItem('theme') ?? getSystemTheme()
  );

  //  Aplica la clase .dark al <html> y guarda la preferencia
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className={
        `inline-flex h-9 w-9 items-center justify-center rounded-lg
         bg-slate-100 text-slate-600 shadow-sm transition
         hover:bg-slate-200 hover:text-slate-900
         dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 ` + className
      }
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}
