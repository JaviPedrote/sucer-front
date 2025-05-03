/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, BellAlertIcon, ChartPieIcon } from '@heroicons/react/24/solid';


const features = [
  {
    icon: AcademicCapIcon,
    title: 'Aprendizaje Organizado',
    text: 'Mantén exámenes y tareas siempre a la vista para mejorar tu planificación.'
  },
  {
    icon: BellAlertIcon,
    title: 'Alertas Urgentes',
    text: 'Notificaciones instantáneas ante anuncios importantes o cambios de última hora.'
  },
  {
    icon: ChartPieIcon,
    title: 'Estadísticas',
    text: 'Datos rápidos para el personal directivo: anuncios totales, categorías y destacados.'
  }
];

// Variantes de animación centralizadas
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Home() {
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <section className="relative isolate overflow-hidden">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 "
      />

      {/* HERO */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-4 pt-24 pb-16 text-center lg:pt-32"
      >
        <h1 className="text-transparent dark:bg-secondary-900 bg-primary-900 bg-clip-text
          [mask-image:linear-gradient(90deg,transparent_0%,#000_80%,#000_150%,transparent_200%)]
          [-webkit-mask-image:linear-gradient(90deg,transparent_0%,#000_30%,#000_70%,transparent_100%)]
          [mask-size:200%_100%] [-webkit-mask-size:200%_100%] animate-wipe-x text-5xl font-extrabold">


          ¡Hola, {user}! Bienvenido a&nbsp; Sucer

        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">
          El tablón digital que conecta estudiantes, profesorado y familias en un solo lugar.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <PrimaryButton as={Link} to="/anuncios">
            Ver anuncios
          </PrimaryButton>
          <PrimaryButton as={Link} to="/dashboard">
            Ir al dashboard
          </PrimaryButton>
        </div>
      </motion.div>

      {/* FEATURES */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <motion.div
            key={title}
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800"
          >
            {/* Decorative blob */}
            <div
              aria-hidden
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-brand-100 opacity-60 blur-3xl transition group-hover:scale-110 dark:bg-brand-600/20"
            />
            <Icon className="relative z-10 h-10 w-10 text-brand-500 dark:text-secondary-800" />
            <h3 className="relative z-10 mt-6 font-semibold text-slate-900 dark:text-secondary-800">
              {title}
            </h3>
            <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-600 dark:text-secondary-800">
              {text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// Botones reutilizables para el dashboard y home
export function PrimaryButton({ as: Component = 'button', children, ...props }) {
  return (
    <Component
      {...props}
      className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold shadow-2xl text-primary-900 border transition duration-200 hover:scale-110 dark:bg-amber-500"
    >
      {children}
    </Component>
  );
}

function SecondaryButton({ as: Component = 'button', children, ...props }) {
  return (
    <Component
      {...props}
      className="inline-flex items-center justify-center rounded-full border border-slate-300/60 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600/50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {children}
    </Component>
  );
}
