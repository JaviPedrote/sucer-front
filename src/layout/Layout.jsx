import { Fragment, useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../components/ThemeToogle';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Anuncios', path: '/anuncios' },
];

export default function Layout() {
  const { user, logoutUser } = useContext(AuthContext);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br
                    from-brand-400/20 via-amber-200/40 to-white
                    dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
      <Disclosure as="nav" className="bg-white/80 backdrop-blur-sm shadow-sm dark:bg-slate-900/80">
        {({ open }) => (
          <>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
              {/* Logo / Home */}
              <Link to="/home" className="text-2xl font-extrabold text-primary-900 dark:text-white">
                Sucer
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex md:items-center md:gap-8">
                {navLinks.map(l => (
                  <Link
                    key={l.name}
                    to={l.path}
                    className={`text-sm font-medium transition ${
                      pathname.startsWith(l.path)
                        ? 'bg-brand-600/10 text-brand-700 dark:bg-brand-400/10 dark:text-white dark:hover:bg-brand-400/20 scale-120'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
                <ThemeToggle />
                <button
                  onClick={logoutUser}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 focus-visible:outline-red-600"
                >
                  Logout
                </button>
              </div>

              {/* Botón hamburguesa móvil */}
              <Disclosure.Button className="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>

            {/* Panel Mobile con transición */}
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-y-75"
              enterTo="opacity-100 scale-y-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-y-100"
              leaveTo="opacity-0 scale-y-75"
              className="md:hidden origin-top"
            >
              <Disclosure.Panel static>
                <MobileNav
                  navLinks={navLinks}
                  pathname={pathname}
                  user={user}
                  logoutUser={logoutUser}
                />
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/* Main */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

// Componente para el menú de navegación móvil
function MobileNav({ navLinks, pathname, logoutUser }) {
  return (
    <div className="space-y-1 px-4 pb-4 pt-2">
      <div className="flex items-center gap-2">
        <ThemeToggle className="w-10 h-10" />
        {navLinks.map(l => (
          <Link
            key={l.name}
            to={l.path}
            className={`rounded-lg px-3 py-2 text-base font-medium ml-2 transition ${
              pathname.startsWith(l.path)
                ? 'text-amber-500 scale-115'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {l.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={logoutUser}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
