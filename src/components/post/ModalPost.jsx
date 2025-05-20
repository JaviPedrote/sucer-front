/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const ModalPost = ({ open, onClose, announcement }) => {

  console.log("ModalPost", announcement);
  // Estado para controlar la animación de salida
  const [isVisible, setIsVisible] = useState(open);
  // Sincronizar el estado visible con la prop open
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  // Manejar el cierre con animación
  const handleClose = () => {
    setIsVisible(false);
    // Esperar a que termine la animación antes de cerrar realmente
    setTimeout(() => {
      onClose();
    }, 300); // Debe coincidir con la duración de la animación de salida
  };

  // Evitar scroll de fondo cuando el modal está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") handleClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, handleClose]);

  // Solo renderizar si hay un anuncio
  if (!announcement) return null;

  // Variantes de animación para el overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  // Variantes de animación para el contenido del modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/60 px-2 py-6"
          onClick={handleClose}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            key="modal-content"
            className="relative bg-white rounded-lg p-4 px-6 min-w-[300px] max-h-full max-w-lg shadow-lg dark:bg-slate-800 overflow-auto"
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors duration-200"
                aria-label="Cerrar"
              >
                <RiCloseFill className="h-6 w-6" />
              </button>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-50 mb-2">
                {announcement.title}
              </h2>
            </div>
            <p className="text-base text-gray-200 dark:text-gray-200 my-6">
              {announcement.content}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            </p>
            <info className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex flex-col">
              <div>
                De {announcement.user?.name} , escrito el dia  {new Date(announcement.created_at).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="">Categoria: <span className="text-blue-50">{announcement.category?.name}</span>
              </div>
            </info>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalPost;
