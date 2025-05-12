import { Fragment, useContext, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '../components/ThemeToogle';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Anuncios', path: '/anuncios' }
];

export default function Layout() {
  const { logoutUser, user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const isUser = user?.role_id === 3;


  const closeMobileNav = () => {
    console.log('');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br 
                    from-brand-400/20 via-amber-200/40 to-white
                    dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">

      {/* Header con menú de navegación */}
      <Disclosure as="nav" className="bg-white/100 backdrop-blur-sm shadow-sm dark:bg-slate-900/100 fixed md:static w-full z-10">
        {({ open }) => (
          <>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
              {/* Logo / Home */}
              <Link to="/home" className="text-2xl font-extrabold text-primary-900 dark:text-white">
                Sucer
              </Link>



              {/* Desktop Nav */}
              <div className="hidden md:flex md:items-center md:gap-8">
                {/* <p className="text-sm font-normal text-slate-500 dark:text-slate-400 mr-5">
                      {user?.email}
                  </p> */}
                {navLinks.map(l => (
                  (isUser && l.name === 'Dashboard') ? null : (
                    <Link
                      key={l.name}
                      to={l.path}
                      className={`text-sm font-medium transition ${pathname.startsWith(l.path)
                        ? 'bg-brand-600/10 text-brand-700 dark:bg-brand-400/10 dark:text-white dark:hover:bg-brand-400/20 scale-120'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                        }`}
                    >
                      {l.name}
                    </Link>
                  )
                ))}
                <ThemeToggle closeMobileNav={closeMobileNav} />
                <button
                  onClick={logoutUser}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700 focus-visible:outline-red-600"
                >
                  Logout
                </button>
              </div>

              {/* Botón hamburguesa móvil */}
              <Disclosure.Button className="md:hidden dark:bg-slate-600 rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-600">
                {open ?
                  <div className='flex items-center gap-2'>
                    {/* <p className="text-sm font-normal text-slate-500 dark:text-slate-400 mr-5">
                      {user?.email}
                    </p> */}
                    <XMarkIcon className="h-6 w-6" />
                  </div>

                  : <Bars3Icon className="h-6 w-6" />}
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
                {({ close }) => (
                  <MobileNav
                    navLinks={navLinks}
                    pathname={pathname}
                    logoutUser={() => {
                      logoutUser();
                      close();
                    }}
                    closeMobileNav={close}
                  />
                )}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      {/* Main */}
      <motion.main
        className="flex-1 mt-8 md:mt-0 "
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
function MobileNav({ navLinks, pathname, logoutUser, closeMobileNav }) {
  const { user } = useContext(AuthContext);
  const isUser = user?.role_id === 3;

  const navRef = useRef(null);

  // hook para cerrar el menú móvil al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMobileNav();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMobileNav]);


  return (
    <div ref={navRef} className="space-y-1 px-4 pb-4">
      <div className="flex items-center gap-2">
        <ThemeToggle closeMobileNav={closeMobileNav} className="w-10 h-10" />
        {navLinks.map(l => (
          (isUser && l.name === 'Dashboard') ? null : (
            <Link
              key={l.name}
              to={l.path}
              onClick={closeMobileNav} // 👈 aquí cierras el menú al navegar
              className={`text-sm font-medium ml-4 transition ${pathname.startsWith(l.path)
                  ? 'bg-brand-600/10 text-brand-700 dark:bg-brand-400/10 dark:text-white dark:hover:bg-brand-400/20 scale-120'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white '
                }`}
            >
              {l.name}
            </Link>
          )
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
