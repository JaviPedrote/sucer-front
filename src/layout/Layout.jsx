import { useContext, useState, Fragment } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { IoCloseOutline } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';

export default function Layout() {
  const { logoutUser, user } = useContext(AuthContext);

  console.log(user.name)
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-300 to-primary-200">

      <nav className="bg-white shadow-md w-full ">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link to="/home" className="text-2xl font-extrabold text-primary-900">Sucer</Link>
          {/* Pc */}

          {/* <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-700">Hola,&nbsp;<strong>{user?.name || 'Javier'}</strong></span>
            <button
              onClick={logoutUser}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div> */}
          {/* Movil*/}
          <button
            onClick={() => setMobileOpen(true)}
            className="focus:outline-none"
          >

            {!mobileOpen ? (<Bars3Icon className="w-7 h-7 text-gray-900" />) : (<IoCloseOutline className="w-8 h-8 text-gray-800" />)}
          </button>
        </div>
      </nav>

      {/*  Modal Movil  */}
      <Transition appear show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setMobileOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="absolute space-y-2 top-16 right-4 md:top-13 md:right-16 w-full max-w-40 md:max-w-55 transform overflow-hidden rounded border border-primary-100 bg-white pb-3 px-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 ">
                    {user?.name }
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Hola, {user?.name || 'Javier'}
                    </p>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className='w-full'>
                    <div className="w-full py-2 bg-primary-900 text-secondary-900 font-bold rounded-lg hover:bg-secondary-900 hover:text-primary-800 transition mb-2 text-center">
                      Dashboard
                    </div>
                  </Link>
                  <Link to="/anuncios" onClick={() => setMobileOpen(false)} className='w-full'>
                    <div className="w-full py-2 bg-primary-900 text-secondary-900 font-bold rounded-lg hover:bg-secondary-900 hover:text-primary-800 transition mb-2 text-center">
                      Anuncios
                    </div>
                  </Link>
                  <button
                    onClick={() => { logoutUser(); setMobileOpen(false); }}
                    className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-white hover:text-red-600 hover:outline transition cursor-pointer"
                  >
                    Logout
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ---------- Main ---------- */}
      <motion.main
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
