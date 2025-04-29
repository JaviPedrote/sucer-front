import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, BellAlertIcon, ChartPieIcon } from '@heroicons/react/24/outline';

export function Home() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Aprendizaje Organizado',
      text: 'Mantén exámenes y tareas siempre a la vista para mejorar la planificación.'
    },
    {
      icon: BellAlertIcon,
      title: 'Alertas Urgentes',
      text: 'Notificaciones inmediatas ante anuncios importantes o cambios de última hora.'
    },
    {
      icon: ChartPieIcon,
      title: 'Estadísticas',
      text: 'Datos rápidos para el personal directivo: anuncios totales, categorías y destacados.'
    }
  ];

  return (
    <motion.section
      className="max-w-6xl mx-auto py-16 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-900 mb-4">
          Bienvenido a Sucer
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          El tablón digital que conecta estudiantes, profesores y familias en un mismo lugar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/anuncios" className="px-6 py-3 rounded-lg bg-secondary-900 text-white font-semibold hover:bg-secondary-800 transition">
            Ver Anuncios
          </Link>
          <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-primary-900 text-secondary-100 font-semibold hover:bg-primary-800 transition">
            Ir al Dashboard
          </Link>
        </div>
      </div>

   
      <div className="grid gap-8 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white rounded-3xl shadow-xl hover:scale-105 hover:md:scale-110 transition duration-500 cursor-default"
            // whileHover={{ scale: 1.10 }}
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-secondary-200 mb-4">
              <Icon className="w-8 h-8 text-secondary-900" />
            </div>
            <h3 className="text-primary-900 font-semibold text-xl mb-2">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}